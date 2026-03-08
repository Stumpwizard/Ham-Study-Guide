const questionCountPerExam = 35;
const maxIncorrectToPass = 9;
const passingCorrectCount = questionCountPerExam - maxIncorrectToPass;
const defaultRulesQuestionTarget = 12;
const rulesKeywords = [
  "fcc",
  "call sign",
  "identify",
  "identification",
  "privileges",
  "control operator",
  "interference",
  "band plan",
  "broadcast",
  "one-way",
  "one way",
  "business",
  "pecuniary",
  "encoded",
  "cipher",
  "third party",
  "third-party",
  "profane",
  "obscene",
  "indecent"
];
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
let defaultScoreText = "";
let examState = {};
let questionBank = [];
let examConfigsById = {};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tabTarget));
});

document.addEventListener("click", handleClick);

initializeApp();

async function initializeApp() {
  try {
    const studyData = await readStudyData();
    questionBank = studyData.questions;
    examConfigsById = Object.fromEntries(studyData.examConfigs.map((config) => [config.id, config]));
    defaultScoreText = buildDefaultScoreText(questionBank.length);
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

function buildDefaultScoreText(totalQuestions) {
  return `Random ${questionCountPerExam} questions from ${totalQuestions} available | Pass with ${passingCorrectCount}/${questionCountPerExam} or better`;
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

function createExamSets(examConfigs, allQuestions) {
  if (allQuestions.length < questionCountPerExam) {
    throw new Error(`Expected at least ${questionCountPerExam} questions, received ${allQuestions.length}.`);
  }

  const state = {};
  examConfigs.forEach((config) => {
    state[config.id] = buildExamQuestionSet(allQuestions, config);
  });
  return state;
}

function buildExamQuestionSet(allQuestions, config) {
  const rulesQuestions = shuffleArray(allQuestions.filter(isRulesQuestion));
  const otherQuestions = shuffleArray(allQuestions.filter((question) => !isRulesQuestion(question)));
  const fallbackQuestions = shuffleArray(allQuestions.slice());
  const rulesTarget = Math.min(config.rulesTarget ?? defaultRulesQuestionTarget, questionCountPerExam);
  const selected = [];
  const usedPrompts = new Set();

  collectQuestions(selected, usedPrompts, rulesQuestions, rulesTarget);
  collectQuestions(selected, usedPrompts, otherQuestions, questionCountPerExam - selected.length);
  collectQuestions(selected, usedPrompts, fallbackQuestions, questionCountPerExam - selected.length);

  if (selected.length < questionCountPerExam) {
    throw new Error(`Unable to build a ${questionCountPerExam}-question exam from the current question bank.`);
  }

  return shuffleArray(selected.slice());
}

function collectQuestions(selected, usedPrompts, candidates, neededCount) {
  if (neededCount <= 0) {
    return;
  }

  for (const question of candidates) {
    if (selected.length >= questionCountPerExam || neededCount <= 0 || usedPrompts.has(question.prompt)) {
      continue;
    }

    selected.push(question);
    usedPrompts.add(question.prompt);
    neededCount -= 1;
  }
}

function isRulesQuestion(question) {
  if (question.category === "fcc-rules") {
    return true;
  }

  const promptAndOptions = `${question.prompt} ${Object.values(question.options).join(" ")}`.toLowerCase();
  return rulesKeywords.some((keyword) => promptAndOptions.includes(keyword));
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
          <p class="exam-meta">${questionCountPerExam} random questions with extra FCC rules coverage. Pass with no more than ${maxIncorrectToPass} missed.</p>
        </div>
        <div class="exam-actions">
          <button class="action-button primary" type="button" data-exam-action="score">Score Exam</button>
          <button class="action-button secondary" type="button" data-exam-action="reset">Reset Answers</button>
          <button class="action-button secondary" type="button" data-exam-action="regenerate">New Random Exam</button>
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
    const examId = panel?.dataset.tabPanel;
    const questions = examState[examId];
    if (!panel || !examId || !questions) {
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

    if (examButton.dataset.examAction === "regenerate") {
      const config = examConfigsById[examId];
      if (!config) {
        return;
      }

      examState[examId] = buildExamQuestionSet(questionBank, config);
      renderExam(config, examState[examId]);
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

  const incorrect = questions.length - correct;
  const percent = Math.round((correct / questions.length) * 100);
  const passed = incorrect <= maxIncorrectToPass;
  const scoreOutput = panel.querySelector("[data-score-output]");
  scoreOutput.classList.remove("is-pass", "is-fail");
  scoreOutput.classList.add(passed ? "is-pass" : "is-fail");
  scoreOutput.textContent =
    `${passed ? "PASS" : "FAIL"} | Score ${correct}/${questions.length} | Incorrect ${incorrect}/${questions.length} | Answered ${answered}/${questions.length} | ${percent}%`;
}

function resetExam(panel) {
  panel.querySelectorAll("input:checked").forEach((input) => {
    input.checked = false;
  });

  panel.querySelectorAll("[data-feedback]").forEach((feedback) => {
    feedback.className = "feedback";
    feedback.textContent = "";
  });

  const scoreOutput = panel.querySelector("[data-score-output]");
  scoreOutput.classList.remove("is-pass", "is-fail");
  scoreOutput.textContent = defaultScoreText;
}

function solveOhmsLaw() {
  const values = {
    voltage: readOhmsValue("voltage"),
    current: readOhmsValue("current"),
    resistance: readOhmsValue("resistance"),
    power: readOhmsValue("power")
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
    power
  };
}
