const guideContent = `
<h2>License Overview</h2>
<h3>Technician</h3>
<ul>
  <li>Entry-level amateur license</li>
  <li>Strong starting point for VHF/UHF operating, repeaters, emergency communications, and basic HF privileges</li>
  <li>Core topics: rules, operating practice, electronics basics, antennas, and safety</li>
</ul>
<h3>General</h3>
<ul>
  <li>Expands HF privileges significantly</li>
  <li>Best fit for long-distance communication on popular HF bands</li>
  <li>Core topics: propagation, operating practice, intermediate circuits, digital modes, and station setup</li>
</ul>
<h3>Amateur Extra</h3>
<ul>
  <li>Highest U.S. license class</li>
  <li>Broadest operating privileges</li>
  <li>Core topics: advanced electronics, regulations, and in-depth RF concepts</li>
</ul>
<h2>How To Study Efficiently</h2>
<ol>
  <li>Learn concepts first instead of memorizing letter patterns.</li>
  <li>Study in shorter daily sessions.</li>
  <li>Keep a band plan nearby when reviewing privileges.</li>
  <li>Practice phonetics, logging, and operating language out loud.</li>
  <li>Spend more time on missed questions than on repeat passes through correct ones.</li>
</ol>
<h2>Core Knowledge Areas</h2>
<h3>Rules and Operating Practice</h3>
<ul>
  <li>The FCC regulates amateur radio in the United States.</li>
  <li>Your call sign identifies your station.</li>
  <li>You must operate only within your license privileges.</li>
  <li>The control operator is responsible for proper station operation.</li>
  <li>Stations must avoid harmful interference.</li>
</ul>
<h3>Frequency, Wavelength, and Modes</h3>
<ul>
  <li>Frequency is measured in hertz.</li>
  <li>Higher frequency means shorter wavelength.</li>
  <li>HF is commonly used for long-distance skywave communication.</li>
  <li>VHF and UHF are commonly used for local and regional communication.</li>
  <li>FM is common on repeaters, SSB is common on HF, and CW remains useful in weak-signal conditions.</li>
</ul>
<h3>Repeaters</h3>
<ul>
  <li>A repeater receives on one frequency and retransmits on another.</li>
  <li>Offset is the difference between repeater input and output.</li>
  <li>A CTCSS tone may be required for access.</li>
  <li>Listen first to avoid doubling with another station.</li>
</ul>
<h3>Electrical Basics</h3>
<ul>
  <li>Voltage is electrical pressure.</li>
  <li>Current is the flow of charge.</li>
  <li>Resistance opposes current flow.</li>
  <li>Power is measured in watts.</li>
  <li>Ohm's Law: V = I x R, I = V / R, R = V / I.</li>
  <li>Power equations: P = V x I, P = I^2 x R, P = V^2 / R.</li>
</ul>
<h3>Components and Circuits</h3>
<ul>
  <li>Resistors limit current.</li>
  <li>Capacitors store energy in an electric field.</li>
  <li>Inductors store energy in a magnetic field.</li>
  <li>Fuses protect against overcurrent.</li>
  <li>Transformers transfer energy between windings.</li>
  <li>Diodes mainly allow current in one direction.</li>
</ul>
<h3>Antennas and Feed Lines</h3>
<ul>
  <li>Antennas convert RF energy to radio waves and back again.</li>
  <li>Coaxial cable is a common amateur feed line.</li>
  <li>Feed line loss generally increases with frequency and length.</li>
  <li>SWR indicates how well the antenna system matches the transmission line.</li>
  <li>Low SWR helps, but it does not guarantee an effective antenna.</li>
</ul>
<h3>Propagation and Safety</h3>
<ul>
  <li>VHF/UHF is often line-of-sight.</li>
  <li>HF can support long-distance contacts through ionospheric propagation.</li>
  <li>Solar conditions and time of day affect band behavior.</li>
  <li>Keep antennas and masts clear of power lines.</li>
  <li>Use proper grounding and never bypass protective devices.</li>
</ul>
<h2>Test-Day Strategy</h2>
<ol>
  <li>Answer easy questions first.</li>
  <li>Flag calculations and return to them.</li>
  <li>Read words like best, most, and primary carefully.</li>
  <li>If two answers seem close, choose the safer or more compliant one.</li>
</ol>
`;

