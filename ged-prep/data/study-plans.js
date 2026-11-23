window.GEDData = window.GEDData || {};

window.GEDData.studyPlans = [
  {
    id: "plan-8-week",
    title: "8-Week Plan",
    summary: "Balanced prep for a learner with consistent weekly study time.",
    days: [
      { label: "Monday", focus: "Math skill practice", minutes: 45, practice: "10 to 15-question math set", review: "Log missed steps and review formulas" },
      { label: "Tuesday", focus: "RLA passage work", minutes: 45, practice: "2 passage-based RLA sets", review: "Note weak inference or evidence habits" },
      { label: "Wednesday", focus: "Science or Social Studies", minutes: 40, practice: "One timed mini set", review: "Write a 3-point recap of key ideas" },
      { label: "Thursday", focus: "Math plus review", minutes: 50, practice: "Wrong-answer retake mode", review: "Rework the three hardest misses" },
      { label: "Friday", focus: "Essay Lab", minutes: 45, practice: "One planner and one paragraph draft", review: "Self-score on the rubric" },
      { label: "Saturday", focus: "Mixed practice exam", minutes: 60, practice: "Timed mixed set", review: "Check score report and weak skills" },
      { label: "Sunday", focus: "Review day", minutes: 30, practice: "Bookmark review only", review: "Light review and reset for next week" }
    ]
  },
  {
    id: "plan-12-week",
    title: "12-Week Plan",
    summary: "Longer runway with slower pacing and more repetition.",
    days: [
      { label: "Monday", focus: "Foundation math", minutes: 35, practice: "Fractions, decimals, or percents", review: "Write one rule learned today" },
      { label: "Tuesday", focus: "Foundation RLA", minutes: 35, practice: "Main idea and supporting details", review: "Annotate one passage takeaway" },
      { label: "Wednesday", focus: "Science basics", minutes: 30, practice: "Experiments and variables", review: "Summarize one scientific method concept" },
      { label: "Thursday", focus: "Social Studies basics", minutes: 30, practice: "Civics or economics set", review: "List one government concept to remember" },
      { label: "Friday", focus: "Essay warm-up", minutes: 30, practice: "Thesis builder and evidence checklist", review: "Revise one paragraph" },
      { label: "Saturday", focus: "Mixed review", minutes: 45, practice: "Short mixed set", review: "Retake wrong answers" },
      { label: "Sunday", focus: "Recovery and planning", minutes: 20, practice: "Light bookmark review", review: "Preview next week's target skills" }
    ]
  },
  {
    id: "plan-comeback",
    title: "Beginner Comeback Plan",
    summary: "Lower-pressure routine for returning to study after a long break.",
    days: [
      { label: "Monday", focus: "Short math reset", minutes: 25, practice: "Foundation math only", review: "Celebrate one correct strategy" },
      { label: "Tuesday", focus: "Short reading reset", minutes: 25, practice: "One passage and two grammar questions", review: "Underline evidence choices" },
      { label: "Wednesday", focus: "Rest or catch-up", minutes: 15, practice: "Optional bookmarks", review: "Keep the habit gentle" },
      { label: "Thursday", focus: "Science or Social basics", minutes: 25, practice: "One short subject set", review: "Note unfamiliar terms" },
      { label: "Friday", focus: "Essay confidence", minutes: 20, practice: "Claim plus two evidence notes", review: "Do not aim for a full essay yet" },
      { label: "Saturday", focus: "Mixed confidence set", minutes: 30, practice: "Easy mixed practice", review: "Track only one next step" },
      { label: "Sunday", focus: "Review day", minutes: 15, practice: "Look at saved progress", review: "Prepare a realistic week ahead" }
    ]
  },
  {
    id: "plan-math-recovery",
    title: "Weak-Math Recovery Plan",
    summary: "Focused rebuild for a learner who needs math to catch up fast.",
    days: [
      { label: "Monday", focus: "Number sense", minutes: 50, practice: "Fractions and decimals", review: "Rewrite misses by hand" },
      { label: "Tuesday", focus: "Percents and ratios", minutes: 50, practice: "Real-world word problems", review: "Create one sample problem of your own" },
      { label: "Wednesday", focus: "Equations", minutes: 45, practice: "Solve and check equations", review: "Circle any step where signs changed" },
      { label: "Thursday", focus: "Geometry and measurement", minutes: 45, practice: "Area, perimeter, volume", review: "Review formula sheet" },
      { label: "Friday", focus: "Graphs and coordinates", minutes: 40, practice: "Data interpretation set", review: "Describe one pattern in words" },
      { label: "Saturday", focus: "Timed math mini test", minutes: 60, practice: "Math exam set", review: "Retake every wrong answer" },
      { label: "Sunday", focus: "Light review", minutes: 25, practice: "Bookmarks and formula recall", review: "Prepare Monday target skill" }
    ]
  },
  {
    id: "plan-stretch",
    title: "College-Readiness Stretch Plan",
    summary: "Higher-intensity pacing for a learner aiming above the GED floor.",
    days: [
      { label: "Monday", focus: "Stretch math", minutes: 60, practice: "College-readiness math questions", review: "Explain one solution in writing" },
      { label: "Tuesday", focus: "Advanced RLA", minutes: 60, practice: "Paired passages and revision", review: "Compare argument strength" },
      { label: "Wednesday", focus: "Science reasoning", minutes: 45, practice: "Evidence and conclusion sets", review: "Critique one experimental design" },
      { label: "Thursday", focus: "Civics and economics", minutes: 45, practice: "High-level Social Studies set", review: "Summarize the main concept in plain language" },
      { label: "Friday", focus: "Full essay draft", minutes: 60, practice: "Plan, draft, and self-score", review: "Revise thesis and evidence" },
      { label: "Saturday", focus: "Long mixed exam", minutes: 75, practice: "Timed mixed or mock exam", review: "Study the skill breakdown closely" },
      { label: "Sunday", focus: "Reset and reflect", minutes: 30, practice: "Read score trends", review: "Choose the next stretch target" }
    ]
  }
];
