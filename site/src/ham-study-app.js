const questionCountPerExam = 20;
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
let defaultScoreText = "";
let examState = {};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tabTarget));
});

document.addEventListener("click", handleClick);

initializeApp();

async function initializeApp() {
  try {
    const studyData = await readStudyData();
    defaultScoreText = `Random ${questionCountPerExam} questions from ${studyData.questions.length} available`;
    examState = createExamSets(studyData.examConfigs, studyData.questions);

    studyData.examConfigs.forEach((config) => {
      renderExam(config, examState[config.id]);
    });
  } catch (error) {
    console.error(error);
    renderLoadError();
  }
}

async function readStudyData() {
  const element = document.getElementById("study-data");
  if (element) {
    const parsed = JSON.parse(element.textContent);
    validateStudyData(parsed);
    return parsed;
  }

  const response = await fetch("./content/question-bank.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load study data: ${response.status} ${response.statusText}`);
  }

  const parsed = await response.json();
  validateStudyData(parsed);
  return parsed;
}

function validateStudyData(parsed) {
  if (!Array.isArray(parsed.examConfigs) || !Array.isArray(parsed.questions)) {
    throw new Error("Study data payload is invalid.");
  }
}

function renderLoadError() {
  const panel = document.querySelector('[data-tab-panel="guide"]');
  if (!panel) {
    return;
  }

  panel.innerHTML = `
    <div class="guide-grid">
      <article class="card prose">
        <h2>Unable to Load Study Data</h2>
        <p>The question bank could not be loaded. Refresh the page or verify that <code>content/question-bank.json</code> is being served.</p>
      </article>
    </div>
  `;
}

function createExamSets(examConfigs, questionBank) {
  const requiredQuestions = examConfigs.length * questionCountPerExam;
  if (questionBank.length < requiredQuestions) {
    throw new Error(`Expected at least ${requiredQuestions} questions, received ${questionBank.length}.`);
  }

  const pool = shuffleArray(questionBank.slice());
  const state = {};

  examConfigs.forEach((config, index) => {
    const start = index * questionCountPerExam;
    state[config.id] = pool.slice(start, start + questionCountPerExam);
  });

  return state;
}

function shuffleArray(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const next = items[index];
    items[index] = items[swapIndex];
    items[swapIndex] = next;
  }

  return items;
}

function activateTab(target) {
  const activeButton = tabButtons.find((item) => item.dataset.tabTarget === target);

  tabButtons.forEach((item) => {
    item.classList.toggle("is-active", item === activeButton);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
  });
}

function renderExam(config, questions) {
  const panel = document.querySelector(`[data-tab-panel="${config.id}"]`);
  if (!panel) {
    return;
  }

  panel.innerHTML = `
    <div class="exam-shell">
      <div class="exam-intro">
        <div>
          <h2>${config.title}</h2>
          <p>${config.description}</p>
        </div>
        <div class="exam-actions">
          <button class="action-button primary" type="button" data-exam-action="score">Score Exam</button>
          <button class="action-button secondary" type="button" data-exam-action="reset">Reset</button>
          <output class="score-output" data-score-output aria-live="polite">${defaultScoreText}</output>
        </div>
      </div>
      <div class="question-list" data-question-list></div>
    </div>
  `;

  const list = panel.querySelector("[data-question-list]");
  questions.forEach((question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question-card";
    fieldset.innerHTML = `
      <h3>${index + 1}. ${question.prompt}</h3>
      <div class="option-list">
        ${Object.entries(question.options)
          .map(
            ([key, value]) => `
              <label class="option-item">
                <input type="radio" name="${config.id}-q-${index}" value="${key}" />
                <span><strong>${key}.</strong> ${value}</span>
              </label>
            `
          )
          .join("")}
      </div>
      <p class="feedback" data-feedback></p>
    `;
    list.appendChild(fieldset);
  });
}

function handleClick(event) {
  const examButton = event.target.closest("[data-exam-action]");
  if (examButton) {
    const panel = examButton.closest("[data-tab-panel]");
    const questions = examState[panel?.dataset.tabPanel];
    if (!panel || !questions) {
      return;
    }

    if (examButton.dataset.examAction === "score") {
      scoreExam(panel, questions);
      return;
    }

    if (examButton.dataset.examAction === "reset") {
      resetExam(panel);
      return;
    }
  }

  const ohmsButton = event.target.closest("[data-ohms-action]");
  if (!ohmsButton) {
    return;
  }

  if (ohmsButton.dataset.ohmsAction === "solve") {
    solveOhmsLaw();
    return;
  }

  if (ohmsButton.dataset.ohmsAction === "clear") {
    clearOhmsLaw();
  }
}