const exams = [
  {
    id: "exam-1",
    title: "Exam 1",
    description: "Technician fundamentals and core station practice.",
    questions: [
      q("What is the main purpose of a repeater?", "B", { A: "Encrypt traffic", B: "Extend communication range", C: "Reduce current draw", D: "Replace the antenna" }),
      q("What does your amateur call sign do?", "B", { A: "Tunes the antenna", B: "Identifies your station", C: "Measures output power", D: "Selects the band" }),
      q("What does V = I x R describe?", "C", { A: "Polarization", B: "Velocity factor", C: "Ohm's Law", D: "SWR" }),
      q("Which mode is common on local VHF/UHF repeaters?", "A", { A: "FM", B: "SSB", C: "CW only", D: "AM only" }),
      q("If frequency increases, wavelength does what?", "B", { A: "Increases", B: "Decreases", C: "Stays constant", D: "Becomes DC" }),
      q("What does SWR primarily indicate?", "C", { A: "Battery capacity", B: "Audio deviation", C: "Antenna-system match quality", D: "Cable age" }),
      q("Which practice is best before transmitting?", "B", { A: "Increase power", B: "Listen first", C: "Disable mic gain", D: "Shift bands" }),
      q("A capacitor stores energy in what?", "C", { A: "Magnetic field", B: "Rotating field", C: "Electric field", D: "Sound wave" }),
      q("Which item most directly protects against overcurrent?", "A", { A: "Fuse", B: "Microphone", C: "Wattmeter", D: "Dummy load" }),
      q("Which band type is associated with long-distance skywave communication?", "A", { A: "HF", B: "Audio", C: "Microwave oven only", D: "DC" }),
      q("What is the control operator responsible for?", "B", { A: "Station appearance only", B: "Proper station operation", C: "Internet speed", D: "Weather forecasting" }),
      q("What is the safest action when installing an outdoor antenna?", "C", { A: "Place it close to power lines", B: "Work alone in a storm", C: "Keep clear of power lines", D: "Use damaged feed line" }),
      q("Power is measured in what unit?", "C", { A: "Amperes", B: "Ohms", C: "Watts", D: "Farads" }),
      q("A diode primarily does what?", "B", { A: "Amplifies all signals", B: "Allows current mainly one way", C: "Stores RF in the mast", D: "Converts coax to ladder line" }),
      q("Why might a repeater require a CTCSS tone?", "B", { A: "Reduce lightning risk", B: "Access the repeater", C: "Calculate wavelength", D: "Improve Morse speed" }),
      q("Which statement about low SWR is best?", "C", { A: "Guarantees worldwide contacts", B: "Means ideal antenna height", C: "Usually indicates a better impedance match", D: "Eliminates feed line loss" }),
      q("What is a major use of phonetics on the air?", "B", { A: "Increase transmitter power", B: "Make call signs easier to copy", C: "Hide station identity", D: "Change modulation type" }),
      q("Which quantity opposes current flow?", "B", { A: "Frequency", B: "Resistance", C: "Velocity factor", D: "Modulation index" }),
      q("What should you do if you cause interference?", "C", { A: "Ignore it", B: "Continue until two complaints", C: "Investigate and correct it", D: "Move randomly without listening" }),
      q("What is one likely risk of replacing a fuse with too high a rating?", "C", { A: "Better audio", B: "Improved antenna match", C: "Equipment damage or fire", D: "Lower RF exposure" })
    ]
  },
  {
    id: "exam-2",
    title: "Exam 2",
    description: "General-level operating, propagation, and station setup.",
    questions: [
      q("Why upgrade from Technician to General?", "B", { A: "No antenna needed", B: "Broader HF privileges", C: "Avoid ID", D: "Use commercial frequencies" }),
      q("What often changes HF propagation from day to night?", "B", { A: "Display color", B: "Ionospheric conditions", C: "Microphone brand", D: "Label size" }),
      q("Which voice mode is commonly used on HF for bandwidth efficiency?", "A", { A: "SSB", B: "Wideband FM", C: "Analog TV", D: "Tone burst" }),
      q("One advantage of CW is what?", "B", { A: "No skill required", B: "Works under weak-signal conditions", C: "Always carries images", D: "Uses more bandwidth" }),
      q("What usually happens to coax loss as frequency increases?", "B", { A: "Goes to zero", B: "Generally increases", C: "Becomes negative", D: "Depends on mic gain" }),
      q("Why is a band plan useful?", "B", { A: "Replaces FCC rules", B: "Helps use accepted subbands", C: "Sets utility rates", D: "Tunes the antenna" }),
      q("What is a dummy load used for?", "B", { A: "Stronger signal", B: "Test without significant radiation", C: "Improve mic tone", D: "Replace a fuse" }),
      q("Digital modes can be used for what?", "B", { A: "Government only", B: "Text, data, and weak-signal work", C: "Satellite only", D: "Not HF" }),
      q("If a 12-volt circuit draws 2 amperes, what power is used?", "C", { A: "6 watts", B: "12 watts", C: "24 watts", D: "48 watts" }),
      q("What is the best response if unsure a transmission is within your privileges?", "C", { A: "Transmit first", B: "Use maximum power", C: "Verify privileges first", D: "Let a friend transmit" }),
      q("Which item best helps protect equipment from nearby lightning energy?", "A", { A: "Proper grounding and lightning protection", B: "Louder audio", C: "Desk lamp", D: "Lower Morse speed" }),
      q("What does a transformer commonly do?", "C", { A: "Stores charge chemically", B: "Converts RF into sound", C: "Transfers energy between windings", D: "Measures SWR" }),
      q("Why is listening before calling CQ important?", "B", { A: "Reduces antenna size", B: "Avoids interfering with ongoing contacts", C: "Increases battery voltage", D: "Changes the band edge" }),
      q("Which condition most affects VHF/UHF line-of-sight coverage?", "A", { A: "Antenna height", B: "Keyboard layout", C: "Call sign suffix", D: "Power supply paint color" }),
      q("What is one common purpose of a tuner or matching network?", "B", { A: "Create AC power from sunlight", B: "Help match the transmitter system to the load", C: "Replace station identification", D: "Increase license class" }),
      q("Which operating habit is most professional during a busy net?", "B", { A: "Long unbroken transmissions", B: "Clear, concise transmissions with pauses", C: "Refuse to identify", D: "Tune up on the active frequency" }),
      q("What does polarization describe?", "A", { A: "Orientation of the electric field", B: "Battery chemistry only", C: "Age of the antenna", D: "Number of repeaters" }),
      q("What can result from poor grounding or unsafe wiring?", "B", { A: "Reduced need for ID", B: "Shock hazard and equipment damage", C: "Automatic Extra privileges", D: "Lower ionospheric absorption" }),
      q("What is most likely to improve weak-signal fixed-station performance?", "A", { A: "Better antenna placement", B: "Cover the radio with cloth", C: "Longest microphone cable possible", D: "Lower the antenna behind a shed" }),
      q("Why may lower HF bands be preferred at night?", "B", { A: "Night makes all antennas resonant", B: "Propagation can favor lower frequencies", C: "FM becomes mandatory", D: "Repeaters stop requiring offsets" })
    ]
  },
  {
    id: "exam-3",
    title: "Exam 3",
    description: "Mixed review across operating practice, electronics, antennas, and safety.",
    questions: [
      q("What is the basic role of an antenna?", "A", { A: "Convert RF energy to radio waves and back", B: "Lower house voltage", C: "Replace feed line", D: "Store logs" }),
      q("What unit measures resistance?", "C", { A: "Watt", B: "Volt", C: "Ohm", D: "Second" }),
      q("What does an inductor store energy in?", "B", { A: "Electric field", B: "Magnetic field", C: "Display", D: "Fuse element" }),
      q("What is the major hazard when raising an antenna mast?", "B", { A: "Call sign prefixes", B: "Overhead power lines", C: "Notebook paper", D: "Phonetics" }),
      q("HF often supports long-distance contacts by what means?", "B", { A: "DC conduction", B: "Ionospheric propagation", C: "Fuse action", D: "Battery chemistry" }),
      q("A 10-ohm load with 2 amperes has what voltage?", "C", { A: "5 volts", B: "10 volts", C: "20 volts", D: "40 volts" }),
      q("What does a higher antenna often improve on VHF/UHF?", "A", { A: "Line-of-sight coverage", B: "Fuse speed", C: "Battery chemistry", D: "ID interval" }),
      q("Why avoid tuning up on an occupied frequency?", "B", { A: "It wastes electricity only", B: "It can interfere with ongoing communications", C: "It is required for nets", D: "It improves propagation too much" }),
      q("Which statement best describes FM on amateur repeaters?", "A", { A: "Common for local voice communication", B: "Banned on VHF", C: "Used only for Morse code", D: "Never requires offset" }),
      q("Which practice helps reduce accidental repeater interference?", "B", { A: "Transmit immediately after keying up", B: "Pause briefly after pressing PTT", C: "Ignore courtesy tones", D: "Use the wrong offset" }),
      q("If current increases in a fixed resistance, voltage does what?", "A", { A: "Also increases by Ohm's Law", B: "Becomes zero", C: "Always becomes AC", D: "No longer matters" }),
      q("Why might signal reports be weak even with low SWR?", "A", { A: "Antenna placement or efficiency may still be poor", B: "Low SWR guarantees strong signals", C: "Mic has too many buttons", D: "Call sign is too short" }),
      q("What is the most responsible action if equipment smells hot?", "B", { A: "Keep transmitting", B: "Disconnect power and investigate safely", C: "Increase power", D: "Bypass protection" }),
      q("What is the main purpose of station identification rules?", "B", { A: "Obscure the source of signals", B: "Identify transmitting stations", C: "Replace logging in every case", D: "Determine solar flux" }),
      q("Which statement about digital communication is true?", "A", { A: "It can include data and weak-signal modes", B: "It is not radio", C: "It always uses voice microphones", D: "It cannot coexist with band planning" }),
      q("What is one likely result of replacing a fuse with a higher-rated one?", "C", { A: "Better audio quality", B: "Improved antenna match", C: "Higher risk of damage or fire", D: "Lower RF exposure" }),
      q("What does your call sign identify?", "B", { A: "Only your antenna", B: "Your station", C: "Only your power supply", D: "Your feed line" }),
      q("Which mode is narrow bandwidth and useful for weak signals?", "C", { A: "Wideband FM", B: "Analog TV", C: "CW", D: "Broadcast AM only" }),
      q("What feed line is common for amateur stations?", "A", { A: "Coaxial cable", B: "Lamp cord only", C: "Speaker wire only", D: "Ribbon cable for all uses" }),
      q("Which safety rule is most important around outdoor antennas?", "C", { A: "Use the longest mast possible", B: "Work during storms", C: "Stay clear of power lines", D: "Ignore grounding" })
    ]
  }
];

