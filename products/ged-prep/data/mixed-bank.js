window.GEDData = window.GEDData || {};

(function addMixedBank() {
  var questions = [];
  var counter = 1;
  var levels = ["foundation", "foundation", "foundation", "foundation", "standard", "standard", "standard", "standard", "stretch", "stretch"];

  function addQuestion(config) {
    questions.push({
      id: "mixed-" + String(counter).padStart(3, "0"),
      subject: "mixed",
      skill: config.skill,
      difficulty: config.difficulty,
      type: "mixed-review",
      prompt: config.prompt,
      choices: config.choices,
      correctAnswer: config.correctAnswer,
      explanation: config.explanation,
      tags: config.tags,
      calculatorAllowed: false
    });
    counter += 1;
  }

  [
    ["A worker earns $18 per hour for 6 hours. What is the gross pay before deductions?", ["$96", "$108", "$124", "$144"], "$108", "Multiply the hourly rate by the number of hours: 18 x 6 = 108."],
    ["A bus pass costs $42 each month. About how much does it cost for 3 months?", ["$84", "$96", "$126", "$168"], "$126", "Multiply the monthly cost by 3 months: 42 x 3 = 126."],
    ["A pantry uses 12 cans for each family box. How many cans are needed for 7 boxes?", ["72", "84", "96", "108"], "84", "Use the unit rate: 12 cans per box x 7 boxes = 84 cans."],
    ["A phone battery is at 80 percent and drops 15 percentage points. What is the new battery level?", ["55 percent", "60 percent", "65 percent", "95 percent"], "65 percent", "Subtract the percentage points: 80 - 15 = 65."],
    ["A worker saves $25 each week. How much is saved after 8 weeks?", ["$150", "$175", "$200", "$225"], "$200", "Saving 25 dollars each week for 8 weeks gives 25 x 8 = 200."],
    ["A table rental is $35 plus $9 for each chair. What is the total for 4 chairs?", ["$44", "$62", "$71", "$80"], "$71", "Add the fixed fee and the chair cost: 35 + (9 x 4) = 71."],
    ["A grocery total is $56 and a store coupon removes 20 percent. What is the discount amount?", ["$8.40", "$11.20", "$16.80", "$44.80"], "$11.20", "Twenty percent of 56 is 0.20 x 56 = 11.20."],
    ["A room is 12 feet by 9 feet. What is the area of the floor?", ["21 square feet", "42 square feet", "96 square feet", "108 square feet"], "108 square feet", "Area of a rectangle is length x width: 12 x 9 = 108."],
    ["A supply shelf holds 5 rows with 8 bins in each row. How many bins is that?", ["13", "32", "40", "48"], "40", "Multiply the rows by the bins per row: 5 x 8 = 40."],
    ["A delivery route covers 14 miles each day. How far is that in 5 days?", ["56 miles", "60 miles", "70 miles", "75 miles"], "70 miles", "Multiply 14 miles per day by 5 days to get 70 miles."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Quantitative",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "math", "adult life"]
    });
  });

  [
    ["A memo says the office will open later on Fridays so staff can attend training. What is the main idea?", ["The office is closing permanently.", "Friday hours are changing because staff training is scheduled.", "Training is optional for customers.", "The memo is about parking."], "Friday hours are changing because staff training is scheduled.", "The sentence explains both the change and the reason for it."],
    ["Which sentence is most professional for a work email?", ["Send me that now.", "Please send the updated file by 3 p.m. if possible.", "I need this right away and it is late.", "Why did nobody send this?"], "Please send the updated file by 3 p.m. if possible.", "The best choice is polite, specific, and professional."],
    ["A passage says a program helped adults finish certificates while keeping full-time jobs. What evidence would best support that claim?", ["The classrooms are painted blue.", "Most participants attended classes in the evening after work.", "The building has a parking lot.", "The program printed new brochures."], "Most participants attended classes in the evening after work.", "That evidence directly connects program design to the claim about working adults."],
    ["Which word best describes the tone of a calm instruction guide?", ["sarcastic", "instructional", "furious", "playful"], "instructional", "A guide that explains steps in a steady way is instructional."],
    ["Which revision is strongest? \"The class was good and helpful and nice.\"", ["The class was useful because it gave clear practice and feedback.", "The class was good and nice.", "The class was nice because it was nice.", "The class was good and helpful and helpful."], "The class was useful because it gave clear practice and feedback.", "The strongest revision replaces vague repetition with a specific reason."],
    ["If a writer lists examples from several workers, the writer is most likely trying to", ["confuse the reader", "show the issue affects more than one person", "change the topic completely", "avoid giving evidence"], "show the issue affects more than one person", "Multiple examples broaden the claim and make it more convincing."],
    ["Which transition best shows contrast?", ["For example,", "However,", "As a result,", "Next,"], "However,", "However signals a shift from one point to a contrasting point."],
    ["What does the phrase \"measurable progress\" most nearly mean?", ["progress that can be tracked", "progress that should be hidden", "progress that stopped", "progress that is imaginary"], "progress that can be tracked", "Measurable means able to be measured or tracked."],
    ["Which sentence avoids a run-on?", ["The workshop ran late, so the instructor shortened the break.", "The workshop ran late the instructor shortened the break.", "The workshop ran late; so the instructor shortened the break.", "The workshop ran late so, the instructor shortened the break."], "The workshop ran late, so the instructor shortened the break.", "A comma before so correctly joins the two complete sentences."],
    ["A conclusion should mainly do what?", ["Introduce a brand-new topic", "Repeat the main point in a final focused way", "Ignore the evidence", "List unrelated details"], "Repeat the main point in a final focused way", "A conclusion should reinforce the main point rather than adding unrelated material."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Reading",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "rla", "reading"]
    });
  });

  [
    ["A scientist changes only the amount of sunlight plants receive. What is the independent variable?", ["plant height", "amount of sunlight", "number of leaves", "final conclusion"], "amount of sunlight", "The independent variable is the factor changed on purpose."],
    ["Why do repeated trials strengthen an experiment?", ["They remove the need for data", "They make results more reliable", "They guarantee success", "They replace the control group"], "They make results more reliable", "Repeating trials reduces the chance that one unusual result will control the conclusion."],
    ["Fish die when dissolved oxygen in a pond drops too low. What is the best conclusion?", ["Oxygen level affects fish survival.", "The pond is always frozen.", "Fish do not need water.", "Weather never matters."], "Oxygen level affects fish survival.", "The evidence directly connects low oxygen to fish survival."],
    ["What is the main job of the cell membrane?", ["Store sunlight", "Control what enters and leaves the cell", "Pump blood", "Move tectonic plates"], "Control what enters and leaves the cell", "The cell membrane regulates movement into and out of the cell."],
    ["Rust forming on iron is best described as", ["a physical change", "a chemical change", "a living process", "a weather map"], "a chemical change", "Rust forms a new substance, so it is a chemical change."],
    ["What usually happens when friction increases?", ["Objects speed up more easily", "Objects resist motion more", "Mass disappears", "Gravity stops"], "Objects resist motion more", "Friction opposes motion, so more friction means more resistance."],
    ["Earth's seasons happen mainly because", ["the Moon changes shape", "Earth's axis is tilted", "the Sun gets smaller", "clouds block all light"], "Earth's axis is tilted", "The tilt changes how directly sunlight reaches each hemisphere during the year."],
    ["A graph shows plant growth increased as fertilizer amount increased. What conclusion is best supported?", ["Fertilizer probably affected growth in this test.", "Fertilizer has no effect ever.", "The graph proves every plant will grow the same.", "Soil does not matter at all."], "Fertilizer probably affected growth in this test.", "A careful conclusion stays close to the evidence shown in the graph."],
    ["Which condition should stay the same in a fair shoe test?", ["shoe brand only", "same runner and same distance", "different track lengths", "changing timing methods"], "same runner and same distance", "Keeping those conditions the same makes the comparison fairer."],
    ["When water vapor cools and becomes liquid droplets, the process is", ["evaporation", "condensation", "erosion", "photosynthesis"], "condensation", "Condensation is the change from gas to liquid."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Science Reasoning",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "science", "reasoning"]
    });
  });

  [
    ["Which branch of government mainly interprets laws?", ["Executive", "Judicial", "Legislative", "Local"], "Judicial", "Courts in the judicial branch interpret laws and review constitutional issues."],
    ["Paying taxes required by law is best described as", ["a civic responsibility", "a natural right", "a weather event", "a market shortage"], "a civic responsibility", "Citizens have responsibilities as well as rights."],
    ["Which level of government usually issues driver's licenses?", ["State government", "Federal government", "Foreign government", "Private businesses"], "State government", "Driver's licenses are generally handled by state governments."],
    ["A diary written during a historical event is a", ["secondary source", "primary source", "forecast", "budget report"], "primary source", "A diary from the time of the event is a direct firsthand source."],
    ["If demand rises and supply stays the same, price often", ["falls", "stays hidden", "increases", "disappears"], "increases", "Greater demand with the same supply often pushes prices upward."],
    ["What principle says government leaders must follow the law?", ["rule of law", "inflation", "erosion", "osmosis"], "rule of law", "Rule of law means no one is above the law."],
    ["A voter researching candidates before election day is showing", ["informed participation", "judicial review", "market speculation", "plate movement"], "informed participation", "Learning about candidates before voting is a form of informed civic participation."],
    ["Which action is a check on the executive branch?", ["The president signs a bill.", "Congress overrides a veto.", "A governor opens a school.", "A company hires workers."], "Congress overrides a veto.", "That action limits executive power through checks and balances."],
    ["A map legend helps readers", ["understand symbols on the map", "change the weather", "write laws", "measure blood flow"], "understand symbols on the map", "A legend explains what map symbols mean."],
    ["The first ten amendments are known as the", ["Articles of Confederation", "Bill of Rights", "Declaration of Causes", "Cabinet"], "Bill of Rights", "The first ten amendments protect important individual liberties."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Civics Reasoning",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "social studies", "civics"]
    });
  });

  [
    ["A catering order serves 24 people with 6 trays. How many people does each tray serve?", ["3", "4", "5", "6"], "4", "Divide the total people by the trays: 24 / 6 = 4."],
    ["A worker's paycheck is $540 before a $45 deduction. What is the take-home amount after that one deduction?", ["$485", "$495", "$505", "$585"], "$495", "Subtract the deduction from the gross pay: 540 - 45 = 495."],
    ["A class meets 3 evenings each week for 8 weeks. How many class meetings is that?", ["11", "21", "24", "32"], "24", "Multiply 3 meetings per week by 8 weeks."],
    ["A gallon of paint covers 350 square feet. About how many gallons are needed for 700 square feet?", ["1", "2", "3", "4"], "2", "700 divided by 350 equals 2 gallons."],
    ["A bus leaves at 6:15 p.m. and arrives at 7:05 p.m. How long is the trip?", ["35 minutes", "45 minutes", "50 minutes", "55 minutes"], "50 minutes", "From 6:15 to 7:05 is 50 minutes."],
    ["A $90 jacket is reduced by $30. What percent of the original price was the reduction?", ["25 percent", "30 percent", "33 percent", "40 percent"], "33 percent", "30 out of 90 is one third, which is about 33 percent."],
    ["A toolbox weighs 18 pounds. Five identical toolboxes weigh how much?", ["72 pounds", "80 pounds", "90 pounds", "108 pounds"], "90 pounds", "Multiply 18 by 5 to get 90."],
    ["A warehouse stacks 9 boxes on each pallet. How many pallets are needed for 81 boxes?", ["7", "8", "9", "10"], "9", "81 divided by 9 equals 9 pallets."],
    ["A worker reads 12 pages in 20 minutes. At that rate, about how many pages can be read in 40 minutes?", ["12", "18", "24", "30"], "24", "Doubling the time doubles the pages if the rate stays the same."],
    ["A community dinner uses 4 cans of beans for every 3 trays of rice. If 12 trays of rice are used, how many cans of beans are needed?", ["12", "15", "16", "18"], "16", "The rice amount is multiplied by 4, so the beans are also multiplied by 4: 4 x 4 = 16."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Quantitative",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "math", "practice"]
    });
  });

  [
    ["A memo says parking lot repairs will begin Monday and drivers should use the east entrance. What detail is most important for workers arriving that day?", ["The workers should use the east entrance.", "The parking lot is large.", "The memo was printed on white paper.", "Repairs happen every year."], "The workers should use the east entrance.", "That detail tells readers exactly what action to take."],
    ["Which sentence gives the strongest support for a claim that tutoring improves outcomes?", ["Students said the room was comfortable.", "Eighty-two percent of attendees improved at least one score level after four weeks.", "The program used blue folders.", "Tutors arrived on time."], "Eighty-two percent of attendees improved at least one score level after four weeks.", "Specific measurable evidence is stronger than general description."],
    ["A writer describes a new job-training program as practical, steady, and realistic. What tone does that wording create?", ["mocking", "measured and supportive", "confused", "playful"], "measured and supportive", "Those words create a calm, encouraging tone."],
    ["Which revision is best? \"The guide explains things. It is good.\"", ["The guide explains each step clearly and uses examples that readers can apply.", "The guide is good and explains things.", "It explains things and is nice.", "The guide explains and is good because it is helpful."], "The guide explains each step clearly and uses examples that readers can apply.", "The strongest revision replaces vague words with specific strengths."],
    ["If a passage compares two proposals point by point, the author is most likely trying to", ["avoid taking a position", "help readers evaluate the options directly", "hide the evidence", "change subjects quickly"], "help readers evaluate the options directly", "Point-by-point comparison helps readers weigh the strengths of each option."],
    ["Which sentence is written correctly?", ["The team finished the report, and the supervisor approved it that evening.", "The team finished the report and, the supervisor approved it that evening.", "The team finished the report, the supervisor approved it that evening.", "The team finished the report; and the supervisor approved it that evening."], "The team finished the report, and the supervisor approved it that evening.", "A comma before and is correct when it joins two complete sentences."],
    ["What is the best main idea of a passage that says workers need both skill training and reliable transportation to keep stable jobs?", ["Workers should avoid training programs.", "Job stability often depends on more than one support system.", "Transportation never matters.", "Only employers are responsible for success."], "Job stability often depends on more than one support system.", "The passage connects training and transportation as combined supports."],
    ["Which transition best introduces a result?", ["As a result,", "For example,", "Meanwhile,", "Likewise,"], "As a result,", "As a result signals an outcome."],
    ["A strong concluding sentence should", ["repeat every detail word for word", "tie the evidence back to the main point", "begin a new argument", "ignore the passage claim"], "tie the evidence back to the main point", "A conclusion should reinforce the core point using what the paragraph established."],
    ["The phrase \"barrier to employment\" most nearly means", ["a problem that makes holding a job harder", "a reward for working", "an application form", "a safety helmet"], "a problem that makes holding a job harder", "Barrier here means obstacle."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Reading",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "rla", "evidence"]
    });
  });

  [
    ["A control group in a medical study usually receives", ["the standard treatment or placebo for comparison", "every experimental drug at once", "no measurements at all", "a rewritten hypothesis"], "the standard treatment or placebo for comparison", "A control group provides a baseline for comparison."],
    ["If two metal rods are heated equally but one expands more, the best conclusion is", ["the materials respond differently to heat", "heat has no effect on solids", "the shorter rod must be alive", "all metals expand by the same amount"], "the materials respond differently to heat", "The rods showed different amounts of expansion under the same condition."],
    ["Why should a scientist record exact measurements instead of only using words like big or small?", ["Exact measurements make results clearer and easier to compare.", "Words are never allowed in science.", "Measurements remove the need for conclusions.", "The hypothesis changes automatically."], "Exact measurements make results clearer and easier to compare.", "Precise measurements support stronger analysis."],
    ["What is the dependent variable in a test that changes water temperature and measures dissolving time?", ["water temperature", "dissolving time", "the scientist", "the notebook"], "dissolving time", "The dependent variable is what is measured."],
    ["If a food web loses a top predator, one possible result is", ["some prey populations may rise quickly", "all plant life stops immediately", "gravity becomes weaker", "weather disappears"], "some prey populations may rise quickly", "Removing a top predator can change population balance."],
    ["A battery-powered flashlight converts chemical energy mainly into", ["light and some heat", "mass only", "sound only", "gravity"], "light and some heat", "The battery's stored chemical energy becomes electrical energy, then light and heat."],
    ["The best reason to keep sample size large in a survey is to", ["reduce the effect of unusual individual responses", "guarantee the result is correct", "remove the need for analysis", "avoid organizing data"], "reduce the effect of unusual individual responses", "Larger samples usually give more dependable patterns."],
    ["When warm moist air rises, cools, and forms clouds, which process is most directly involved?", ["condensation", "erosion", "magnetism", "combustion"], "condensation", "Cooling water vapor into droplets is condensation."],
    ["A result that can be reproduced by another team under similar conditions is considered more", ["reliable", "imaginary", "temporary", "random"], "reliable", "Reproducibility is a major sign of reliability."],
    ["Which conclusion goes too far?", ["This fertilizer increased growth in these tomato plants under these conditions.", "This fertilizer caused faster growth in this test.", "The data suggest a growth difference during the trial.", "This proves the fertilizer will improve every plant in every environment."], "This proves the fertilizer will improve every plant in every environment.", "That claim goes far beyond the evidence from one test."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Science Reasoning",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "science", "analysis"]
    });
  });

  [
    ["If a state law conflicts with the U.S. Constitution, which principle applies?", ["constitutional supremacy", "inflation", "urbanization", "condensation"], "constitutional supremacy", "The Constitution is the highest law, so conflicting laws can be overturned."],
    ["Which government level is most likely to manage city trash pickup schedules?", ["local government", "federal government", "foreign government", "judicial branch"], "local government", "Trash collection is usually handled locally."],
    ["Why is a newspaper editorial about a historical event usually a secondary source?", ["It interprets or comments on events rather than serving as firsthand evidence from participants.", "It is always longer than a diary.", "It contains numbers.", "It uses official paper."], "It interprets or comments on events rather than serving as firsthand evidence from participants.", "Secondary sources analyze or summarize events after the fact."],
    ["When prices rise because too much money is chasing too few goods, the economy is experiencing", ["inflation", "federalism", "judicial review", "migration"], "inflation", "Inflation is the general rise in prices."],
    ["A peaceful protest in support of a policy change is an example of", ["civic participation", "market failure", "plate movement", "chemical change"], "civic participation", "Peaceful civic action is a way citizens participate in public life."],
    ["What is a common purpose of checks and balances?", ["to keep one branch from becoming too powerful", "to raise wages automatically", "to control weather patterns", "to set map scales"], "to keep one branch from becoming too powerful", "Checks and balances help prevent concentrated power."],
    ["A map scale helps a reader", ["connect map distance to real distance", "identify chemical formulas", "predict election winners", "amend the Constitution"], "connect map distance to real distance", "Scale tells how map measurements relate to actual distance."],
    ["A rise in worker productivity often means", ["more output can be produced in the same amount of time", "every price must fall", "elections are canceled", "the money supply vanishes"], "more output can be produced in the same amount of time", "Productivity is about output relative to time or resources."],
    ["The expansion of voting rights over time is best understood as a theme of", ["broader political participation", "erosion", "market scarcity", "cell growth"], "broader political participation", "Expanding the vote reflects wider participation in government."],
    ["Serving on a jury is important because it supports", ["the justice system", "currency exchange", "weather forecasting", "foreign trade only"], "the justice system", "Jury service is one way citizens help the justice system operate."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Civics Reasoning",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "social studies", "government"]
    });
  });

  [
    ["A chart shows attendance at night classes rose from 40 to 55 to 70 over three months. What pattern does the chart show?", ["steady growth", "steady decline", "no change", "random fluctuation only"], "steady growth", "Each month is higher than the month before."],
    ["A table shows utility costs: January $82, February $76, March $69. What is the overall trend?", ["costs are decreasing", "costs are increasing", "costs stay the same", "the data are incomplete"], "costs are decreasing", "Each month's cost is lower than the last."],
    ["A graph compares two training programs and Program A finishes higher in completion rate. What can be concluded?", ["Program A had the higher completion rate in the graph.", "Program A is always best in every setting.", "Program B had no students.", "Graphs cannot be compared."], "Program A had the higher completion rate in the graph.", "The graph supports only the comparison shown."],
    ["A budget table shows rent $900, food $320, transportation $110. Which expense is second largest?", ["rent", "food", "transportation", "they are all equal"], "food", "Food at 320 is lower than rent but higher than transportation."],
    ["A weather graph shows rainfall at 1 inch, 3 inches, 2 inches, and 4 inches across four weeks. Which week had the most rain?", ["week 1", "week 2", "week 3", "week 4"], "week 4", "Four inches is the greatest amount listed."],
    ["A survey chart shows 52 percent chose option A, 28 percent chose option B, and 20 percent chose option C. Which option was least popular?", ["option A", "option B", "option C", "cannot tell"], "option C", "Twenty percent is the smallest share."],
    ["A line graph of savings rises more steeply in month 4 than in month 3. What does that usually mean?", ["Savings increased faster in month 4.", "Savings stopped completely.", "Savings turned into debt.", "The graph changed subjects."], "Savings increased faster in month 4.", "A steeper upward slope means faster increase."],
    ["A table shows science scores of 61, 67, 71, and 78 on four attempts. What does the pattern suggest?", ["improvement over time", "decline over time", "no relationship", "the test became shorter"], "improvement over time", "Each score is higher than the one before it."],
    ["A bar chart shows one category far taller than the others. What does that usually indicate?", ["That category has the highest value.", "That category is missing.", "All categories are equal.", "The chart is broken."], "That category has the highest value.", "Taller bars represent greater values on bar charts."],
    ["A table lists hours studied and quiz scores. Higher study hours match higher scores across the rows. What relationship is suggested?", ["a positive relationship", "a negative relationship", "no visible relationship", "a legal conflict"], "a positive relationship", "As one value rises, the other rises too."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Data Interpretation",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "data", "charts"]
    });
  });

  [
    ["Which sentence best fits a formal report?", ["The results were consistent across all three trial groups.", "The results were pretty great across the groups.", "Things went really well in the trials.", "The trials were kind of all over but okay."], "The results were consistent across all three trial groups.", "Formal reports use precise, neutral language."],
    ["A worker misses two of five scheduled sessions. What fraction of sessions were missed?", ["1/5", "2/5", "3/5", "5/2"], "2/5", "Two out of five sessions were missed."],
    ["Which source would best help verify a current GED account process?", ["the official GED website", "an old classroom poster", "a random social post", "an unrelated opinion blog"], "the official GED website", "Official current procedures should be checked through official sources."],
    ["Why is it helpful to keep copies of landlord messages?", ["They create a record of what was reported and when.", "They make the repair happen automatically.", "They change the law.", "They replace photos in every case."], "They create a record of what was reported and when.", "Written records help reduce confusion and document the timeline."],
    ["A worksite has 3 identical water stations and each holds 24 bottles. How many bottles can the site hold at once?", ["48", "60", "72", "84"], "72", "Multiply 3 by 24 to get 72 bottles."],
    ["If an essay uses evidence from Passage A but ignores Passage B, what is the biggest weakness?", ["It does not fully address the task.", "It uses too much organization.", "It includes a claim.", "It becomes a science experiment."], "It does not fully address the task.", "GED extended response tasks expect evidence from both passages."],
    ["A learner's scores go from 52 percent to 64 percent to 71 percent. What does this suggest?", ["consistent improvement", "steady decline", "no pattern", "random guessing only"], "consistent improvement", "Each score is higher than the previous one."],
    ["Which phrase best describes a question bank with clear skills, levels, and tags?", ["well organized", "impossible to use", "purely decorative", "timelessly random"], "well organized", "Clear structure makes practice easier to filter, track, and review."],
    ["A city council meeting agenda lists public comment first, then a budget vote. What should a resident expect?", ["A chance to speak before the vote.", "The vote will happen first.", "No one can attend.", "The agenda has no order."], "A chance to speak before the vote.", "Agendas usually show the planned order of events."],
    ["If a study plan schedules a review day each week, the main benefit is that it", ["helps consolidate learning and revisit mistakes", "removes the need for practice", "guarantees a passing score", "shortens the GED test"], "helps consolidate learning and revisit mistakes", "Regular review helps turn earlier work into lasting understanding."]
  ].forEach(function (spec, index) {
    addQuestion({
      skill: "Mixed Adult Readiness",
      difficulty: levels[index],
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["mixed", "college readiness", "adult learner"]
    });
  });

  window.GEDData.questions = (window.GEDData.questions || []).concat(questions);
})();
