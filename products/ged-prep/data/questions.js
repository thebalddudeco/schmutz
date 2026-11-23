window.GEDData = window.GEDData || {};

(function buildInitialQuestionCatalog() {
  var difficultyLabels = {
    foundation: "Foundation",
    standard: "GED Standard",
    stretch: "College Readiness Stretch"
  };

  var subjectMeta = {
    math: {
      id: "math",
      label: "Math",
      summary:
        "Move from number sense into algebra, geometry, measurement, and data reading with adult-relevant practice contexts.",
      domains: [
        {
          title: "Number Sense",
          focus: "Build comfort with the operations and habits that support all later math work.",
          skills: ["Whole Numbers", "Integers", "Fractions", "Decimals", "Percents"]
        },
        {
          title: "Proportional Reasoning",
          focus: "Translate between rates, ratios, and real-world comparisons.",
          skills: ["Ratios and Proportions"]
        },
        {
          title: "Algebraic Thinking",
          focus: "Set up equations, solve for unknowns, and follow multi-step structure accurately.",
          skills: ["Algebra Basics", "Equations and Inequalities"]
        },
        {
          title: "Measurement and Geometry",
          focus: "Use formulas and visual reasoning for area, volume, and coordinate ideas.",
          skills: ["Perimeter and Area", "Volume and Measurement", "Coordinate Plane Basics"]
        },
        {
          title: "Data Literacy",
          focus: "Read tables and graphs without rushing past scale, trend, or comparison details.",
          skills: ["Graph and Table Interpretation"]
        }
      ],
      skills: [
        "Whole Numbers",
        "Integers",
        "Fractions",
        "Decimals",
        "Percents",
        "Ratios and Proportions",
        "Algebra Basics",
        "Equations and Inequalities",
        "Perimeter and Area",
        "Volume and Measurement",
        "Coordinate Plane Basics",
        "Graph and Table Interpretation"
      ]
    },
    rla: {
      id: "rla",
      label: "Reasoning Through Language Arts",
      summary:
        "Practice the core GED reading and editing moves: comprehend, infer, compare arguments, and improve sentence-level writing choices.",
      domains: [
        {
          title: "Reading for Meaning",
          focus: "Name the main idea, track support, and draw careful inferences from adult-focused passages.",
          skills: ["Main Idea", "Supporting Details", "Inference", "Vocabulary in Context"]
        },
        {
          title: "Author and Argument",
          focus: "Notice purpose, tone, claim strength, and how evidence is being used.",
          skills: ["Author's Purpose", "Tone", "Claims and Evidence", "Argument Comparison"]
        },
        {
          title: "Language Control",
          focus: "Revise for clarity, sentence control, punctuation, and professional wording.",
          skills: ["Grammar", "Punctuation", "Sentence Structure", "Revision and Editing"]
        }
      ],
      skills: [
        "Main Idea",
        "Supporting Details",
        "Inference",
        "Vocabulary in Context",
        "Author's Purpose",
        "Tone",
        "Claims and Evidence",
        "Argument Comparison",
        "Grammar",
        "Punctuation",
        "Sentence Structure",
        "Revision and Editing"
      ]
    },
    science: {
      id: "science",
      label: "Science",
      summary:
        "Reason through experiments, life and physical science ideas, earth systems, and data-driven conclusions.",
      domains: [
        {
          title: "Scientific Method",
          focus: "Identify variables, controls, repeated trials, and fair test design.",
          skills: ["Experiments", "Variables and Controls", "Repeated Trials"]
        },
        {
          title: "Core Science Ideas",
          focus: "Interpret life, physical, and earth-space concepts in plain language.",
          skills: ["Life Science", "Physical Science", "Earth and Space Science"]
        },
        {
          title: "Evidence Analysis",
          focus: "Read charts and determine what the data does and does not support.",
          skills: ["Data Interpretation", "Graph and Data Interpretation", "Evidence and Conclusions"]
        }
      ],
      skills: [
        "Experiments",
        "Variables and Controls",
        "Repeated Trials",
        "Life Science",
        "Physical Science",
        "Earth and Space Science",
        "Data Interpretation",
        "Graph and Data Interpretation",
        "Evidence and Conclusions"
      ]
    },
    socialStudies: {
      id: "socialStudies",
      label: "Social Studies",
      summary:
        "Study civics, economics, history, geography, and source analysis through government and real-life decision making.",
      domains: [
        {
          title: "Government Foundations",
          focus: "Understand the Constitution, branches, checks, and power shared across systems.",
          skills: ["Constitution Basics", "Three Branches", "Checks and Balances", "Federalism"]
        },
        {
          title: "Citizenship and History",
          focus: "Connect rights, responsibilities, and major U.S. historical themes to public life.",
          skills: ["Rights and Responsibilities", "U.S. History Themes", "Civics and Government"]
        },
        {
          title: "Economics and Geography",
          focus: "Read maps, follow economic cause and effect, and evaluate source reliability.",
          skills: ["Economics Basics", "Geography and Map Reading", "Primary vs Secondary Sources"]
        }
      ],
      skills: [
        "Constitution Basics",
        "Three Branches",
        "Checks and Balances",
        "Federalism",
        "Rights and Responsibilities",
        "U.S. History Themes",
        "Civics and Government",
        "Economics Basics",
        "Geography and Map Reading",
        "Primary vs Secondary Sources"
      ]
    }
  };

  var seedQuestions = [
    {
      id: "math-seed-001",
      subject: "math",
      skill: "Fractions",
      difficulty: "foundation",
      type: "multiple-choice",
      prompt: "A recipe uses 3/4 cup of oats for one batch. How many cups of oats are needed for 2 batches?",
      choices: ["1 cup", "1 1/2 cups", "2 cups", "2 1/4 cups"],
      correctAnswer: "1 1/2 cups",
      explanation:
        "Multiply 3/4 by 2. Two groups of three fourths make six fourths, and six fourths simplifies to 1 1/2.",
      tags: ["fractions", "measurement", "word problem"],
      calculatorAllowed: false
    },
    {
      id: "math-seed-002",
      subject: "math",
      skill: "Ratios and Proportions",
      difficulty: "standard",
      type: "multiple-choice",
      prompt: "A painter mixes 2 gallons of base paint with 3 gallons of tint. If the same ratio is used for 10 gallons of base paint, how many gallons of tint are needed?",
      choices: ["12", "15", "18", "20"],
      correctAnswer: "15",
      explanation:
        "The tint-to-base ratio is 3 to 2. Multiply both parts by 5, because 2 times 5 is 10. Then 3 times 5 is 15.",
      tags: ["ratios", "proportion", "workplace math"],
      calculatorAllowed: true
    },
    {
      id: "rla-seed-001",
      subject: "rla",
      skill: "Main Idea",
      difficulty: "foundation",
      type: "passage-mc",
      passageId: "rla-recycling-brief",
      prompt: "What is the main point of the apartment memo?",
      choices: [
        "The building plans to remove the recycling room.",
        "Residents should flatten boxes so the room stays usable.",
        "Management wants to hire more maintenance workers.",
        "Residents are not allowed to recycle in the evening."
      ],
      correctAnswer: "Residents should flatten boxes so the room stays usable.",
      explanation:
        "The memo explains that the room closes because unflattened boxes block the walkway. The central message is that better preparation by residents would solve the problem.",
      tags: ["main idea", "informational text"],
      calculatorAllowed: false
    },
    {
      id: "rla-seed-002",
      subject: "rla",
      skill: "Inference",
      difficulty: "standard",
      type: "passage-mc",
      passageId: "rla-transit-editorial",
      prompt: "Which statement is most strongly supported by the editorial?",
      choices: [
        "Most bus riders work day shifts.",
        "Late-night transit affects job stability for some workers.",
        "The city plans to expand every bus route.",
        "Workers prefer buses to all other travel options."
      ],
      correctAnswer: "Late-night transit affects job stability for some workers.",
      explanation:
        "The writer argues that when buses stop early, some workers struggle to get home safely or affordably. That suggests transit access can affect whether work remains practical and reliable.",
      tags: ["inference", "argument", "workforce"],
      calculatorAllowed: false
    },
    {
      id: "science-seed-001",
      subject: "science",
      skill: "Variables and Controls",
      difficulty: "foundation",
      type: "multiple-choice",
      passageId: "science-seed-trial",
      prompt: "In the seed growth trial, what is the independent variable?",
      choices: ["Type of seed", "Amount of water", "Light source", "Height of plants"],
      correctAnswer: "Light source",
      explanation:
        "The independent variable is the factor the students changed on purpose. Each tray had a different light source while other conditions stayed the same.",
      tags: ["experiment", "variables", "scientific method"],
      calculatorAllowed: false
    },
    {
      id: "science-seed-002",
      subject: "science",
      skill: "Data Interpretation",
      difficulty: "standard",
      type: "multiple-choice",
      prompt: "A metal rod expands when heated and returns close to its original length when cooled. Which statement best explains this behavior?",
      choices: [
        "Heat causes atoms to move more and spread slightly apart.",
        "Cooling creates new atoms inside the metal.",
        "The rod loses all mass when heated.",
        "Temperature changes only affect the rod's color."
      ],
      correctAnswer: "Heat causes atoms to move more and spread slightly apart.",
      explanation:
        "When matter heats up, particles move more. In many solids that means the particles take up slightly more space, so the object expands.",
      tags: ["physical science", "matter", "temperature"],
      calculatorAllowed: false
    },
    {
      id: "social-seed-001",
      subject: "socialStudies",
      skill: "Primary vs Secondary Sources",
      difficulty: "foundation",
      type: "multiple-choice",
      passageId: "social-civic-letter",
      prompt: "Why is the city council letter considered a primary source?",
      choices: [
        "It summarizes events from a textbook.",
        "It was written by a person directly describing her concern.",
        "It lists facts gathered by historians decades later.",
        "It compares several secondary reports."
      ],
      correctAnswer: "It was written by a person directly describing her concern.",
      explanation:
        "A primary source comes directly from a participant or witness. The letter writer is describing her own experience and request.",
      tags: ["primary source", "civics"],
      calculatorAllowed: false
    },
    {
      id: "social-seed-002",
      subject: "socialStudies",
      skill: "Civics and Government",
      difficulty: "standard",
      type: "multiple-choice",
      prompt: "Which branch of the U.S. government is mainly responsible for interpreting laws?",
      choices: ["Legislative", "Executive", "Judicial", "State"],
      correctAnswer: "Judicial",
      explanation:
        "Courts in the judicial branch interpret laws and decide whether laws or government actions fit the Constitution.",
      tags: ["branches", "constitution"],
      calculatorAllowed: false
    }
  ];

  window.GEDData.catalog = {
    difficultyLabels: difficultyLabels,
    subjectMeta: subjectMeta
  };

  window.GEDData.questions = seedQuestions;
})();
