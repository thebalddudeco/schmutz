window.GEDData = window.GEDData || {};

(function addRlaBank() {
  var questions = [];
  var counter = 1;

  function addQuestion(config) {
    var id = "rla-" + String(counter).padStart(3, "0");
    counter += 1;
    questions.push({
      id: id,
      subject: "rla",
      skill: config.skill,
      difficulty: config.difficulty,
      type: config.type,
      prompt: config.prompt,
      passageId: config.passageId || null,
      choices: config.choices,
      correctAnswer: config.correctAnswer,
      explanation: config.explanation,
      tags: config.tags,
      calculatorAllowed: false
    });
  }

  var newPassages = [
    {
      id: "rla-apprenticeship-profile",
      subject: "rla",
      title: "Profile of an Apprentice Electrician",
      type: "feature",
      text:
        "When Marisol lost her restaurant job during a slow season, she worried that every future plan had stalled. Instead of waiting for the same work to return, she entered a pre-apprenticeship program at the adult learning center. The first weeks were difficult. She had to rebuild algebra skills, arrive on time for safety drills, and learn to read technical diagrams. Six months later, she says the biggest surprise was not the wiring itself but the confidence that came from solving problems step by step. Marisol now works with a crew that installs panels in renovated schools. She still studies at night, because each certification opens the door to better pay. For her, training was not a shortcut. It was a way to turn uncertainty into a path with milestones she could actually measure.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-shift-swap-policy",
      subject: "rla",
      title: "Updated Shift Swap Policy",
      type: "workplace memo",
      text:
        "Beginning next month, employees may still swap shifts, but all swaps must be approved by 3 p.m. on the previous day. Managers say the earlier deadline is necessary because last-minute changes have left some departments short staffed during the morning rush. The new policy also requires both employees involved in the swap to confirm the change in writing through the scheduling app. Staff members who only mention the swap in person will not be listed correctly on the final schedule. The company says the goal is not to limit flexibility, but to make sure customers are served safely and that payroll records match the hours actually worked.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-heat-safety-flyer",
      subject: "rla",
      title: "Heat Safety Flyer",
      type: "public information",
      text:
        "When temperatures rise, waiting until you feel dizzy or sick is already too late. Public health staff recommend drinking water before you feel thirsty, wearing light clothing, and checking on older neighbors during long heat waves. Workers in warehouses, kitchens, and outdoor jobs should take shaded breaks even if they feel fine, because heat stress builds over time. The flyer also reminds residents never to leave children or pets in a parked car, even for a short errand. In strong summer heat, the inside of a vehicle can become dangerous within minutes.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-community-garden-editorial",
      subject: "rla",
      title: "Why the Community Garden Matters",
      type: "editorial",
      text:
        "Some people dismiss the neighborhood garden as a small project with mostly symbolic value. That view misses what the garden actually does. It converts a neglected lot into a place where residents work beside one another, trade practical knowledge, and bring home fresh food. A person who learns how to grow tomatoes may not solve every food-access problem in the city, but that person gains a skill, a routine, and a reason to take pride in the block. The garden should not be judged only by how many pounds of produce it yields. It should also be judged by the way it turns empty land into shared responsibility.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-library-program-news",
      subject: "rla",
      title: "Library Adds Career Support Evenings",
      type: "news brief",
      text:
        "The downtown library will stay open two extra evenings each week this fall so adults can use resume help, computer access, and one-on-one job search coaching. Librarians say the change responds to repeated requests from patrons who cannot visit during standard business hours. The new schedule also includes workshops on interview preparation and online applications. City leaders approved the extended hours after reviewing attendance data from a short pilot program last spring. During that pilot, nearly every available coaching slot filled within two days.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-tenant-rights-guide",
      subject: "rla",
      title: "Guide to Documenting Repair Problems",
      type: "procedural guide",
      text:
        "If an apartment repair problem continues after an initial request, tenants should keep a written record of each step they take. That record can include the date the problem began, photos if appropriate, copies of messages to the landlord, and notes from any in-person conversations. A clear record does not guarantee a quick solution, but it does reduce confusion about what was reported and when. The guide advises tenants to describe the problem precisely. Saying that a sink leaks under the cabinet is more useful than saying the kitchen has an issue.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-bus-shelter-letter",
      subject: "rla",
      title: "Letter Requesting a Bus Shelter",
      type: "persuasive letter",
      text:
        "I am writing to request a covered bus shelter at the stop beside Lincoln Avenue. Riders at this stop include high school students, nursing assistants, and parents with small children. During heavy rain, many passengers wait pressed against the wall of a closed storefront, and some simply miss the bus because they step away to stay dry. A shelter would not solve every transit issue on the route, but it would improve safety and reliability for the people who depend on that stop every day.",
      sourceLine: "Original practice passage"
    },
    {
      id: "rla-online-training-pair",
      subject: "rla",
      title: "Paired Passages on Online Training Reimbursement",
      type: "paired passage",
      text:
        "Passage A: A manufacturing company should reimburse approved online training because the cost is small compared with the value of retaining employees who gain new technical skills. Workers who see a path to advancement are more likely to stay, and the company benefits from stronger in-house talent.\n\nPassage B: Training reimbursement can help some workers, but companies should be cautious about treating every certificate as equally valuable. Without clear standards, a company may spend money on courses that do not improve performance or match actual job needs.",
      sourceLine: "Original practice passage"
    }
  ];

  window.GEDData.passages = (window.GEDData.passages || []).concat(newPassages);

  var passageBlueprints = [
    {
      passageId: "rla-recycling-brief",
      type: "passage-mc",
      items: [
        ["Supporting Details", "foundation", "Which detail best supports the memo's explanation for the evening closures?", ["Residents do not pay recycling fees.", "Unflattened boxes block the walkway.", "Staff members dislike late shifts.", "The room is too small for glass bins."], "Unflattened boxes block the walkway.", "The memo directly says the room closes when unflattened boxes pile up and block safe access.", ["supporting details", "informational text"]],
        ["Author's Purpose", "standard", "What is the author's main purpose in the memo?", ["To entertain residents with a story", "To explain a problem and suggest a practical fix", "To argue that recycling should end", "To compare two apartment buildings"], "To explain a problem and suggest a practical fix", "The memo identifies why the room closes and points residents toward flattening boxes as the solution.", ["author's purpose", "memo"]],
        ["Tone", "standard", "Which word best describes the tone of the memo?", ["Sarcastic", "Formal and solution-focused", "Angry", "Uncertain"], "Formal and solution-focused", "The memo stays calm, explains the issue, and focuses on a specific remedy rather than blame.", ["tone", "workplace language"]],
        ["Vocabulary in Context", "stretch", "In the memo, the word prepare most nearly means", ["decorate", "get ready properly", "hide", "transport quickly"], "get ready properly", "Residents are being told to prepare materials by flattening boxes before leaving them in the room.", ["vocabulary in context", "word meaning"]]
      ]
    },
    {
      passageId: "rla-transit-editorial",
      type: "passage-mc",
      items: [
        ["Claims and Evidence", "foundation", "Which claim does the editorial make?", ["Every bus route should operate all night.", "Late-night transit affects workers who leave after midnight.", "Transit matters only to restaurant workers.", "Most workers can afford ride services."], "Late-night transit affects workers who leave after midnight.", "The author specifically argues that workers on late shifts face barriers when service ends too early.", ["claims and evidence", "argument"]],
        ["Supporting Details", "standard", "Which detail does the author use to support the argument?", ["The city plans to buy new buses.", "Workers may have to pay for rides they can barely afford.", "The editorial board prefers trains.", "Bus drivers want shorter routes."], "Workers may have to pay for rides they can barely afford.", "That detail shows a concrete consequence of limited late-night service and supports the writer's argument.", ["supporting details", "evidence"]],
        ["Tone", "standard", "The tone of the editorial is best described as", ["detached", "urgent and practical", "playful", "confused"], "urgent and practical", "The writer sounds concerned about real consequences while still proposing a limited, workable response.", ["tone", "argument"]],
        ["Author's Purpose", "stretch", "Why does the author mention hospital aides, restaurant workers, and warehouse staff?", ["To criticize those jobs", "To provide concrete examples of people affected by the issue", "To show that only three industries matter", "To compare wages across professions"], "To provide concrete examples of people affected by the issue", "Listing job types makes the argument more specific by showing who is harmed by the early service cutoff.", ["author's purpose", "examples"]]
      ]
    },
    {
      passageId: "rla-apprenticeship-profile",
      type: "passage-mc",
      items: [
        ["Main Idea", "foundation", "What is the central idea of the profile?", ["Training gave Marisol a measurable path forward after job loss.", "Restaurant work is easier than electrical work.", "Pre-apprenticeship programs should be shorter.", "School renovation projects pay too little."], "Training gave Marisol a measurable path forward after job loss.", "The passage focuses on how the program helped Marisol move from uncertainty to a clear career path.", ["main idea", "career training"]],
        ["Inference", "standard", "What can the reader reasonably infer about Marisol?", ["She expected the training to be easy.", "She values progress she can track.", "She plans to leave the field soon.", "She dislikes studying at night."], "She values progress she can track.", "The passage ends by saying training gave her milestones she could measure, showing that steady progress matters to her.", ["inference", "biographical profile"]],
        ["Vocabulary in Context", "standard", "In the final sentence, milestones most nearly means", ["temporary delays", "important progress markers", "physical tools", "unexpected setbacks"], "important progress markers", "The passage uses milestones to describe steps that show how far Marisol has advanced.", ["vocabulary in context", "context clues"]],
        ["Tone", "stretch", "Which phrase best describes the tone of the profile?", ["quietly encouraging", "mocking and dismissive", "strictly technical", "fearful and uncertain"], "quietly encouraging", "The piece acknowledges difficulty but presents Marisol's progress in a steady, respectful way.", ["tone", "feature writing"]]
      ]
    },
    {
      passageId: "rla-shift-swap-policy",
      type: "passage-mc",
      items: [
        ["Main Idea", "foundation", "What is the main point of the memo?", ["Shift swaps are no longer allowed.", "Shift swaps require earlier approval and written confirmation.", "Managers want employees to work more weekends.", "The scheduling app is being replaced."], "Shift swaps require earlier approval and written confirmation.", "The memo explains the new deadline and the need for written confirmation in the app.", ["main idea", "workplace memo"]],
        ["Supporting Details", "standard", "Why did managers change the policy?", ["Payroll software stopped working.", "Late changes left some departments short staffed.", "Employees refused to swap shifts.", "Customers requested more weekend hours."], "Late changes left some departments short staffed.", "The memo directly says last-minute changes created staffing problems during the morning rush.", ["supporting details", "policy memo"]],
        ["Author's Purpose", "standard", "Why does the memo mention payroll records?", ["To explain one practical reason for written confirmation", "To show that employees are underpaid", "To argue against flexible scheduling", "To compare two payroll vendors"], "To explain one practical reason for written confirmation", "The memo uses payroll as evidence that accurate written records matter beyond scheduling convenience.", ["author's purpose", "supporting reason"]],
        ["Tone", "stretch", "Which word best describes the memo's tone?", ["accusatory", "procedural", "celebratory", "casual"], "procedural", "The memo focuses on rules, deadlines, and process rather than emotion or storytelling.", ["tone", "procedure"]]
      ]
    },
    {
      passageId: "rla-heat-safety-flyer",
      type: "passage-mc",
      items: [
        ["Main Idea", "foundation", "What is the central message of the flyer?", ["Heat risk should be taken seriously before symptoms appear.", "Only outdoor workers need to think about heat.", "Cars are safe if parked in the shade.", "Water is useful only after someone feels sick."], "Heat risk should be taken seriously before symptoms appear.", "The flyer urges preventive action before serious symptoms begin.", ["main idea", "public health"]],
        ["Supporting Details", "standard", "Which detail most strongly supports the claim that heat danger can build gradually?", ["Workers should take shaded breaks even if they feel fine.", "Summer heat is common in many places.", "Neighbors may enjoy talking outside.", "The flyer uses bold print."], "Workers should take shaded breaks even if they feel fine.", "That detail directly explains that heat stress increases over time, even before a person notices symptoms.", ["supporting details", "evidence"]],
        ["Author's Purpose", "standard", "Why does the flyer mention children and pets in parked cars?", ["To add a vivid warning about how quickly conditions can become dangerous", "To suggest that driving should be avoided in summer", "To compare car models", "To show that most residents own pets"], "To add a vivid warning about how quickly conditions can become dangerous", "The example gives readers a concrete and urgent picture of heat danger.", ["author's purpose", "warning"]],
        ["Tone", "stretch", "The flyer uses a tone that is best described as", ["playful", "urgent but instructive", "sarcastic", "uncertain"], "urgent but instructive", "It sounds serious about the risk while also giving practical steps readers can follow.", ["tone", "public information"]]
      ]
    },
    {
      passageId: "rla-community-garden-editorial",
      type: "passage-mc",
      items: [
        ["Claims and Evidence", "foundation", "What claim does the editorial make about the garden?", ["It should be replaced with parking.", "Its value should include community impact, not only food yield.", "It produces enough food to solve city hunger.", "It should be run only by experts."], "Its value should include community impact, not only food yield.", "The author argues that the garden should be judged by shared responsibility and neighborhood value as well as produce.", ["claims and evidence", "editorial"]],
        ["Inference", "standard", "What does the author most likely believe about small neighborhood projects?", ["They rarely matter.", "They can create practical and social benefits at the same time.", "They are useful only if they make money.", "They work better without community involvement."], "They can create practical and social benefits at the same time.", "The editorial points to fresh food, shared work, and neighborhood pride as connected outcomes.", ["inference", "argument"]],
        ["Tone", "standard", "Which word best describes the author's tone?", ["dismissive", "defensive but hopeful", "humorous", "indifferent"], "defensive but hopeful", "The author pushes back against criticism while presenting the garden as a positive force.", ["tone", "editorial"]],
        ["Author's Purpose", "stretch", "Why does the author mention a person learning to grow tomatoes?", ["To provide a concrete example of how the garden builds skill and pride", "To shift the topic away from the garden", "To show that vegetables are expensive", "To criticize city food stores"], "To provide a concrete example of how the garden builds skill and pride", "The specific example helps the author make an abstract idea about community value feel practical and real.", ["author's purpose", "specific example"]]
      ]
    },
    {
      passageId: "rla-library-program-news",
      type: "passage-mc",
      items: [
        ["Main Idea", "foundation", "What is the main point of the news brief?", ["The library is expanding evening access because adults requested career support after work hours.", "The city plans to close neighborhood branches.", "The library is replacing librarians with coaches.", "Attendance fell during the pilot program."], "The library is expanding evening access because adults requested career support after work hours.", "The brief focuses on the new evening hours and the reason the city approved them.", ["main idea", "news brief"]],
        ["Supporting Details", "standard", "Which detail best supports the idea that demand for the program is strong?", ["The library is downtown.", "Nearly every coaching slot filled within two days during the pilot.", "Workshops will include online applications.", "The city leaders reviewed data."], "Nearly every coaching slot filled within two days during the pilot.", "That detail gives direct evidence that people used the service quickly when it was offered.", ["supporting details", "evidence"]],
        ["Author's Purpose", "standard", "Why does the brief mention the pilot program?", ["To explain the evidence behind the decision", "To criticize city leaders", "To entertain readers with a side story", "To show that the library used to close earlier than other buildings"], "To explain the evidence behind the decision", "The pilot results help justify the choice to extend hours.", ["author's purpose", "evidence"]],
        ["Vocabulary in Context", "stretch", "In the brief, approved most nearly means", ["officially accepted", "casually discussed", "partly ignored", "secretly delayed"], "officially accepted", "City leaders approved the extended hours, meaning they gave formal permission.", ["vocabulary in context", "news language"]]
      ]
    },
    {
      passageId: "rla-tenant-rights-guide",
      type: "passage-mc",
      items: [
        ["Main Idea", "foundation", "What is the main point of the guide?", ["Tenants should keep a clear written record when repair problems continue.", "Tenants should avoid contacting landlords.", "All repair problems require a lawyer.", "Photos are always more important than written notes."], "Tenants should keep a clear written record when repair problems continue.", "The guide stresses documenting dates, messages, and details so the problem history is clear.", ["main idea", "procedural text"]],
        ["Supporting Details", "standard", "Which example best reflects the guide's advice about being precise?", ["The apartment has an issue.", "The sink leaks under the cabinet.", "Things keep going wrong.", "The place needs help."], "The sink leaks under the cabinet.", "The guide specifically contrasts a vague statement with this more precise description.", ["supporting details", "precision"]],
        ["Author's Purpose", "standard", "Why does the guide list photos, message copies, and conversation notes?", ["To show what a useful record can include", "To prove landlords are always wrong", "To discourage tenants from speaking in person", "To suggest tenants should move out immediately"], "To show what a useful record can include", "The list gives readers practical examples of documentation they can keep.", ["author's purpose", "procedural support"]],
        ["Tone", "stretch", "The tone of the guide is best described as", ["instructional", "sarcastic", "celebratory", "hostile"], "instructional", "The guide explains practical steps in a calm, advice-focused way.", ["tone", "procedure"]]
      ]
    },
    {
      passageId: "rla-bus-shelter-letter",
      type: "passage-mc",
      items: [
        ["Claims and Evidence", "foundation", "What is the writer asking for?", ["A covered bus shelter at Lincoln Avenue", "A new bus route to replace the old one", "A lower transit fare for children", "A storefront reopening near the stop"], "A covered bus shelter at Lincoln Avenue", "The first sentence states the request directly.", ["claims and evidence", "persuasive writing"]],
        ["Supporting Details", "standard", "Which detail best supports the need for the shelter?", ["The stop is beside Lincoln Avenue.", "Passengers crowd against a closed storefront during rain.", "Some riders are high school students.", "The route has several stops."], "Passengers crowd against a closed storefront during rain.", "That detail shows a direct problem the shelter would solve.", ["supporting details", "persuasive evidence"]],
        ["Tone", "standard", "Which phrase best describes the tone of the letter?", ["respectful and practical", "bitter and mocking", "unclear and hesitant", "playful and casual"], "respectful and practical", "The writer makes a specific request and supports it with concrete, respectful reasons.", ["tone", "letter writing"]],
        ["Author's Purpose", "stretch", "Why does the writer list several kinds of riders?", ["To show that the problem affects a broad part of the community", "To argue that only certain people deserve service", "To compare school schedules", "To criticize parents who use transit"], "To show that the problem affects a broad part of the community", "Listing multiple rider groups broadens the issue beyond one person's inconvenience.", ["author's purpose", "persuasive strategy"]]
      ]
    },
    {
      passageId: "rla-online-training-pair",
      type: "paired-passage",
      items: [
        ["Argument Comparison", "foundation", "Which statement best describes a key difference between Passage A and Passage B?", ["Passage A supports reimbursement, while Passage B argues for stricter limits.", "Passage A opposes training, while Passage B supports it fully.", "Both passages argue the same point in the same way.", "Both passages focus only on employee happiness."], "Passage A supports reimbursement, while Passage B argues for stricter limits.", "Passage A favors reimbursement as a retention tool, while Passage B warns that reimbursement should follow clear standards.", ["argument comparison", "paired passage"]],
        ["Claims and Evidence", "standard", "Which piece of evidence is used in Passage A?", ["Certificates rarely match job needs.", "Workers who see advancement opportunities are more likely to stay.", "Reimbursement always lowers company costs immediately.", "Managers should never approve online courses."], "Workers who see advancement opportunities are more likely to stay.", "Passage A argues that reimbursement can improve retention because employees stay when they see a path forward.", ["claims and evidence", "paired passage"]],
        ["Inference", "standard", "What concern can the reader infer from Passage B?", ["Companies may waste money on courses that do not help the job.", "Training should be banned.", "Employees dislike online learning.", "All certificates are meaningless."], "Companies may waste money on courses that do not help the job.", "Passage B warns against paying for courses that do not match actual work needs.", ["inference", "paired passage"]],
        ["Author's Purpose", "stretch", "Why does Passage B mention clear standards?", ["To argue that reimbursement should be guided by job relevance", "To praise every certificate equally", "To shift the topic to employee dress codes", "To compare online schools by price"], "To argue that reimbursement should be guided by job relevance", "The writer wants reimbursement decisions tied to courses that genuinely improve performance or meet job demands.", ["author's purpose", "paired passage"]]
      ]
    }
  ];

  passageBlueprints.forEach(function (blueprint) {
    blueprint.items.forEach(function (item) {
      addQuestion({
        skill: item[0],
        difficulty: item[1],
        type: blueprint.type,
        prompt: item[2],
        passageId: blueprint.passageId,
        choices: item[3],
        correctAnswer: item[4],
        explanation: item[5],
        tags: item[6]
      });
    });
  });

  var grammarSpecs = [
    ["Which sentence is written correctly?", ["The clinic opens at 8:00 a.m. and patients should arrive 15 minutes early.", "The clinic opens at 8:00 a.m., and patients should arrive 15 minutes early.", "The clinic opens at 8:00 a.m., and, patients should arrive 15 minutes early.", "The clinic opens at 8:00 a.m. and, patients should arrive 15 minutes early."], "The clinic opens at 8:00 a.m., and patients should arrive 15 minutes early.", "Use a comma before and when it joins two complete sentences."],
    ["Choose the best revision.", ["Jordan brought his transcript to the advisor because he wanted clearer guidance.", "Jordan brought his transcript, because he wanted clearer guidance.", "Jordan brought his transcript because, he wanted clearer guidance to the advisor.", "Because Jordan brought his transcript to the advisor clearer guidance."], "Jordan brought his transcript to the advisor because he wanted clearer guidance.", "The correct sentence keeps the cause-and-effect relationship clear without unnecessary punctuation."],
    ["Which sentence avoids a fragment?", ["After the final practice test.", "After the final practice test, the instructor reviewed the hardest questions.", "Reviewed the hardest questions after the final practice test.", "Because the final practice test was difficult."], "After the final practice test, the instructor reviewed the hardest questions.", "A complete sentence needs a full idea with a subject and verb."],
    ["Which sentence uses pronouns clearly?", ["The supervisor met with Ana after the interview, and Ana received the schedule update.", "The supervisor met with Ana after the interview, and she received the schedule update.", "The supervisor met with Ana after she interviewed, and she received it.", "After the interview, she met with her and received the schedule update."], "The supervisor met with Ana after the interview, and Ana received the schedule update.", "Repeating Ana avoids confusion about who received the update."],
    ["Which sentence shows correct verb tense?", ["Last week the class completes two math units and reviewed fractions.", "Last week the class completed two math units and reviewed fractions.", "Last week the class will complete two math units and reviewed fractions.", "Last week the class has completed two math units and review fractions."], "Last week the class completed two math units and reviewed fractions.", "Both verbs should match the past-time signal last week."],
    ["Which sentence is punctuated correctly?", ["Please bring a pencil, your calculator and a photo ID.", "Please bring a pencil, your calculator, and a photo ID.", "Please bring a pencil your calculator, and a photo ID.", "Please bring a pencil; your calculator, and a photo ID."], "Please bring a pencil, your calculator, and a photo ID.", "The series is clearest with commas separating each item."],
    ["Which sentence uses the apostrophe correctly?", ["The workers schedules were posted by the break room door.", "The workers' schedules were posted by the break room door.", "The worker's schedules were posted by the break room door.", "The workers schedule's were posted by the break room door."], "The workers' schedules were posted by the break room door.", "The schedules belong to multiple workers, so the apostrophe comes after the plural word."],
    ["Choose the sentence with correct subject-verb agreement.", ["One of the practice sets are especially helpful for graph reading.", "One of the practice sets is especially helpful for graph reading.", "One of the practice sets were especially helpful for graph reading.", "One of the practice sets be especially helpful for graph reading."], "One of the practice sets is especially helpful for graph reading.", "The subject is one, so the singular verb is fits."],
    ["Which sentence is the clearest?", ["Before the evening class began the policy was by the instructor explained.", "The instructor explained the policy before the evening class began.", "Explained by the instructor before class began the policy.", "The policy before class began, which the instructor explained."], "The instructor explained the policy before the evening class began.", "The best sentence is direct and keeps the subject near the verb."],
    ["Which sentence correctly joins the ideas?", ["The printer jammed, so the office delayed the mailing.", "The printer jammed, the office delayed the mailing.", "The printer jammed so, the office delayed the mailing.", "The printer jammed; so the office delayed the mailing."], "The printer jammed, so the office delayed the mailing.", "A comma before so is correct when it joins two complete sentences."],
    ["Which sentence uses capitalization correctly?", ["Jordan plans to visit helena Community College in July.", "Jordan plans to visit Helena Community College in July.", "jordan plans to visit Helena community college in July.", "Jordan plans to visit Helena community College in july."], "Jordan plans to visit Helena Community College in July.", "Proper names such as Helena Community College and July should be capitalized."],
    ["Choose the correct sentence.", ["The study group meet on Tuesdays and Thursdays after work.", "The study group meets on Tuesdays and Thursdays after work.", "The study group meeting on Tuesdays and Thursdays after work.", "The study group have met on Tuesdays and Thursdays after work."], "The study group meets on Tuesdays and Thursdays after work.", "The singular subject group takes the singular verb meets."],
    ["Which sentence uses commas correctly?", ["If the weather clears the crew will finish the roof by noon.", "If the weather clears, the crew will finish the roof by noon.", "If the weather, clears the crew will finish the roof by noon.", "If the weather clears the crew, will finish the roof by noon."], "If the weather clears, the crew will finish the roof by noon.", "An introductory dependent clause is followed by a comma."],
    ["Which sentence avoids a run-on?", ["The bus was late, but the testing center still admitted everyone on time.", "The bus was late the testing center still admitted everyone on time.", "The bus was late but, the testing center still admitted everyone on time.", "The bus was late; but the testing center still admitted everyone on time."], "The bus was late, but the testing center still admitted everyone on time.", "Two complete ideas need correct punctuation and a conjunction."],
    ["Choose the sentence with correct word choice.", ["The advisor gave practical advise about scheduling classes.", "The advisor gave practical advice about scheduling classes.", "The advisor gave practical advise on scheduling classes.", "The advisor gave practical advice on scheduling classes."], "The advisor gave practical advice about scheduling classes.", "Advice is the noun needed after gave."],
    ["Which sentence uses a semicolon correctly?", ["The first session covers algebra; the second focuses on geometry.", "The first session covers algebra, the second focuses on geometry.", "The first session covers algebra; and the second focuses on geometry.", "The first session covers algebra the second; focuses on geometry."], "The first session covers algebra; the second focuses on geometry.", "A semicolon can join two closely related complete sentences."],
    ["Which sentence is free of unnecessary words?", ["The class starts promptly at 6 p.m.", "The class starts promptly at exactly 6 p.m.", "The class starts promptly at 6 p.m. in the evening.", "The class starts at 6 p.m. promptly on time."], "The class starts promptly at 6 p.m.", "The best sentence says the same thing without extra repetition."],
    ["Choose the sentence with correct comparison.", ["This practice set is more challenging than the last one.", "This practice set is more challenging then the last one.", "This practice set is most challenging than the last one.", "This practice set is more challenge than the last one."], "This practice set is more challenging than the last one.", "Than is used for comparison."],
    ["Which sentence uses the colon correctly?", ["Bring three items to orientation a notebook, a pencil, and your ID.", "Bring three items to orientation: a notebook, a pencil, and your ID.", "Bring three items to orientation; a notebook, a pencil, and your ID.", "Bring: three items to orientation, a notebook, a pencil, and your ID."], "Bring three items to orientation: a notebook, a pencil, and your ID.", "A colon can introduce a list after a complete lead-in clause."],
    ["Which sentence keeps the modifier clear?", ["After studying for two hours, Jordan felt more confident about algebra.", "After studying for two hours, algebra felt more confident to Jordan.", "After Jordan studied algebra for two hours, confidence increased it.", "After studying for two hours, the algebra workbook made Jordan confident."], "After studying for two hours, Jordan felt more confident about algebra.", "The correct sentence clearly shows that Jordan did the studying."],
    ["Choose the sentence with correct verb form.", ["The forms was signed before the appointment began.", "The forms were signed before the appointment began.", "The forms had signed before the appointment began.", "The forms signing before the appointment began."], "The forms were signed before the appointment began.", "Forms is plural, so were signed is the correct verb phrase."],
    ["Which sentence is punctuated correctly?", ["Because the weather changed quickly the event moved indoors.", "Because the weather changed quickly, the event moved indoors.", "Because the weather changed, quickly the event moved indoors.", "Because the weather changed quickly; the event moved indoors."], "Because the weather changed quickly, the event moved indoors.", "The introductory clause should be followed by a comma."],
    ["Which sentence uses parallel structure correctly?", ["The workshop teaches budgeting, note-taking, and test planning.", "The workshop teaches budgeting, taking notes, and how to plan tests.", "The workshop teaches to budget, note-taking, and planned tests.", "The workshop teaches budgeting, notes, and to plan tests."], "The workshop teaches budgeting, note-taking, and test planning.", "The list is strongest when all items use the same grammatical pattern."],
    ["Which sentence avoids vague wording?", ["The supervisor sent the corrected schedule to the evening team.", "The supervisor sent the thing to the people later.", "It was sent by the supervisor to them.", "The supervisor sent something to the team about it."], "The supervisor sent the corrected schedule to the evening team.", "Specific nouns make the sentence clearer and more useful."],
    ["Choose the sentence with correct possessive form.", ["The drivers logbook was left on the front seat.", "The driver's logbook was left on the front seat.", "The drivers' logbook was left on the front seat.", "The driver's' logbook was left on the front seat."], "The driver's logbook was left on the front seat.", "One driver owns the logbook, so the apostrophe belongs before the s."],
    ["Which sentence is complete?", ["Although the workshop ended late.", "Although the workshop ended late, everyone stayed for the final questions.", "Because everyone stayed for the final questions.", "When the workshop ended late and questions."], "Although the workshop ended late, everyone stayed for the final questions.", "A complete sentence includes both the dependent idea and the main idea."],
    ["Which sentence uses punctuation correctly?", ["The team packed flash drives calculators and scratch paper for testing day.", "The team packed flash drives, calculators, and scratch paper for testing day.", "The team packed flash drives, calculators and, scratch paper for testing day.", "The team packed flash drives; calculators, and scratch paper for testing day."], "The team packed flash drives, calculators, and scratch paper for testing day.", "The commas separate the items in the series clearly."],
    ["Choose the best sentence.", ["The coach's feedback was direct, but it helped Jordan improve quickly.", "The coach's feedback was direct but it helped Jordan improve quickly.", "The coachs feedback was direct, but it helped Jordan improve quickly.", "The coach's feedback direct, but it helped Jordan improve quickly."], "The coach's feedback was direct, but it helped Jordan improve quickly.", "The best version uses the apostrophe correctly and punctuates the compound sentence."],
    ["Which sentence uses tense consistently?", ["Jordan reviewed notes, completed the quiz, and then checked his answers.", "Jordan reviews notes, completed the quiz, and then checks his answers.", "Jordan reviewed notes, completes the quiz, and then checked his answers.", "Jordan reviewing notes, completed the quiz, and then checked his answers."], "Jordan reviewed notes, completed the quiz, and then checked his answers.", "The sequence stays in the past tense from start to finish."],
    ["Which sentence is most precise?", ["The instructor posted the revised room number on the classroom door.", "The instructor posted the thing on the door.", "The instructor posted something revised on the door there.", "The revised thing was posted on the door by the instructor."], "The instructor posted the revised room number on the classroom door.", "The precise sentence tells the reader exactly what was posted and where."]
  ];

  grammarSpecs.forEach(function (spec, index) {
    addQuestion({
      skill: index % 3 === 0 ? "Grammar" : index % 3 === 1 ? "Punctuation" : "Sentence Structure",
      difficulty: index < 10 ? "foundation" : index < 22 ? "standard" : "stretch",
      type: "grammar",
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["grammar", "editing", "sentence control"]
    });
  });

  var revisionSpecs = [
    ["A workplace email begins, \"I need those forms soon.\" Which revision creates a more professional tone?", ["Please send the completed forms by Thursday if possible.", "Send the forms now.", "I need those forms soon.", "Why are the forms not here yet?"], "Please send the completed forms by Thursday if possible.", "The best revision is specific, respectful, and professional."],
    ["A paragraph about a training program says, \"It helps people. It has classes. It is good.\" Which revision is strongest?", ["The program helps adults build job skills through evening classes and targeted support.", "It helps people because it is good.", "The program has classes and things.", "People like it, and it is nice."], "The program helps adults build job skills through evening classes and targeted support.", "The revision replaces vague wording with specific benefits."],
    ["Which transition best connects these ideas? \"Jordan improved his attendance. ___ his practice scores rose steadily.\"", ["As a result,", "For example,", "On the other hand,", "At first,"], "As a result,", "The second sentence shows an outcome of the first, so a cause-and-effect transition fits best."],
    ["A report says, \"The meeting was long. People were tired.\" Which revision combines the ideas most effectively?", ["Because the meeting ran long, participants grew tired.", "The meeting was long, people were tired.", "The meeting was long and tired people.", "People were tired. The meeting was long."], "Because the meeting ran long, participants grew tired.", "The best revision combines the ideas with clear cause and effect."],
    ["Which sentence would best support a claim that evening classes help working adults?", ["Most attendees said the later schedule fit around their jobs.", "The building has bright hallway lights.", "The teacher used a projector.", "Students carried notebooks."], "Most attendees said the later schedule fit around their jobs.", "The strongest support directly connects evening classes to working adults' schedules."],
    ["Which revision removes redundancy?", ["Jordan planned carefully before the exam.", "Jordan planned carefully in advance before the exam.", "Jordan planned carefully ahead before the exam.", "Jordan planned very carefully and carefully before the exam."], "Jordan planned carefully before the exam.", "Before already includes the idea of in advance, so the shorter version is stronger."],
    ["Which topic sentence best introduces a paragraph about transportation barriers?", ["Reliable transportation can determine whether a worker can keep a job.", "Buses are large vehicles.", "Many streets have traffic lights.", "People sometimes ride with friends."], "Reliable transportation can determine whether a worker can keep a job.", "The strongest topic sentence previews the paragraph's main idea clearly."],
    ["A paragraph lists three reasons to use a study planner. Which concluding sentence is best?", ["For those reasons, a planner can turn scattered effort into steady progress.", "That is all about planners.", "Planners are made of paper sometimes.", "I have finished discussing this topic now."], "For those reasons, a planner can turn scattered effort into steady progress.", "A strong conclusion ties the reasons back to the main point."],
    ["Which revision improves clarity?", ["The advisor reviewed the essay and explained exactly how the evidence could be stronger.", "The advisor reviewed it and explained things better.", "The advisor did reviewing, and evidence was stronger by explanation.", "It was reviewed by the advisor with stronger evidence."], "The advisor reviewed the essay and explained exactly how the evidence could be stronger.", "Specific nouns and direct wording make the sentence clearer."],
    ["Which transition best begins a sentence that introduces a contrasting view?", ["However,", "Similarly,", "As a result,", "For instance,"], "However,", "However signals a contrast with the previous idea."],
    ["A sentence reads, \"The workshop was helpful because it gave advice and helped people and was useful.\" Which revision is strongest?", ["The workshop was helpful because it offered practical advice people could use right away.", "The workshop was helpful and useful because it helped people.", "The workshop was useful because it was helpful.", "The workshop helped because it helped."], "The workshop was helpful because it offered practical advice people could use right away.", "The best revision replaces repetition with one clear, specific reason."],
    ["Which detail best develops a paragraph about job-search support at the library?", ["During the pilot, every resume review appointment was booked within two days.", "The building is made of brick.", "The front desk has a new chair.", "The library owns many novels."], "During the pilot, every resume review appointment was booked within two days.", "A concrete data point shows real demand for the service."],
    ["Which sentence is the best revision of a weak claim? \"The new schedule is better.\"", ["The new schedule is better because it gives working adults time to attend after their shifts end.", "The new schedule is better because it is nicer.", "The new schedule is very, very better.", "The schedule is good in many ways maybe."], "The new schedule is better because it gives working adults time to attend after their shifts end.", "A strong claim includes a clear reason, not just an opinion."],
    ["Which revision improves tone in a complaint letter?", ["I would appreciate a response by Friday so the repair can be scheduled promptly.", "You need to fix this immediately or else.", "This problem is ridiculous and unacceptable.", "I am furious about this issue."], "I would appreciate a response by Friday so the repair can be scheduled promptly.", "The best revision is firm, respectful, and specific."],
    ["Which sentence best combines the ideas? \"The class met twice a week. Attendance improved.\" ", ["After the class began meeting twice a week, attendance improved.", "The class met twice a week, attendance improved.", "The class met twice a week and attendance, improved.", "Attendance improved twice a week the class met."], "After the class began meeting twice a week, attendance improved.", "The revised sentence clearly shows the relationship between the ideas."],
    ["Which transition best shows an example?", ["For example,", "Meanwhile,", "Therefore,", "In contrast,"], "For example,", "For example introduces a specific illustration of the point."],
    ["Which revision gives the most precise evidence?", ["Of the 32 students in the pilot, 27 completed all assigned practice sets.", "Many students did very well.", "The pilot seemed good to people.", "Students improved a lot somehow."], "Of the 32 students in the pilot, 27 completed all assigned practice sets.", "Precise numbers make evidence stronger and more credible."],
    ["Which sentence is the best opening for a paragraph arguing for a bus shelter?", ["A covered shelter would make the Lincoln Avenue stop safer and more reliable for daily riders.", "Buses stop in many places.", "People often ride buses in the rain.", "Transit has routes and schedules."], "A covered shelter would make the Lincoln Avenue stop safer and more reliable for daily riders.", "The opening sentence should make the paragraph's argument clear."],
    ["A draft says, \"Marisol worked hard. She studied a lot. She got a better job.\" Which revision is strongest?", ["By studying consistently and completing her certification steps, Marisol moved into better-paying work.", "Marisol worked hard and she studied and things improved.", "Marisol studied a lot, and then there was a better job.", "Marisol got a better job because she was hardworking maybe."], "By studying consistently and completing her certification steps, Marisol moved into better-paying work.", "The strongest revision combines the ideas into one clear, specific statement."],
    ["Which detail does not belong in a paragraph about keeping repair records?", ["The tenant saved copies of text messages to the landlord.", "The tenant wrote down when the leak first appeared.", "The tenant noted each conversation date.", "The tenant's favorite movie is a comedy."], "The tenant's favorite movie is a comedy.", "That detail does not relate to documenting repair problems."],
    ["Which revision makes the sentence more concise?", ["The committee approved the proposal after a short review.", "The committee approved the proposal after a review that was short in length.", "The proposal was approved by the committee after it reviewed it briefly for a short time.", "After reviewing shortly, the committee approved proposal it."], "The committee approved the proposal after a short review.", "The best revision removes unnecessary wording without losing meaning."],
    ["Which transition best shows sequence?", ["Next,", "In contrast,", "Similarly,", "As a result,"], "Next,", "Next signals the next step in a process."],
    ["Which sentence best supports a paragraph about why documentation matters?", ["A clear record reduces disputes about when the problem was reported.", "Paper is made from trees.", "Many people dislike paperwork.", "Some apartments have white walls."], "A clear record reduces disputes about when the problem was reported.", "The support directly explains the benefit of documentation."],
    ["Which revision improves organization?", ["First, gather the required documents. Next, complete the form. Finally, confirm the appointment time.", "Gather the required documents, the appointment time should be confirmed finally, and complete the form next.", "The form should be completed, first and finally gather documents next.", "Documents, form, and time should be done in some order."], "First, gather the required documents. Next, complete the form. Finally, confirm the appointment time.", "The revised version presents the steps in a logical order."],
    ["Which sentence uses the strongest evidence-based language?", ["Survey responses showed that 81 percent of participants preferred evening workshops.", "A lot of people liked the evening workshops.", "It seems like the evening workshops were more popular.", "Evening workshops were probably best."], "Survey responses showed that 81 percent of participants preferred evening workshops.", "Specific measured evidence is stronger than vague language."],
    ["Which revision best maintains formal tone in a report?", ["Attendance increased during the second month of the pilot program.", "Attendance went way up during month two.", "Month two was awesome for attendance.", "Attendance kind of climbed later on."], "Attendance increased during the second month of the pilot program.", "Formal reports avoid slang and vague wording."],
    ["Which transition best signals a summary?", ["Overall,", "For example,", "Meanwhile,", "Nevertheless,"], "Overall,", "Overall prepares the reader for a summary statement."],
    ["Which sentence best improves paragraph unity?", ["Every sentence in the paragraph should support the main point about transportation access.", "Paragraphs can include any idea the writer likes.", "A paragraph can change topics without warning.", "Details never need to connect to one another."], "Every sentence in the paragraph should support the main point about transportation access.", "Unity means each sentence helps develop the same central idea."],
    ["Which revision best clarifies cause and effect?", ["Because the schedule was posted earlier, employees had more time to arrange child care.", "The schedule was posted earlier, employees had child care.", "Earlier posting was child care for employees.", "The schedule and child care were arranged together."], "Because the schedule was posted earlier, employees had more time to arrange child care.", "The revised sentence clearly shows how the earlier posting helped employees."],
    ["Which sentence would best conclude a paragraph about steady study habits?", ["Consistent short sessions often do more than occasional cramming to build real readiness.", "Studying exists in many forms.", "Some notebooks are blue.", "That is what I think about studying."], "Consistent short sessions often do more than occasional cramming to build real readiness.", "A strong concluding sentence ties the paragraph back to its main lesson."]
  ];

  revisionSpecs.forEach(function (spec, index) {
    addQuestion({
      skill: index % 4 === 0 ? "Revision and Editing" : index % 4 === 1 ? "Claims and Evidence" : index % 4 === 2 ? "Tone" : "Sentence Structure",
      difficulty: index < 10 ? "foundation" : index < 22 ? "standard" : "stretch",
      type: "revision-editing",
      prompt: spec[0],
      choices: spec[1],
      correctAnswer: spec[2],
      explanation: spec[3],
      tags: ["revision", "editing", "writing quality"]
    });
  });

  window.GEDData.questions = (window.GEDData.questions || []).concat(questions);
})();
