window.GEDData = window.GEDData || {};

(function addEssayBank() {
  var rubricGuidance = [
    "State a clear claim about which source is stronger.",
    "Use specific evidence from both passages.",
    "Explain how the evidence supports the claim.",
    "Organize the response clearly and keep sentence control steady."
  ];

  var moreEssays = [
    ["essay-public-transit", "Should a city expand late-night transit on major routes?", "One passage argues that later service supports workers whose shifts end after midnight and improves job access.", "Another passage argues that expanded service is expensive and should wait until ridership data is stronger."],
    ["essay-online-courses", "Should employers reimburse job-related online courses?", "One source says reimbursement helps workers build skills and stay with the company.", "Another source warns that reimbursement should be limited to courses tied directly to job performance."],
    ["essay-community-garden", "Should a town invest in a neighborhood garden program?", "One source emphasizes food access, community pride, and shared responsibility.", "Another source argues that the land should be used for parking and lower-maintenance purposes."],
    ["essay-bus-shelter", "Should the city install a covered bus shelter at a busy stop?", "One source argues that a shelter would improve safety and reliability for regular riders.", "Another source argues that limited funds should go first to route expansion instead of amenities."],
    ["essay-library-hours", "Should a library keep evening career-support hours?", "One source says adults need after-work access to coaching, computers, and resume help.", "Another source argues that extended hours may strain staffing and should remain temporary."],
    ["essay-shift-policy", "Should a workplace require earlier shift-swap approval?", "One source says earlier approval protects staffing levels and payroll accuracy.", "Another source says the rule may reduce flexibility for employees with changing family needs."],
    ["essay-repair-records", "Should tenants be required to document repeated repair requests in writing?", "One source says written records reduce confusion and help solve disputes fairly.", "Another source argues that written procedures can burden tenants who already face difficult housing conditions."],
    ["essay-apprenticeship", "Should more public funding go to apprenticeship and pre-apprenticeship programs?", "One source argues that apprenticeships connect adults to wages and measurable career paths.", "Another source argues that funds should go first to shorter job-placement services."],
    ["essay-school-meals", "Should a school district partner with local farms for meal ingredients?", "One source argues that partnerships improve freshness and strengthen the local economy.", "Another source warns that local contracts may raise costs and complicate supply planning."],
    ["essay-parking-lot", "Should an unused lot become a public park or extra parking?", "One passage argues for outdoor space, neighborhood events, and family use.", "The other passage argues for parking access to support nearby businesses."],
    ["essay-weekend-classes", "Should adult education programs add weekend classes?", "One source says weekend classes help learners with weekday work schedules.", "Another source says programs should strengthen tutoring during current hours before adding more classes."],
    ["essay-city-recycling", "Should a city invest in stronger recycling education before adding more pickups?", "One source argues that better resident habits would solve many current problems at lower cost.", "Another source argues that education alone will not fix volume problems without service expansion."],
    ["essay-hospital-training", "Should hospitals pay staff for required training hours?", "One source says paid training improves compliance and respects workers' time.", "Another source argues that budgets are limited and training should remain unpaid when possible."],
    ["essay-digital-literacy", "Should community centers offer free digital literacy workshops?", "One source says digital skills are essential for jobs, services, and education access.", "Another source argues that centers should focus on food and housing support before technology training."],
    ["essay-child-care-support", "Should adult learning programs provide on-site child care?", "One source says child care removes one of the biggest barriers to attendance.", "Another source argues that adding child care may stretch program staffing and insurance costs."],
    ["essay-road-repair", "Should a town repair sidewalks before repaving downtown parking areas?", "One source says safe sidewalks protect pedestrians and improve access for everyone.", "Another source says parking improvements will help local business revenue more directly."],
    ["essay-hybrid-work", "Should a company keep some hybrid work options after reopening offices?", "One source says hybrid work improves retention and reduces commute stress.", "Another source says in-person work creates stronger collaboration and clearer supervision."],
    ["essay-health-clinic", "Should a clinic extend hours into the evening?", "One source says evening hours help working patients get care without missing pay.", "Another source says extending hours may be costly unless patient demand is consistently high."]
  ].map(function (item, index) {
    return {
      id: item[0],
      title: item[1],
      prompt: "Read both source texts. Write an extended response that explains which argument is better supported and why. Use evidence from both passages.",
      passageA: item[2],
      passageB: item[3],
      rubricGuidance: rubricGuidance,
      sampleThesis:
        "The stronger argument is the one that connects a clear community or workplace need to specific evidence, while the opposing source raises concerns without equally detailed support.",
      modelResponse:
        index < 2
          ? "The stronger argument is the one that uses direct evidence and a clear explanation of impact. In these passages, the better-supported side does more than state an opinion. It explains how the proposal would affect real people and why those effects matter. The weaker passage raises a reasonable concern, but it depends more on caution than on concrete proof. Because the stronger passage links its claim to practical consequences and clearer examples, it is more convincing."
          : null
    };
  });

  window.GEDData.essays = (window.GEDData.essays || []).concat(moreEssays);
  window.GEDData.essayExamples = {
    strongVsWeak: [
      {
        title: "Using Evidence",
        strong: "The stronger passage is more convincing because it gives a clear claim, specific evidence, and an explanation of why that evidence matters to workers and families.",
        weak: "I agree with passage A because it sounds better and I liked it more.",
        lesson: "A strong response names evidence and explains its importance instead of relying on opinion alone."
      },
      {
        title: "Organization",
        strong: "First, the writer states which source is stronger. Next, the response compares evidence from both passages. Finally, it explains why one set of evidence is more convincing.",
        weak: "One passage is stronger. Also there are details. Another thing is there are facts. That is why.",
        lesson: "A strong response follows a clear structure so the reader can track the argument."
      },
      {
        title: "Using Both Passages",
        strong: "Although Passage B raises a valid concern about cost, Passage A is better supported because it explains specific benefits and shows who would be helped directly.",
        weak: "Passage A is stronger. Passage B is not as good.",
        lesson: "A strong GED response shows that the writer considered both passages before choosing the stronger one."
      },
      {
        title: "Formal Tone",
        strong: "The argument is more persuasive because the evidence is concrete and directly tied to the problem described in the prompt.",
        weak: "This one is way better and makes more sense to me.",
        lesson: "Formal but plainspoken language sounds more credible than casual opinion language."
      }
    ],
    thesisFrames: [
      "Passage A is better supported because it uses stronger evidence about ___, while Passage B relies mostly on ___.",
      "Although both passages discuss ___, Passage B makes the stronger argument because it explains ___ more clearly.",
      "The more convincing source is ___ because its evidence connects directly to ___."
    ]
  };
})();