const guideTarget = document.querySelector("[data-guide-content]");
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
let lastTouchHandledAt = 0;

guideTarget.innerHTML = guideContent;
exams.forEach(renderExam);

bindTapSupport();

function bindTapSupport() {
  document.addEventListener("pointerup", handleAction, { passive: false });
  document.addEventListener("click", handleAction, { passive: false });
}

function handleAction(event) {
  if (event.type === "click" && Date.now() - lastTouchHandledAt < 700) {
    return;
  }

  const button = event.target.closest("button[data-tab-target], button[data-score-button], button[data-reset-button]");
  if (!button) {
    return;
  }

  if (event.type === "pointerup") {
    lastTouchHandledAt = Date.now();
  }

  event.preventDefault();

  if (button.hasAttribute("data-tab-target")) {
    activateTab(button.dataset.tabTarget, button);
    return;
  }

  const panel = button.closest("[data-tab-panel]");
  const exam = exams.find((item) => item.id === panel.dataset.tabPanel);
  if (!panel || !exam) {
    return;
  }

  if (button.hasAttribute("data-score-button")) {
    scoreExam(panel, exam);
    return;
  }

  if (button.hasAttribute("data-reset-button")) {
    resetExam(panel);
  }
}

function activateTab(target, activeButton) {
  tabButtons.forEach((item) => item.classList.toggle("is-active", item === activeButton));
  tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.tabPanel === target));
}