function scoreExam(panel, questions) {
  const questionCards = Array.from(panel.querySelectorAll(".question-card"));
  let answered = 0;
  let correct = 0;

  questionCards.forEach((card, index) => {
    const feedback = card.querySelector("[data-feedback]");
    const selected = card.querySelector("input:checked");
    const question = questions[index];
    const correctText = `${question.answer}. ${question.options[question.answer]}`;

    feedback.className = "feedback";

    if (!selected) {
      feedback.classList.add("missed");
      feedback.textContent = `Unanswered. Correct answer: ${correctText}`;
      return;
    }

    answered += 1;
    if (selected.value === question.answer) {
      correct += 1;
      feedback.classList.add("correct");
      feedback.textContent = "Correct";
      return;
    }

    feedback.classList.add("missed");
    feedback.textContent = `Missed. Correct answer: ${correctText}`;
  });

  const percent = Math.round((correct / questions.length) * 100);
  panel.querySelector("[data-score-output]").textContent =
    `Answered ${answered}/${questions.length} | Score ${correct}/${questions.length} | ${percent}%`;
}

function resetExam(panel) {
  panel.querySelectorAll("input:checked").forEach((input) => {
    input.checked = false;
  });

  panel.querySelectorAll("[data-feedback]").forEach((feedback) => {
    feedback.className = "feedback";
    feedback.textContent = "";
  });

  panel.querySelector("[data-score-output]").textContent = defaultScoreText;
}

function solveOhmsLaw() {
  const values = {
    voltage: readOhmsValue("voltage"),
    current: readOhmsValue("current"),
    resistance: readOhmsValue("resistance"),
    power: readOhmsValue("power"),
  };
  const result = document.querySelector("[data-ohms-result]");
  const knownValues = Object.keys(values).filter((key) => values[key] !== null);

  if (!result) {
    return;
  }

  if (knownValues.length !== 2) {
    result.textContent = "Enter exactly two values so the calculator can solve the rest.";
    return;
  }

  const solved = computeOhmsLaw(values);
  if (!solved) {
    result.textContent = "Those values do not form a valid positive Ohm's Law combination.";
    return;
  }

  writeOhmsValue("voltage", solved.voltage);
  writeOhmsValue("current", solved.current);
  writeOhmsValue("resistance", solved.resistance);
  writeOhmsValue("power", solved.power);
  result.textContent = "Solved using Ohm's Law and the power equations.";
}

function clearOhmsLaw() {
  ["voltage", "current", "resistance", "power"].forEach((key) => {
    const input = document.querySelector(`[data-ohms-input="${key}"]`);
    if (input) {
      input.value = "";
    }
  });

  const result = document.querySelector("[data-ohms-result]");
  if (result) {
    result.textContent = "Enter two known values such as voltage and resistance.";
  }
}

function readOhmsValue(key) {
  const input = document.querySelector(`[data-ohms-input="${key}"]`);
  if (!input) {
    return null;
  }

  const rawValue = input.value.trim();
  if (!rawValue) {
    return null;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function writeOhmsValue(key, value) {
  const input = document.querySelector(`[data-ohms-input="${key}"]`);
  if (input) {
    input.value = formatOhmsValue(value);
  }
}

function formatOhmsValue(value) {
  const rounded = value >= 100 ? value.toFixed(2) : value.toFixed(4);
  return String(Number(rounded));
}

function computeOhmsLaw(values) {
  const { voltage, current, resistance, power } = values;

  if (voltage !== null && current !== null) {
    return finalizeOhmsSolution(voltage, current, voltage / current, voltage * current);
  }
  if (voltage !== null && resistance !== null) {
    return finalizeOhmsSolution(voltage, voltage / resistance, resistance, (voltage * voltage) / resistance);
  }
  if (voltage !== null && power !== null) {
    const nextCurrent = power / voltage;
    return finalizeOhmsSolution(voltage, nextCurrent, voltage / nextCurrent, power);
  }
  if (current !== null && resistance !== null) {
    return finalizeOhmsSolution(current * resistance, current, resistance, current * current * resistance);
  }
  if (current !== null && power !== null) {
    const nextVoltage = power / current;
    return finalizeOhmsSolution(nextVoltage, current, nextVoltage / current, power);
  }
  if (resistance !== null && power !== null) {
    const nextCurrent = Math.sqrt(power / resistance);
    return finalizeOhmsSolution(nextCurrent * resistance, nextCurrent, resistance, power);
  }

  return null;
}

function finalizeOhmsSolution(voltage, current, resistance, power) {
  const values = [voltage, current, resistance, power];
  if (!values.every((value) => Number.isFinite(value) && value > 0)) {
    return null;
  }

  return {
    voltage,
    current,
    resistance,
    power,
  };
}
