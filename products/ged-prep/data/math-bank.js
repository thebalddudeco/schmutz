window.GEDData = window.GEDData || {};

(function addMathBank() {
  var questions = [];
  var counter = 1;
  var levels = ["foundation", "foundation", "foundation", "foundation", "standard", "standard", "standard", "standard", "stretch", "stretch"];

  function formatNumber(value) {
    if (Math.abs(value - Math.round(value)) < 0.0001) {
      return String(Math.round(value));
    }
    return value.toFixed(2).replace(/\.?0+$/, "");
  }

  function formatMoney(value) {
    return "$" + Number(value).toFixed(2).replace(/\.00$/, "");
  }

  function uniqueChoices(correct, distractors) {
    var pool = [correct];
    distractors.forEach(function (item) {
      if (pool.indexOf(item) === -1 && pool.length < 4) {
        pool.push(item);
      }
    });
    return pool;
  }

  function rotateChoices(id, choices) {
    var shift = counter % choices.length;
    return choices.slice(shift).concat(choices.slice(0, shift));
  }

  function addQuestion(config) {
    var id = "math-" + String(counter).padStart(3, "0");
    counter += 1;
    var choiceList = rotateChoices(id, uniqueChoices(config.correctText, config.distractors));
    questions.push({
      id: id,
      subject: "math",
      skill: config.skill,
      difficulty: config.difficulty,
      type: config.type,
      prompt: config.prompt,
      choices: choiceList,
      correctAnswer: config.correctText,
      explanation: config.explanation,
      tags: config.tags,
      calculatorAllowed: config.calculatorAllowed
    });
  }

  var arithmeticSpecs = [
    { place: "supply room", start: 148, add: 96, remove: 117, item: "boxes of gloves" },
    { place: "food pantry", start: 235, add: 164, remove: 208, item: "canned meals" },
    { place: "auto shop", start: 82, add: 47, remove: 58, item: "oil filters" },
    { place: "career center", start: 124, add: 89, remove: 133, item: "application folders" },
    { place: "construction trailer", start: 315, add: 126, remove: 278, item: "safety vests" },
    { place: "community clinic", start: 440, add: 185, remove: 362, item: "test kits" },
    { place: "library branch", start: 96, add: 54, remove: 71, item: "lending hotspots" },
    { place: "warehouse shelf", start: 510, add: 225, remove: 498, item: "packing sleeves" },
    { place: "training office", start: 168, add: 93, remove: 122, item: "course packets" },
    { place: "delivery depot", start: 620, add: 140, remove: 515, item: "shipping labels" }
  ];

  arithmeticSpecs.forEach(function (spec, index) {
    var correct = spec.start + spec.add - spec.remove;
    addQuestion({
      skill: "Whole Numbers",
      difficulty: levels[index],
      type: "word-problem",
      prompt:
        "A " +
        spec.place +
        " starts the day with " +
        spec.start +
        " " +
        spec.item +
        ". It receives " +
        spec.add +
        " more and uses " +
        spec.remove +
        ". How many remain?",
      correctText: formatNumber(correct),
      distractors: [
        formatNumber(spec.start + spec.add + spec.remove),
        formatNumber(spec.start - spec.add - spec.remove),
        formatNumber(spec.add - spec.remove)
      ],
      explanation:
        "Add the incoming amount to the starting amount, then subtract what was used: " +
        spec.start +
        " + " +
        spec.add +
        " - " +
        spec.remove +
        " = " +
        correct +
        ".",
      tags: ["whole numbers", "inventory", "multi-step"],
      calculatorAllowed: false
    });
  });

  var integerSpecs = [
    { start: 4, changes: [9, -15], context: "A freezer starts at 4 degrees. It rises 9 degrees during a power issue, then drops 15 degrees after repair." },
    { start: -6, changes: [11, -4], context: "A checking account is at -$6. A deposit raises it by $11, then a fee lowers it by $4." },
    { start: 2, changes: [-7, 10], context: "An elevator begins on floor 2, goes down 7 floors for parking access, then up 10 floors." },
    { start: -3, changes: [-5, 12], context: "A mountain trail marker is at -3 feet relative to a flood line, then drops 5 feet and later rises 12 feet." },
    { start: 7, changes: [-13, 4], context: "A temperature sensor reads 7 degrees, drops 13 degrees overnight, then gains 4 degrees by noon." },
    { start: -12, changes: [8, 6], context: "A debt balance is -$12. Two payments increase the balance by $8 and $6." },
    { start: 1, changes: [-9, 14], context: "A lift platform starts at level 1, moves down 9 levels, then up 14 levels." },
    { start: -15, changes: [10, -3], context: "A refrigerated truck is at -15 degrees, warms 10 degrees during loading, then cools 3 degrees again." },
    { start: 5, changes: [-8, -4], context: "A worker's time bank is 5 hours above zero, then drops 8 hours and later drops 4 more." },
    { start: -9, changes: [7, 9], context: "A ledger starts at -$9. A partial payment adds $7, and a second payment adds $9." }
  ];

  integerSpecs.forEach(function (spec, index) {
    var correct = spec.start + spec.changes[0] + spec.changes[1];
    addQuestion({
      skill: "Integers",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec.context + " What is the final value?",
      correctText: correct < 0 ? "-" + Math.abs(correct) : String(correct),
      distractors: [
        String(spec.start - spec.changes[0] + spec.changes[1]),
        String(spec.start + spec.changes[0] - spec.changes[1]),
        String(Math.abs(correct))
      ],
      explanation:
        "Track the signed changes in order. Starting at " +
        spec.start +
        ", then applying " +
        spec.changes[0] +
        " and " +
        spec.changes[1] +
        " gives " +
        correct +
        ".",
      tags: ["integers", "signed numbers", "change over time"],
      calculatorAllowed: false
    });
  });

  var fractionSpecs = [
    { fraction: [3, 4], times: 2, noun: "cups of oats", context: "recipe batch" },
    { fraction: [5, 8], times: 3, noun: "yards of cable", context: "wiring job" },
    { fraction: [2, 3], times: 4, noun: "mile", context: "walking route" },
    { fraction: [7, 10], times: 5, noun: "liter of cleaning solution", context: "janitorial cart" },
    { fraction: [9, 16], times: 2, noun: "inch", context: "trim cut" },
    { fraction: [11, 12], times: 3, noun: "hour", context: "study block" },
    { fraction: [4, 5], times: 6, noun: "pound of flour", context: "bakery order" },
    { fraction: [7, 9], times: 3, noun: "gallon of paint", context: "hallway repaint" },
    { fraction: [5, 6], times: 2, noun: "meter of fabric", context: "uniform repair" },
    { fraction: [13, 20], times: 4, noun: "mile", context: "delivery loop" }
  ];

  function mixedFractionText(numerator, denominator) {
    var whole = Math.floor(numerator / denominator);
    var remainder = numerator % denominator;
    if (remainder === 0) {
      return String(whole);
    }
    if (whole === 0) {
      return remainder + "/" + denominator;
    }
    return whole + " " + remainder + "/" + denominator;
  }

  fractionSpecs.forEach(function (spec, index) {
    var totalNumerator = spec.fraction[0] * spec.times;
    var correctText = mixedFractionText(totalNumerator, spec.fraction[1]) + " " + spec.noun;
    addQuestion({
      skill: "Fractions",
      difficulty: levels[index],
      type: "word-problem",
      prompt:
        "For a " +
        spec.context +
        ", each unit uses " +
        spec.fraction[0] +
        "/" +
        spec.fraction[1] +
        " " +
        spec.noun +
        ". How much is needed for " +
        spec.times +
        " units?",
      correctText: correctText,
      distractors: [
        mixedFractionText(spec.fraction[0] + spec.times, spec.fraction[1]) + " " + spec.noun,
        mixedFractionText(totalNumerator + spec.fraction[1], spec.fraction[1]) + " " + spec.noun,
        mixedFractionText(spec.fraction[0] * (spec.times - 1), spec.fraction[1]) + " " + spec.noun
      ],
      explanation:
        "Multiply the fraction by the number of units: " +
        spec.fraction[0] +
        "/" +
        spec.fraction[1] +
        " x " +
        spec.times +
        " = " +
        totalNumerator +
        "/" +
        spec.fraction[1] +
        ", which simplifies to " +
        mixedFractionText(totalNumerator, spec.fraction[1]) +
        ".",
      tags: ["fractions", "scaling", "measurement"],
      calculatorAllowed: false
    });
  });

  var decimalSpecs = [
    { a: 12.45, b: 7.8, c: 3.25, label: "office supply order" },
    { a: 18.6, b: 5.75, c: 2.9, label: "fuel purchase" },
    { a: 4.75, b: 6.2, c: 1.85, label: "copy center receipt" },
    { a: 9.35, b: 2.48, c: 4.17, label: "cafeteria checkout" },
    { a: 14.2, b: 3.16, c: 6.04, label: "hardware purchase" },
    { a: 7.95, b: 8.4, c: 1.55, label: "laundry card reload" },
    { a: 22.3, b: 4.49, c: 8.1, label: "warehouse mileage total" },
    { a: 11.18, b: 9.62, c: 3.4, label: "grocery delivery order" },
    { a: 5.75, b: 12.25, c: 2.5, label: "bus and snack spending" },
    { a: 19.4, b: 6.35, c: 7.8, label: "tool rental purchase" }
  ];

  decimalSpecs.forEach(function (spec, index) {
    var correct = spec.a + spec.b - spec.c;
    addQuestion({
      skill: "Decimals",
      difficulty: levels[index],
      type: "word-problem",
      prompt:
        "During a " +
        spec.label +
        ", the shopper spends " +
        formatMoney(spec.a) +
        " and " +
        formatMoney(spec.b) +
        ", then uses a coupon worth " +
        formatMoney(spec.c) +
        ". What is the final total?",
      correctText: formatMoney(correct),
      distractors: [
        formatMoney(spec.a + spec.b + spec.c),
        formatMoney(spec.a - spec.b + spec.c),
        formatMoney(spec.b + spec.c)
      ],
      explanation:
        "Add the two spending amounts and subtract the coupon: " +
        formatMoney(spec.a) +
        " + " +
        formatMoney(spec.b) +
        " - " +
        formatMoney(spec.c) +
        " = " +
        formatMoney(correct) +
        ".",
      tags: ["decimals", "money", "subtraction"],
      calculatorAllowed: true
    });
  });

  var percentSpecs = [
    { base: 48, percent: 25, action: "discount", item: "work boots" },
    { base: 72, percent: 15, action: "tip", item: "catering order" },
    { base: 860, percent: 8, action: "raise", item: "weekly pay" },
    { base: 250, percent: 12, action: "tax", item: "equipment purchase" },
    { base: 40, percent: 30, action: "markdown", item: "winter coat" },
    { base: 96, percent: 10, action: "savings deposit", item: "side-job payment" },
    { base: 320, percent: 18, action: "service fee", item: "repair invoice" },
    { base: 150, percent: 35, action: "sale", item: "desk chair" },
    { base: 64, percent: 5, action: "increase", item: "monthly bus pass" },
    { base: 1250, percent: 4, action: "commission", item: "furniture sale" }
  ];

  percentSpecs.forEach(function (spec, index) {
    var correct = (spec.base * spec.percent) / 100;
    addQuestion({
      skill: "Percents",
      difficulty: levels[index],
      type: "word-problem",
      prompt:
        "What is " +
        spec.percent +
        "% of " +
        formatMoney(spec.base) +
        " in a " +
        spec.action +
        " situation for a " +
        spec.item +
        "?",
      correctText: formatMoney(correct),
      distractors: [
        formatMoney(spec.base - correct),
        formatMoney(spec.percent + spec.base),
        formatMoney(correct / 2)
      ],
      explanation:
        "Convert the percent to a decimal and multiply: " +
        spec.percent +
        "% = " +
        spec.percent / 100 +
        ", so " +
        spec.base +
        " x " +
        spec.percent / 100 +
        " = " +
        correct +
        ".",
      tags: ["percents", "money", spec.action],
      calculatorAllowed: true
    });
  });

  var ratioSpecs = [
    { a: 2, b: 3, scale: 10, nounA: "gallons of base paint", nounB: "gallons of tint", context: "painting crew" },
    { a: 4, b: 5, scale: 12, nounA: "hours of study", nounB: "practice sets", context: "weekly prep plan" },
    { a: 3, b: 8, scale: 15, nounA: "scoops of mix", nounB: "bottles of water", context: "sports cooler" },
    { a: 5, b: 2, scale: 25, nounA: "boxes loaded", nounB: "minutes", context: "shipping line" },
    { a: 6, b: 7, scale: 18, nounA: "pages read", nounB: "notes written", context: "study notebook" },
    { a: 7, b: 4, scale: 21, nounA: "feet of pipe", nounB: "connectors", context: "plumbing job" },
    { a: 9, b: 2, scale: 27, nounA: "meal tickets", nounB: "volunteers", context: "community dinner" },
    { a: 8, b: 3, scale: 40, nounA: "miles driven", nounB: "gallons used", context: "delivery van" },
    { a: 11, b: 5, scale: 33, nounA: "students checked in", nounB: "rows opened", context: "testing room" },
    { a: 12, b: 7, scale: 36, nounA: "chairs set", nounB: "tables set", context: "event hall" }
  ];

  ratioSpecs.forEach(function (spec, index) {
    var factor = spec.scale / spec.a;
    var correct = spec.b * factor;
    addQuestion({
      skill: "Ratios and Proportions",
      difficulty: levels[index],
      type: "word-problem",
      prompt:
        "In a " +
        spec.context +
        ", the ratio is " +
        spec.a +
        " " +
        spec.nounA +
        " to " +
        spec.b +
        " " +
        spec.nounB +
        ". If there are " +
        spec.scale +
        " " +
        spec.nounA +
        ", how many " +
        spec.nounB +
        " are needed?",
      correctText: formatNumber(correct),
      distractors: [
        formatNumber(spec.scale + spec.b),
        formatNumber(spec.scale - spec.b),
        formatNumber(spec.b * spec.a)
      ],
      explanation:
        "Set up a proportion. Since " +
        spec.a +
        " becomes " +
        spec.scale +
        ", the scale factor is " +
        factor +
        ". Multiply " +
        spec.b +
        " by " +
        factor +
        " to get " +
        correct +
        ".",
      tags: ["ratios", "proportions", "scaling"],
      calculatorAllowed: true
    });
  });

  var algebraValueSpecs = [
    { fixed: 18, rate: 12, value: 4, context: "A phone repair bill has a $18 service fee plus $12 for each replaced screen protector. What is the total cost when 4 protectors are replaced?" },
    { fixed: 35, rate: 7, value: 6, context: "A study center charges $35 to register and $7 for each practice test. What is the total for 6 tests?" },
    { fixed: 24, rate: 9, value: 5, context: "A delivery driver earns a $24 base bonus plus $9 for each completed route. What is the pay for 5 routes?" },
    { fixed: 12, rate: 14, value: 3, context: "A tutoring session includes a $12 materials fee and $14 for each hour. What is the total for 3 hours?" },
    { fixed: 55, rate: 4, value: 8, context: "A warehouse order has a $55 setup charge and $4 for each box label printed. What is the total for 8 labels?" },
    { fixed: 8, rate: 16, value: 7, context: "A bus charter invoice adds an $8 booking fee and $16 per rider. What is the total for 7 riders?" },
    { fixed: 40, rate: 11, value: 2, context: "A carpentry estimate includes $40 for travel and $11 for each board cut. What is the total for 2 boards?" },
    { fixed: 15, rate: 6, value: 9, context: "A print shop charges a $15 setup fee and $6 per poster. What is the total for 9 posters?" },
    { fixed: 62, rate: 13, value: 4, context: "A trainer receives $62 for planning plus $13 for each workshop delivered. What is the total for 4 workshops?" },
    { fixed: 27, rate: 5, value: 12, context: "A lab order includes $27 for handling and $5 for each sample. What is the total for 12 samples?" }
  ];

  algebraValueSpecs.forEach(function (spec, index) {
    var correct = spec.fixed + spec.rate * spec.value;
    addQuestion({
      skill: "Algebra Basics",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec.context,
      correctText: formatMoney(correct),
      distractors: [
        formatMoney((spec.fixed + spec.rate) * spec.value),
        formatMoney(spec.fixed * spec.rate + spec.value),
        formatMoney(spec.rate * spec.value)
      ],
      explanation:
        "Substitute the given value into the expression fixed fee + rate x number of units. That gives " +
        spec.fixed +
        " + " +
        spec.rate +
        "(" +
        spec.value +
        ") = " +
        correct +
        ".",
      tags: ["algebra", "expressions", "substitution"],
      calculatorAllowed: false
    });
  });

  var equationSpecs = [
    { start: 18, rate: 6, total: 54, context: "A moving job pays a $18 show-up fee plus $6 per hour. If the total pay was $54, how many hours were worked?" },
    { start: 25, rate: 4, total: 61, context: "A meal delivery order costs $25 plus $4 per extra tray. If the total was $61, how many extra trays were ordered?" },
    { start: 12, rate: 9, total: 66, context: "A mechanic charges $12 for supplies plus $9 per labor unit. If the bill was $66, how many labor units were charged?" },
    { start: 7, rate: 8, total: 47, context: "A print job has a $7 setup fee and $8 per banner. If the invoice total is $47, how many banners were printed?" },
    { start: 30, rate: 5, total: 85, context: "A training budget starts with $30 and increases by $5 per workbook. If the total budget is $85, how many workbooks are included?" },
    { start: 14, rate: 11, total: 58, context: "A repair visit includes $14 for travel and $11 per part installed. If the visit cost $58, how many parts were installed?" },
    { start: 16, rate: 3, total: 43, context: "A parking charge starts at $16 and adds $3 per hour. If the total was $43, how many hours was the car parked?" },
    { start: 9, rate: 12, total: 81, context: "A delivery service charges $9 plus $12 per stop. If the invoice total is $81, how many stops were made?" },
    { start: 22, rate: 7, total: 71, context: "A class fee is $22 plus $7 per lab session. If the full cost was $71, how many labs were included?" },
    { start: 45, rate: 15, total: 120, context: "A contractor charges $45 to visit the site plus $15 per hour. If the total bill was $120, how many hours were billed?" }
  ];

  equationSpecs.forEach(function (spec, index) {
    var correct = (spec.total - spec.start) / spec.rate;
    addQuestion({
      skill: "Equations and Inequalities",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt: spec.context,
      correctText: formatNumber(correct),
      distractors: [
        formatNumber(spec.total / spec.rate),
        formatNumber((spec.total + spec.start) / spec.rate),
        formatNumber(spec.total - spec.start)
      ],
      explanation:
        "Subtract the starting fee from the total, then divide by the rate: (" +
        spec.total +
        " - " +
        spec.start +
        ") / " +
        spec.rate +
        " = " +
        correct +
        ".",
      tags: ["equations", "solve for x", "linear"],
      calculatorAllowed: false
    });
  });

  var geometrySpecs = [
    { length: 18, width: 12, ask: "area", place: "community garden bed" },
    { length: 26, width: 8, ask: "perimeter", place: "storage fence" },
    { length: 14, width: 9, ask: "area", place: "office rug" },
    { length: 32, width: 11, ask: "perimeter", place: "training room wall border" },
    { length: 20, width: 15, ask: "area", place: "patio slab" },
    { length: 17, width: 6, ask: "perimeter", place: "display board trim" },
    { length: 13, width: 7, ask: "area", place: "closet floor" },
    { length: 24, width: 10, ask: "perimeter", place: "parking sign frame" },
    { length: 28, width: 16, ask: "area", place: "classroom carpet" },
    { length: 19, width: 5, ask: "perimeter", place: "raised planter border" }
  ];

  geometrySpecs.forEach(function (spec, index) {
    var correct = spec.ask === "area" ? spec.length * spec.width : 2 * (spec.length + spec.width);
    addQuestion({
      skill: "Perimeter and Area",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt:
        "A rectangular " +
        spec.place +
        " is " +
        spec.length +
        " feet by " +
        spec.width +
        " feet. What is its " +
        spec.ask +
        "?",
      correctText: formatNumber(correct) + (spec.ask === "area" ? " square feet" : " feet"),
      distractors: [
        formatNumber(spec.length + spec.width) + (spec.ask === "area" ? " square feet" : " feet"),
        formatNumber(spec.length * spec.width * 2) + (spec.ask === "area" ? " square feet" : " feet"),
        formatNumber(2 * spec.length + spec.width) + (spec.ask === "area" ? " square feet" : " feet")
      ],
      explanation:
        (spec.ask === "area"
          ? "Area of a rectangle is length x width: "
          : "Perimeter of a rectangle is 2(length + width): ") +
        "using " +
        spec.length +
        " and " +
        spec.width +
        " gives " +
        correct +
        ".",
      tags: ["geometry", spec.ask, "measurement"],
      calculatorAllowed: false
    });
  });

  var volumeSpecs = [
    { l: 8, w: 5, h: 3, object: "storage bin" },
    { l: 12, w: 4, h: 6, object: "shipping crate" },
    { l: 10, w: 7, h: 2, object: "tool drawer" },
    { l: 9, w: 6, h: 5, object: "supply cabinet compartment" },
    { l: 14, w: 3, h: 4, object: "mailing box" },
    { l: 11, w: 8, h: 2, object: "book return slot" },
    { l: 7, w: 7, h: 7, object: "cube organizer" },
    { l: 16, w: 5, h: 3, object: "equipment case" },
    { l: 13, w: 6, h: 4, object: "locker drawer" },
    { l: 15, w: 9, h: 2, object: "under-bed storage tray" }
  ];

  volumeSpecs.forEach(function (spec, index) {
    var correct = spec.l * spec.w * spec.h;
    addQuestion({
      skill: "Volume and Measurement",
      difficulty: levels[index],
      type: "multiple-choice",
      prompt:
        "A rectangular " +
        spec.object +
        " measures " +
        spec.l +
        " inches by " +
        spec.w +
        " inches by " +
        spec.h +
        " inches. What is its volume?",
      correctText: formatNumber(correct) + " cubic inches",
      distractors: [
        formatNumber(spec.l * spec.w + spec.h) + " cubic inches",
        formatNumber(2 * (spec.l + spec.w + spec.h)) + " cubic inches",
        formatNumber(spec.l + spec.w + spec.h) + " cubic inches"
      ],
      explanation:
        "Volume of a rectangular prism is length x width x height. Multiply " +
        spec.l +
        " x " +
        spec.w +
        " x " +
        spec.h +
        " to get " +
        correct +
        ".",
      tags: ["volume", "measurement", "rectangular prism"],
      calculatorAllowed: false
    });
  });

  var coordinateSpecs = [
    { point: [4, 3], ask: "quadrant", answer: "Quadrant I", distractors: ["Quadrant II", "Quadrant III", "Quadrant IV"], explanation: "Both coordinates are positive, so the point is in Quadrant I." },
    { point: [-5, 2], ask: "quadrant", answer: "Quadrant II", distractors: ["Quadrant I", "Quadrant III", "Quadrant IV"], explanation: "A negative x-value and positive y-value place the point in Quadrant II." },
    { point: [-4, -6], ask: "quadrant", answer: "Quadrant III", distractors: ["Quadrant I", "Quadrant II", "Quadrant IV"], explanation: "Both coordinates are negative, which means Quadrant III." },
    { point: [3, -7], ask: "quadrant", answer: "Quadrant IV", distractors: ["Quadrant I", "Quadrant II", "Quadrant III"], explanation: "A positive x-value and negative y-value place the point in Quadrant IV." },
    { a: [2, 5], b: [8, 5], ask: "horizontal distance", answer: "6 units", distractors: ["3 units", "10 units", "13 units"], explanation: "The y-values match, so count only the change in x: 8 - 2 = 6." },
    { a: [-3, 1], b: [-3, 9], ask: "vertical distance", answer: "8 units", distractors: ["6 units", "9 units", "12 units"], explanation: "The x-values match, so count only the change in y: 9 - 1 = 8." },
    { a: [1, 2], b: [4, 5], ask: "slope", answer: "1", distractors: ["3", "1/3", "2"], explanation: "Slope is rise over run: (5 - 2) / (4 - 1) = 3/3 = 1." },
    { a: [-2, 4], b: [2, 8], ask: "slope", answer: "1", distractors: ["2", "4", "-1"], explanation: "Slope is (8 - 4) / (2 - -2) = 4/4 = 1." },
    { a: [0, 6], b: [5, 6], ask: "line type", answer: "horizontal", distractors: ["vertical", "diagonal with negative slope", "undefined"], explanation: "Equal y-values create a horizontal line." },
    { a: [7, -1], b: [7, 4], ask: "line type", answer: "vertical", distractors: ["horizontal", "slope 1", "slope 0"], explanation: "Equal x-values create a vertical line." }
  ];

  coordinateSpecs.forEach(function (spec, index) {
    var prompt;
    if (spec.ask === "quadrant") {
      prompt = "On a coordinate grid, the point (" + spec.point[0] + ", " + spec.point[1] + ") lies in which quadrant?";
    } else if (spec.ask === "horizontal distance" || spec.ask === "vertical distance") {
      prompt =
        "Points A" +
        "(" +
        spec.a[0] +
        ", " +
        spec.a[1] +
        ") and B(" +
        spec.b[0] +
        ", " +
        spec.b[1] +
        ") are plotted on a map grid. What is the " +
        spec.ask +
        " between them?";
    } else if (spec.ask === "slope") {
      prompt =
        "What is the slope of the line through points (" +
        spec.a[0] +
        ", " +
        spec.a[1] +
        ") and (" +
        spec.b[0] +
        ", " +
        spec.b[1] +
        ")?";
    } else {
      prompt =
        "Points (" +
        spec.a[0] +
        ", " +
        spec.a[1] +
        ") and (" +
        spec.b[0] +
        ", " +
        spec.b[1] +
        ") form what kind of line?";
    }

    addQuestion({
      skill: "Coordinate Plane Basics",
      difficulty: levels[index],
      type: "coordinate-plane",
      prompt: prompt,
      correctText: spec.answer,
      distractors: spec.distractors,
      explanation: spec.explanation,
      tags: ["coordinate plane", "graphing", "points"],
      calculatorAllowed: false
    });
  });

  var tableSpecs = [
    { table: "2 hours -> $38; 4 hours -> $76; 6 hours -> $114", ask: "hourly pay", answer: "$19", distractors: ["$38", "$9.50", "$76"], explanation: "Divide pay by hours. 38 / 2 = 19, and the table stays consistent." },
    { table: "3 shirts -> $27; 5 shirts -> $45; 8 shirts -> $72", ask: "price per shirt", answer: "$9", distractors: ["$8", "$12", "$27"], explanation: "Use unit rate. 27 / 3 = 9 dollars per shirt." },
    { table: "1 trip -> 14 miles; 2 trips -> 28 miles; 5 trips -> 70 miles", ask: "miles per trip", answer: "14", distractors: ["7", "28", "56"], explanation: "The distance grows by 14 miles each trip." },
    { table: "Week 1 -> 120 flyers; Week 2 -> 150 flyers; Week 3 -> 180 flyers", ask: "change each week", answer: "30", distractors: ["20", "60", "150"], explanation: "Each week adds 30 flyers: 150 - 120 and 180 - 150." },
    { table: "2 boxes -> 18 labels; 4 boxes -> 36 labels; 7 boxes -> 63 labels", ask: "labels per box", answer: "9", distractors: ["8", "18", "27"], explanation: "18 / 2 = 9 labels per box, and the rest of the table matches." },
    { table: "1 class -> 45 minutes; 3 classes -> 135 minutes; 5 classes -> 225 minutes", ask: "minutes per class", answer: "45", distractors: ["30", "90", "135"], explanation: "Each class lasts 45 minutes because 135 / 3 = 45." },
    { table: "4 meals -> $52; 6 meals -> $78; 9 meals -> $117", ask: "cost per meal", answer: "$13", distractors: ["$11", "$26", "$52"], explanation: "Use any row. 52 / 4 = 13 dollars per meal." },
    { table: "Day 1 -> 22 calls; Day 2 -> 28 calls; Day 3 -> 34 calls", ask: "increase per day", answer: "6", distractors: ["5", "8", "12"], explanation: "Calls rise by 6 each day: 28 - 22 and 34 - 28." },
    { table: "3 gallons -> 72 ounces; 5 gallons -> 120 ounces; 8 gallons -> 192 ounces", ask: "ounces per gallon", answer: "24", distractors: ["12", "36", "40"], explanation: "72 / 3 = 24 ounces per gallon." },
    { table: "2 shelves -> 16 bins; 5 shelves -> 40 bins; 9 shelves -> 72 bins", ask: "bins per shelf", answer: "8", distractors: ["6", "10", "16"], explanation: "Use the unit rate: 16 / 2 = 8 bins per shelf." }
  ];

  tableSpecs.forEach(function (spec, index) {
    addQuestion({
      skill: "Graph and Table Interpretation",
      difficulty: levels[index],
      type: "data-interpretation",
      prompt: "Read this table pattern: " + spec.table + ". What is the " + spec.ask + "?",
      correctText: spec.answer,
      distractors: spec.distractors,
      explanation: spec.explanation,
      tags: ["tables", "unit rate", "data interpretation"],
      calculatorAllowed: false
    });
  });

  window.GEDData.references = window.GEDData.references || {};
  window.GEDData.references.math = {
    formulas: [
      "Rectangle area = length x width",
      "Rectangle perimeter = 2(length + width)",
      "Rectangular prism volume = length x width x height",
      "Percent amount = percent as decimal x whole"
    ]
  };

  window.GEDData.questions = (window.GEDData.questions || []).concat(questions);
})();