function renderExam(exam) {
  const panel = document.querySelector(`[data-tab-panel="${exam.id}"]`);
  panel.innerHTML = `
    <div class="exam-shell">
      <div class="exam-intro">
        <div>
          <h2>${exam.title}</h2>
          <p>${exam.description}</p>
        </div>
        <div class="exam-actions">
          <button class="action-button primary" type="button" data-score-button="true">Score Exam</button>
          <button class="action-button secondary" type="button" data-reset-button="true">Reset</button>
          <output class="score-output" data-score-output>20 questions</output>
        </div>
      </div>
      <div class="question-list" data-question-list></div>
    </div>
  `;

  const list = panel.querySelector("[data-question-list]");
  exam.questions.forEach((question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question-card";
    fieldset.innerHTML = `
      <h3>${index + 1}. ${question.prompt}</h3>
      <div class="option-list">
        ${Object.entries(question.options)
          .map(
            ([key, value]) => `
              <label class="option-item">
                <input type="radio" name="${exam.id}-q-${index}" value="${key}" />
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

function scoreExam(panel, exam) {
  const questionCards = Array.from(panel.querySelectorAll(".question-card"));
  let answered = 0;
  let correct = 0;

  questionCards.forEach((card, index) => {
    const feedback = card.querySelector("[data-feedback]");
    const selected = card.querySelector("input:checked");
    const question = exam.questions[index];
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

  const percent = Math.round((correct / exam.questions.length) * 100);
  panel.querySelector("[data-score-output]").textContent = `Answered ${answered}/${exam.questions.length} | Score ${correct}/${exam.questions.length} | ${percent}%`;
}

function resetExam(panel) {
  panel.querySelectorAll("input:checked").forEach((input) => {
    input.checked = false;
  });

  panel.querySelectorAll("[data-feedback]").forEach((feedback) => {
    feedback.className = "feedback";
    feedback.textContent = "";
  });

  const total = panel.querySelectorAll(".question-card").length;
  panel.querySelector("[data-score-output]").textContent = `${total} questions`;
}

function q(prompt, answer, options) {
  return { prompt, answer, options };
}
