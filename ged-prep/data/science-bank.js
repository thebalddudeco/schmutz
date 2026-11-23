window.GEDData = window.GEDData || {};

(function addScienceBank() {
  var questions = [];
  var counter = 1;
  var levels = ["foundation", "foundation", "foundation", "foundation", "standard", "standard", "standard", "standard", "stretch", "stretch"];

  function addQuestion(config) {
    var id = "science-" + String(counter).padStart(3, "0");
    counter += 1;
    questions.push({
      id: id,
      subject: "science",
      skill: config.skill,
      difficulty: config.difficulty,
      type: config.type,
      prompt: config.prompt,
      choices: config.choices,
      correctAnswer: config.correctAnswer,
      explanation: config.explanation,
      tags: config.tags,
      calculatorAllowed: false
    });
  }

  [
    ["bean plants", "amount of light", "plant height"],
    ["insulation foam", "thickness of foam", "heat loss"],
    ["cleaning solution", "water temperature", "stain removal"],
    ["exercise bike", "resistance level", "calories burned"],
    ["bread dough", "proofing time", "final dough volume"],
    ["solar panel", "panel angle", "electricity produced"],
    ["seed trays", "amount of fertilizer", "leaf count"],
    ["road salt", "surface temperature", "melting time"],
    ["water filters", "filter material", "clarity of water"],
    ["battery packs", "charging time", "stored energy"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Experiments",
      difficulty: levels[index],
      type: "experiment-analysis",
      prompt: "In an experiment on " + spec[0] + ", the scientist changes the " + spec[1] + " and measures " + spec[2] + ". What is the independent variable?",
      choices: [spec[1], spec[2], "the data table", "the final conclusion"],
      correctAnswer: spec[1],
      explanation: "The independent variable is the factor the scientist changes on purpose, which here is the " + spec[1] + ".",
      tags: ["experiments", "independent variable", "scientific method"]
    });
  });

  [
    ["bean plants", "same soil, pot size, and water", "same soil, pot size, and water"],
    ["helmet materials", "same drop height and same test weight", "same drop height and same test weight"],
    ["detergent brands", "same wash temperature and fabric type", "same wash temperature and fabric type"],
    ["engine oil", "same vehicle route and same starting fuel level", "same vehicle route and same starting fuel level"],
    ["phone batteries", "same brightness setting and same app use", "same brightness setting and same app use"],
    ["garden mulch", "same bed size and same seed variety", "same bed size and same seed variety"],
    ["water bottles", "same starting volume and same freezer time", "same starting volume and same freezer time"],
    ["paint drying", "same wall surface and same room airflow", "same wall surface and same room airflow"],
    ["athletic shoes", "same runner and same track distance", "same runner and same track distance"],
    ["coffee filters", "same amount of grounds and same water volume", "same amount of grounds and same water volume"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Variables and Controls",
      difficulty: levels[index],
      type: "experiment-analysis",
      prompt: "A team compares different " + spec[0] + ". Which choice best describes a controlled condition in the test?",
      choices: [spec[1], "changing two factors at once", "switching methods every trial", "using different measurements each day"],
      correctAnswer: spec[2],
      explanation: "Controlled conditions are the factors kept the same so the test isolates the effect of the variable being studied.",
      tags: ["controls", "fair test", "scientific method"]
    });
  });

  [
    ["medication trial", "repeating the study with many participants"],
    ["bridge material test", "running multiple stress tests on several samples"],
    ["water quality survey", "taking measurements from the river on multiple days"],
    ["seed germination study", "using several trays for each condition"],
    ["sleep study", "collecting data over many nights"],
    ["air filter comparison", "testing several copies of each filter"],
    ["road safety study", "tracking crash data across several months"],
    ["exercise recovery study", "measuring heart rate after several sessions"],
    ["food storage test", "checking results in multiple containers"],
    ["battery drain experiment", "repeating the run under the same settings"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Repeated Trials",
      difficulty: levels[index],
      type: "experiment-analysis",
      prompt: "Why would scientists use repeated trials in a " + spec[0] + "?",
      choices: ["To make the data more reliable", "To guarantee the hypothesis is correct", "To remove the need for a control", "To avoid recording measurements"],
      correctAnswer: "To make the data more reliable",
      explanation: "Repeated trials reduce the chance that one unusual result will mislead the study and help reveal consistent patterns.",
      tags: ["repeated trials", "reliability", "scientific method"]
    });
  });

  [
    ["cell membrane", "controls what enters and leaves the cell"],
    ["nucleus", "stores genetic information"],
    ["chloroplast", "captures energy from sunlight in plants"],
    ["mitochondrion", "releases usable energy from food"],
    ["ribosome", "helps build proteins"],
    ["root system", "absorbs water and minerals"],
    ["lungs", "exchange oxygen and carbon dioxide"],
    ["red blood cells", "carry oxygen through the body"],
    ["immune system", "helps defend the body against disease"],
    ["digestive system", "breaks food into usable nutrients"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Life Science",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Which statement correctly describes the function of the " + spec[0] + "?",
      choices: [spec[1], "stores sound waves", "creates gravity", "prevents all change"],
      correctAnswer: spec[1],
      explanation: "The " + spec[0] + " " + spec[1] + ".",
      tags: ["life science", "organisms", "body systems"]
    });
  });

  [
    ["A deer population falls after wolves return to an area.", "predation"],
    ["Moss grows better on the moist side of a rock.", "water availability"],
    ["A lake turns cloudy after fertilizer runoff enters it.", "extra nutrients reaching the water"],
    ["Fewer bees visit flowers after pesticide use increases.", "reduced pollinator activity"],
    ["A food web changes after an invasive species arrives.", "a new competitor affecting the ecosystem"],
    ["Fish die off when dissolved oxygen levels drop.", "insufficient oxygen in the water"],
    ["Tree growth slows during a long drought.", "lack of water limits photosynthesis and transport"],
    ["More algae appear when sunlight and nutrients increase.", "conditions favor rapid producer growth"],
    ["Bird nesting sites shrink after logging.", "habitat loss"],
    ["A species declines when its food source disappears.", "resource limitation"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Life Science",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " Which factor most directly explains the change?",
      choices: [spec[1], "the Moon's phase", "magnetic fields only", "calendar dates"],
      correctAnswer: spec[1],
      explanation: "The change described is best explained by " + spec[1] + ", which directly affects survival or ecosystem balance.",
      tags: ["ecosystems", "life science", "cause and effect"]
    });
  });

  [
    ["solid ice melting to liquid water", "a physical change"],
    ["iron forming rust", "a chemical change"],
    ["salt dissolving in water", "a physical change"],
    ["wood burning in a fire", "a chemical change"],
    ["steam cooling into liquid droplets", "a physical change"],
    ["milk souring", "a chemical change"],
    ["glass breaking", "a physical change"],
    ["baking bread", "a chemical change"],
    ["sugar melting", "a physical change"],
    ["silver tarnishing", "a chemical change"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Physical Science",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Which description is correct for " + spec[0] + "?",
      choices: [spec[1], "both a physical and a biological change only", "a change with no energy transfer", "a process unrelated to matter"],
      correctAnswer: spec[1],
      explanation: "A physical change affects form or state, while a chemical change creates new substances. " + spec[0] + " is best classified as " + spec[1] + ".",
      tags: ["physical science", "matter", "changes in matter"]
    });
  });

  [
    ["A loaded cart is harder to push than an empty cart.", "more mass requires more force to change motion"],
    ["A ball rolls farther on smooth floor than on carpet.", "less friction slows it down less"],
    ["A helmet reduces head injury in a crash.", "it increases the time over which the head slows down"],
    ["A heavier hammer drives a nail more effectively.", "greater momentum can transfer more force"],
    ["A seat belt helps during sudden stops.", "it prevents the body from continuing forward unchecked"],
    ["A bicycle speeds up when the rider pedals harder.", "more force can increase acceleration"],
    ["A flashlight dims as batteries weaken.", "less stored chemical energy remains available"],
    ["Solar panels produce electricity in sunlight.", "light energy can be converted into electrical energy"],
    ["A stretched rubber band snaps back when released.", "stored elastic potential energy becomes motion"],
    ["A moving skateboard slows without pushing.", "friction and air resistance remove kinetic energy"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Physical Science",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " What is the best explanation?",
      choices: [spec[1], "gravity stops working completely", "mass disappears during motion", "energy has no role in motion"],
      correctAnswer: spec[1],
      explanation: spec[1].charAt(0).toUpperCase() + spec[1].slice(1) + ".",
      tags: ["force", "motion", "energy"]
    });
  });

  [
    ["Layers of sediment build up over time and harden.", "sedimentary rock"],
    ["Magma cools and solidifies underground.", "igneous rock"],
    ["Heat and pressure change existing rock.", "metamorphic rock"],
    ["Clouds form when water vapor cools and condenses.", "condensation"],
    ["Rainwater soaks into the ground and later enters streams.", "the water cycle"],
    ["Ocean tides rise and fall each day.", "gravitational pull from the Moon and Sun"],
    ["Seasons change because Earth's axis is tilted.", "Earth's axis is tilted"],
    ["A lunar eclipse occurs when Earth blocks sunlight from the Moon.", "Earth moves between the Sun and Moon"],
    ["Volcanoes often form near tectonic plate boundaries.", "plate movement allows magma to rise"],
    ["Earthquakes release stored stress along faults.", "tectonic stress is suddenly released"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Earth and Space Science",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " Which term or explanation best fits?",
      choices: [spec[1], "sound energy only", "the food web", "cell division"],
      correctAnswer: spec[1],
      explanation: "The description matches " + spec[1] + ".",
      tags: ["earth science", "space science", "natural processes"]
    });
  });

  [
    ["Trial 1: 12 cm, Trial 2: 13 cm, Trial 3: 12 cm", "about 12.3 cm"],
    ["Trial 1: 8 g, Trial 2: 9 g, Trial 3: 11 g", "about 9.3 g"],
    ["Trial 1: 20 sec, Trial 2: 19 sec, Trial 3: 21 sec", "about 20 sec"],
    ["Trial 1: 44 mL, Trial 2: 46 mL, Trial 3: 45 mL", "45 mL"],
    ["Trial 1: 5.0 pH, Trial 2: 5.2 pH, Trial 3: 5.1 pH", "about 5.1 pH"],
    ["Trial 1: 110 N, Trial 2: 112 N, Trial 3: 111 N", "111 N"],
    ["Trial 1: 67%, Trial 2: 69%, Trial 3: 68%", "68%"],
    ["Trial 1: 15 leaves, Trial 2: 14 leaves, Trial 3: 16 leaves", "15 leaves"],
    ["Trial 1: 31 C, Trial 2: 30 C, Trial 3: 32 C", "31 C"],
    ["Trial 1: 240 lux, Trial 2: 245 lux, Trial 3: 250 lux", "245 lux"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Graph and Data Interpretation",
      difficulty: levels[index],
      type: "data-interpretation",
      prompt: "A scientist records " + spec[0] + ". What is the best estimate of the average result?",
      choices: [spec[1], "the smallest trial only", "the largest trial only", "there is no pattern at all"],
      correctAnswer: spec[1],
      explanation: "The best estimate of the average uses all trials together rather than focusing on just one value.",
      tags: ["data interpretation", "average", "trials"]
    });
  });

  [
    ["Plants in full light grew taller than plants in dim light.", "light likely affected plant growth"],
    ["Water filtered through charcoal came out clearer than water filtered through gravel.", "charcoal was more effective in that test"],
    ["A medicine lowered fever in many patients compared with the placebo group.", "the medicine likely helped reduce fever"],
    ["A metal rod expanded when heated and contracted when cooled.", "temperature changed the rod's size"],
    ["Seedlings watered daily had more leaves than seedlings watered weekly.", "watering frequency affected leaf growth"],
    ["Road salt melted ice faster than sand in equal conditions.", "salt was more effective at melting ice in the trial"],
    ["A solar charger produced more current at noon than at sunset.", "light intensity affected the output"],
    ["Fish avoided water with lower oxygen levels.", "oxygen level influenced fish behavior"],
    ["A helmet absorbed more impact force than a thin cap.", "helmet design can reduce impact transmitted to the head"],
    ["A vaccine group had fewer cases of illness than the unvaccinated group.", "vaccination was associated with lower illness in the study"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Evidence and Conclusions",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Given this result, what conclusion is best supported? " + spec[0],
      choices: [spec[1], "No factor in the study mattered", "The opposite effect definitely happened everywhere", "Scientists should stop collecting data"],
      correctAnswer: spec[1],
      explanation: "A strong conclusion stays close to the evidence and avoids claims that go beyond the results.",
      tags: ["evidence", "conclusions", "scientific reasoning"]
    });
  });

  window.GEDData.questions = (window.GEDData.questions || []).concat(questions);
})();
