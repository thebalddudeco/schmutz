window.GEDData = window.GEDData || {};

(function addSocialStudiesBank() {
  var questions = [];
  var counter = 1;
  var levels = ["foundation", "foundation", "foundation", "foundation", "standard", "standard", "standard", "standard", "stretch", "stretch"];

  function addQuestion(config) {
    var id = "social-" + String(counter).padStart(3, "0");
    counter += 1;
    questions.push({
      id: id,
      subject: "socialStudies",
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
    ["The Constitution divides government power so no single branch controls everything.", "limited government"],
    ["A written plan establishes the structure and powers of the national government.", "Constitution"],
    ["The first ten amendments protect key liberties such as speech and religion.", "Bill of Rights"],
    ["Government leaders must follow the same laws as everyone else.", "rule of law"],
    ["People choose representatives to make laws on their behalf.", "representative government"],
    ["Citizens can vote leaders out of office in future elections.", "popular sovereignty"],
    ["The federal government has only the powers granted to it in the Constitution.", "enumerated powers"],
    ["A law that conflicts with the Constitution can be struck down.", "constitutional supremacy"],
    ["States keep powers not given to the federal government.", "reserved powers"],
    ["A system can be changed through amendments when enough support exists.", "constitutional amendment process"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Constitution Basics",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " Which concept best matches this statement?",
      choices: [spec[1], "trade deficit", "market equilibrium", "weather pattern"],
      correctAnswer: spec[1],
      explanation: "The statement describes " + spec[1] + ".",
      tags: ["constitution", "civics", "government principles"]
    });
  });

  [
    ["makes laws", "Legislative"],
    ["enforces laws", "Executive"],
    ["interprets laws", "Judicial"],
    ["confirms federal judges in the Senate", "Legislative"],
    ["signs or vetoes bills", "Executive"],
    ["decides whether laws fit the Constitution", "Judicial"],
    ["collects tax laws passed by Congress", "Executive"],
    ["writes and debates bills in Congress", "Legislative"],
    ["hears court cases and appeals", "Judicial"],
    ["carries out daily administration of federal agencies", "Executive"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Three Branches",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Which branch of the U.S. government mainly " + spec[0] + "?",
      choices: [spec[1], spec[1] === "Executive" ? "Legislative" : "Executive", spec[1] === "Judicial" ? "Legislative" : "Judicial", "Local"],
      correctAnswer: spec[1],
      explanation: spec[1] + " is the correct branch because it is responsible for that role.",
      tags: ["branches", "government structure", "civics"]
    });
  });

  [
    ["A president vetoes a bill passed by Congress.", "check on the legislative branch"],
    ["The Senate confirms a president's cabinet nominee.", "check on the executive branch"],
    ["The Supreme Court rules that a law is unconstitutional.", "check on the legislative branch"],
    ["Congress can override a veto with enough votes.", "check on the executive branch"],
    ["The House can impeach federal officials.", "check on the executive or judicial branch"],
    ["The president nominates federal judges.", "check shared with the legislative branch"],
    ["The Senate can reject a treaty.", "check on the executive branch"],
    ["Courts review executive actions for constitutionality.", "check on the executive branch"],
    ["Congress controls funding for many federal programs.", "check on the executive branch"],
    ["Judges serve independently so political leaders cannot easily remove them for decisions.", "check that protects the judicial branch"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Checks and Balances",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " This is best described as a",
      choices: [spec[1], "free-market transaction", "primary source example", "geographic feature"],
      correctAnswer: spec[1],
      explanation: "Checks and balances allow one part of government to limit or review another part's power. Here that action is a " + spec[1] + ".",
      tags: ["checks and balances", "civics"]
    });
  });

  [
    ["issuing driver's licenses", "state government"],
    ["printing money", "federal government"],
    ["declaring war", "federal government"],
    ["running local public schools", "state and local government"],
    ["setting immigration policy", "federal government"],
    ["holding local property tax elections", "state and local government"],
    ["managing interstate treaties", "federal government"],
    ["registering businesses within a state", "state government"],
    ["operating city bus routes", "local government"],
    ["negotiating with foreign nations", "federal government"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Federalism",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Which level of government is primarily responsible for " + spec[0] + "?",
      choices: [spec[1], "the judicial branch only", "private companies only", "international courts only"],
      correctAnswer: spec[1],
      explanation: "Federalism divides authority between national, state, and local governments. In this case, the best answer is " + spec[1] + ".",
      tags: ["federalism", "levels of government"]
    });
  });

  [
    ["freedom of speech", "a protected right"],
    ["serving on a jury when called", "a civic responsibility"],
    ["freedom of religion", "a protected right"],
    ["paying taxes required by law", "a civic responsibility"],
    ["peacefully assembling to protest", "a protected right"],
    ["following laws and court orders", "a civic responsibility"],
    ["petitioning the government", "a protected right"],
    ["staying informed before voting", "a civic responsibility"],
    ["due process before punishment", "a protected right"],
    ["participating in census reporting when required", "a civic responsibility"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Rights and Responsibilities",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Which description best fits " + spec[0] + "?",
      choices: [spec[1], spec[1] === "a protected right" ? "a market force" : "a protected right", "a natural resource", "a foreign policy tool"],
      correctAnswer: spec[1],
      explanation: spec[0] + " is best described as " + spec[1] + ".",
      tags: ["rights", "responsibilities", "citizenship"]
    });
  });

  [
    ["Factories increased production and drew workers into cities.", "industrialization"],
    ["The federal government launched work programs and relief projects during the 1930s.", "the New Deal"],
    ["The Civil Rights Movement challenged segregation and unequal treatment.", "expanding civil rights"],
    ["The United States adopted a stronger federal system after the Articles of Confederation proved weak.", "constitutional reform"],
    ["Westward movement often displaced Indigenous nations.", "territorial expansion with major human costs"],
    ["Labor unions pressed for safer workplaces and better pay.", "worker organizing"],
    ["World War II increased industrial production and military mobilization.", "wartime economic expansion"],
    ["The Great Migration changed population patterns in U.S. cities.", "internal migration and demographic change"],
    ["The women's suffrage movement fought for voting rights.", "expansion of political participation"],
    ["Cold War tensions influenced foreign policy and domestic politics.", "global rivalry shaping U.S. decisions"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "U.S. History Themes",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " Which broader theme does this best represent?",
      choices: [spec[1], "plate tectonics", "cell division", "weather forecasting"],
      correctAnswer: spec[1],
      explanation: "The example most directly fits the theme of " + spec[1] + ".",
      tags: ["u.s. history", "themes", "historical reasoning"]
    });
  });

  [
    ["When demand for an item rises while supply stays the same, the price often", "increases"],
    ["A person who starts a business is acting as an", "entrepreneur"],
    ["Money paid by borrowers for the use of a loan is", "interest"],
    ["When workers gain new skills, their earning potential may", "increase"],
    ["A government payment on imported goods is called a", "tariff"],
    ["Competition between businesses often encourages", "lower prices or better products"],
    ["The amount a worker earns before deductions is", "gross pay"],
    ["A budget helps a household", "plan spending and saving"],
    ["Inflation means the general level of prices is", "rising"],
    ["A tax collected on wages to support public programs is a", "payroll tax"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Economics Basics",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: "Which answer best completes the statement? " + spec[0],
      choices: [spec[1], "disappears", "stays secret", "moves underground"],
      correctAnswer: spec[1],
      explanation: "The correct economic term or outcome is " + spec[1] + ".",
      tags: ["economics", "money", "work and markets"]
    });
  });

  [
    ["A map scale says 1 inch = 5 miles. Two towns are 3 inches apart.", "15 miles"],
    ["North is at the top of a standard map. A location east of the river is on the", "right side of the river"],
    ["A legend marks hospitals with a blue H symbol.", "the hospital locations"],
    ["A route moves 4 blocks south and then 2 blocks east.", "south then east"],
    ["A contour map shows many lines packed closely together.", "the slope is steep"],
    ["A city on the coast is next to the ocean.", "a coastal location"],
    ["A map key marks dashed lines as hiking trails.", "the dashed lines represent trails"],
    ["A region near the equator usually receives", "more direct sunlight"],
    ["A highway map uses symbols for rest areas and exits.", "to help travelers find services and routes"],
    ["A location listed at 46 degrees north latitude is", "north of the equator"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Geography and Map Reading",
      difficulty: levels[index],
      type: "map-reading",
      prompt: spec[0] + " What does this information show?",
      choices: [spec[1], "the stock market only", "a chemical reaction", "a constitutional amendment"],
      correctAnswer: spec[1],
      explanation: spec[1].charAt(0).toUpperCase() + spec[1].slice(1) + ".",
      tags: ["geography", "map reading", "spatial reasoning"]
    });
  });

  [
    ["a diary written by a factory worker in 1912", "primary source"],
    ["a textbook summary of the Civil War", "secondary source"],
    ["a photograph taken during a protest", "primary source"],
    ["an encyclopedia article about the Constitution", "secondary source"],
    ["a speech transcript from a president", "primary source"],
    ["a documentary made decades after an event", "secondary source"],
    ["a letter sent by a soldier from the front", "primary source"],
    ["a scholar's article comparing several diaries", "secondary source"],
    ["an original campaign poster", "primary source"],
    ["a museum panel that summarizes an era", "secondary source"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Primary vs Secondary Sources",
      difficulty: levels[index],
      type: "source-analysis",
      prompt: "Which label best fits " + spec[0] + "?",
      choices: [spec[1], spec[1] === "primary source" ? "secondary source" : "primary source", "economic indicator", "weather report"],
      correctAnswer: spec[1],
      explanation: "A primary source comes directly from the time or participant, while a secondary source interprets or summarizes later. This item is a " + spec[1] + ".",
      tags: ["sources", "history", "evidence"]
    });
  });

  [
    ["Citizens vote in local elections to choose a mayor.", "participation in local democracy"],
    ["A resident attends a school board meeting to speak during public comment.", "civic participation"],
    ["A group collects signatures to place an issue on the ballot.", "petitioning and direct civic action"],
    ["A person writes a representative about housing concerns.", "communicating with elected officials"],
    ["Neighbors organize a cleanup after a storm.", "community responsibility"],
    ["A voter researches candidates before casting a ballot.", "informed participation"],
    ["People volunteer as poll workers on election day.", "supporting the election process"],
    ["Residents review a city budget proposal before a hearing.", "public oversight of government"],
    ["A juror listens to evidence before reaching a decision.", "participation in the justice system"],
    ["Community members join a planning meeting about transit routes.", "public input in local policy"]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Civics and Government",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec[0] + " This is best described as",
      choices: [spec[1], "a trade imbalance", "a weather event", "a biological mutation"],
      correctAnswer: spec[1],
      explanation: "The example shows " + spec[1] + ".",
      tags: ["civics", "participation", "government"]
    });
  });

  window.GEDData.questions = (window.GEDData.questions || []).concat(questions);
})();
