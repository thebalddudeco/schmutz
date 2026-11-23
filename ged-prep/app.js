(function initializeGEDPrepApp() {
  window.GEDData = window.GEDData || {};

  var STORAGE_KEY = "ged-prep-hub-state-v1";
  var ACCESS_KEY = "ged-prep-order-access-v1";
  var AUTOSAVE_INTERVAL = 60000;
  var PROTECTED_DATA_SCRIPTS = [
    "data/passages.js",
    "data/essays.js",
    "data/essay-bank.js",
    "data/questions.js",
    "data/math-bank.js",
    "data/rla-bank.js",
    "data/science-bank.js",
    "data/social-studies-bank.js",
    "data/mixed-bank.js",
    "data/study-plans.js"
  ];
  var appElements = {};
  var state;
  var hasBoundEvents = false;
  var appBooted = false;
  var dataScriptsLoaded = false;
  var bootPromise = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function localDayKey(dateValue) {
    var date = dateValue ? new Date(dateValue) : new Date();
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildDefaultFilters() {
    var filters = {};
    Object.keys(window.GEDData.catalog.subjectMeta).forEach(function (subject) {
      filters[subject] = {
        difficulty: "all",
        skill: "all",
        type: "all",
        mode: "all"
      };
    });
    return filters;
  }

  function defaultState() {
    return {
      meta: {
        version: 1,
        createdAt: nowIso(),
        updatedAt: nowIso()
      },
      learner: {
        name: "Learner"
      },
      ui: {
        activeSection: "dashboard",
        lastVisitedSection: "dashboard",
        filters: buildDefaultFilters(),
        lastOpenedSubject: null,
        selectedEssayId: window.GEDData.essays && window.GEDData.essays.length ? window.GEDData.essays[0].id : null
      },
      sessions: {
        activeQuiz: null
      },
      progress: {
        studyTimeSeconds: 0,
        studyStreak: 0,
        lastStudyDate: null,
        dailyActivity: {},
        sectionTimeSeconds: {},
        bookmarks: [],
        completedQuestionIds: [],
        wrongQuestionIds: [],
        questionStats: {},
        recentActivity: [],
        subjectHistory: {
          math: [],
          rla: [],
          science: [],
          socialStudies: []
        },
        skillHistory: {},
        diagnosticHistory: [],
        practiceHistory: [],
        essayHistory: [],
        essayDrafts: {},
        lastSessionResult: null,
        readiness: {
          label: "Building baseline",
          percent: 12
        }
      }
    };
  }

  function mergeState(base, saved) {
    var merged = clone(base);
    Object.keys(saved || {}).forEach(function (key) {
      if (saved[key] && typeof saved[key] === "object" && !Array.isArray(saved[key]) && merged[key]) {
        merged[key] = mergeState(merged[key], saved[key]);
      } else {
        merged[key] = saved[key];
      }
    });
    return merged;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultState();
      }
      return mergeState(defaultState(), JSON.parse(raw));
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    state.meta.updatedAt = nowIso();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getStoredAccessRecord() {
    try {
      return JSON.parse(localStorage.getItem(ACCESS_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function setStoredAccessRecord(record) {
    try {
      localStorage.setItem(ACCESS_KEY, JSON.stringify(record));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearStoredAccessRecord() {
    try {
      localStorage.removeItem(ACCESS_KEY);
    } catch (error) {
      // Ignore storage-clear failures.
    }
  }

  function applyAccessState(isGranted) {
    document.documentElement.classList.toggle("access-granted", isGranted);
    document.documentElement.classList.toggle("access-locked", !isGranted);
  }

  function getAccessRegistry() {
    var registry = window.GEDData.orderAccessRegistry || {};
    return {
      sellerName: registry.sellerName || "your Gumroad delivery",
      productName: registry.productName || "GED Prep Hub",
      supportEmail: registry.supportEmail || "",
      instructions:
        registry.instructions ||
        "Use the same email address used at checkout and the Gumroad order ID shown on your receipt.",
      activeOrders: registry.activeOrders || [],
      revokedOrderHashes: registry.revokedOrderHashes || []
    };
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeOrderId(value) {
    return String(value || "").trim().replace(/\s+/g, "");
  }

  function buildAccessPayload(email, orderId) {
    return normalizeEmail(email) + "|" + normalizeOrderId(orderId);
  }

  function isActiveOrderHash(hash) {
    var registry = getAccessRegistry();
    var revoked = registry.revokedOrderHashes || [];
    if (revoked.indexOf(hash) !== -1) {
      return false;
    }

    return (registry.activeOrders || []).some(function (entry) {
      return entry.hash === hash;
    });
  }

  function sha256Hex(value) {
    if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) {
      return Promise.reject(new Error("missing-crypto"));
    }

    return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(function (buffer) {
      return Array.prototype.map
        .call(new Uint8Array(buffer), function (item) {
          return item.toString(16).padStart(2, "0");
        })
        .join("");
    });
  }

  function getProtectedDataScriptStatus() {
    return PROTECTED_DATA_SCRIPTS.every(function (path) {
      return document.querySelector('script[data-protected-src="' + path + '"]');
    });
  }

  function loadProtectedScript(path) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[data-protected-src="' + path + '"]')) {
        resolve();
        return;
      }

      var script = document.createElement("script");
      script.src = path;
      script.async = false;
      script.setAttribute("data-protected-src", path);
      script.onload = function () {
        resolve();
      };
      script.onerror = function () {
        reject(new Error("failed-to-load-" + path));
      };
      document.body.appendChild(script);
    });
  }

  function loadProtectedData() {
    if (dataScriptsLoaded || getProtectedDataScriptStatus()) {
      dataScriptsLoaded = true;
      return Promise.resolve();
    }

    return PROTECTED_DATA_SCRIPTS.reduce(function (chain, path) {
      return chain.then(function () {
        return loadProtectedScript(path);
      });
    }, Promise.resolve()).then(function () {
      dataScriptsLoaded = true;
    });
  }

  function setGateStatus(statusElement, message, tone) {
    statusElement.textContent = message;
    statusElement.classList.toggle("is-error", tone === "error");
    statusElement.classList.toggle("is-success", tone === "success");
  }

  function bootApplication() {
    if (appBooted) {
      return Promise.resolve();
    }

    if (bootPromise) {
      return bootPromise;
    }

    bootPromise = loadProtectedData()
      .then(function () {
        state = loadState();
        buildCatalogIndex();
        recomputeStudyStreak();
        cacheElements();
        if (!hasBoundEvents) {
          bindEvents();
          hasBoundEvents = true;
        }
        renderNavigation();
        renderPanels();
        startStudyClock();
        startSessionTimer();
        appBooted = true;
      })
      .catch(function (error) {
        bootPromise = null;
        throw error;
      });

    return bootPromise;
  }

  function setupAccessGate() {
    var gateForm = document.getElementById("access-gate-form");
    var emailInput = document.getElementById("access-email");
    var orderIdInput = document.getElementById("access-order-id");
    var status = document.getElementById("access-gate-status");
    var registry = getAccessRegistry();
    var storedAccessRecord = getStoredAccessRecord();

    if (!gateForm || !emailInput || !orderIdInput || !status) {
      return;
    }

    applyAccessState(false);
    setGateStatus(status, registry.instructions, "");

    function unlockCourse(record) {
      return bootApplication()
        .then(function () {
          applyAccessState(true);
          if (setStoredAccessRecord(record)) {
            setGateStatus(status, "Purchase verified. This browser will stay unlocked for this purchase.", "success");
          } else {
            setGateStatus(
              status,
              "Purchase verified. The course is unlocked now, but this browser could not save the access record, so you may need to enter the order ID again later.",
              "success"
            );
          }
          gateForm.reset();
        })
        .catch(function () {
          applyAccessState(false);
          setGateStatus(status, "Your order matched, but the protected course files could not be loaded.", "error");
        });
    }

    if (!(registry.activeOrders || []).length) {
      setGateStatus(
        status,
        "No active order hashes are loaded yet. Seller setup: open order-helper.html, generate a buyer entry, and paste it into data/order-access-registry.js.",
        "error"
      );
      return;
    }

    if (storedAccessRecord && storedAccessRecord.hash && isActiveOrderHash(storedAccessRecord.hash)) {
      setGateStatus(status, "Stored purchase record found. Loading course...", "success");
      unlockCourse(storedAccessRecord);
      return;
    }

    if (storedAccessRecord) {
      clearStoredAccessRecord();
    }

    if (!storedAccessRecord) {
      window.setTimeout(function () {
        emailInput.focus();
      }, 40);
    }

    gateForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var emailValue = normalizeEmail(emailInput.value);
      var orderIdValue = normalizeOrderId(orderIdInput.value);

      if (!emailValue || !orderIdValue) {
        setGateStatus(status, "Enter the purchase email and the Gumroad order ID to continue.", "error");
        if (!emailValue) {
          emailInput.focus();
        } else {
          orderIdInput.focus();
        }
        return;
      }

      setGateStatus(status, "Checking purchase record...", "");

      sha256Hex(buildAccessPayload(emailValue, orderIdValue))
        .then(function (hash) {
          if (isActiveOrderHash(hash)) {
            unlockCourse({
              email: emailValue,
              hash: hash,
              verifiedAt: nowIso()
            });
            return;
          }

          applyAccessState(false);
          setGateStatus(
            status,
            "That email and order ID did not match an active purchase. Double-check the Gumroad receipt details" +
              (registry.supportEmail ? " or contact " + registry.supportEmail + "." : "."),
            "error"
          );
          orderIdInput.select();
        })
        .catch(function () {
          applyAccessState(false);
          setGateStatus(
            status,
            "This browser could not verify the order ID. Try a current version of Chrome, Edge, Firefox, or Safari.",
            "error"
          );
        });
    });
  }

  function getQuestions(subject) {
    if (!subject || subject === "mixed") {
      return window.GEDData.questions.slice();
    }
    return window.GEDData.questions.filter(function (question) {
      return question.subject === subject;
    });
  }

  function getQuestionById(id) {
    return window.GEDData.questions.find(function (question) {
      return question.id === id;
    });
  }

  function getPassageById(id) {
    return (window.GEDData.passages || []).find(function (passage) {
      return passage.id === id;
    });
  }

  function pushRecentActivity(activity) {
    state.progress.recentActivity.unshift(
      Object.assign(
        {
          id: "activity-" + Date.now(),
          timestamp: nowIso()
        },
        activity
      )
    );
    state.progress.recentActivity = state.progress.recentActivity.slice(0, 10);
  }

  function upsertQuestionStat(questionId, wasCorrect, selectedAnswer) {
    if (!state.progress.questionStats[questionId]) {
      state.progress.questionStats[questionId] = {
        attempts: 0,
        correct: 0,
        lastAnsweredAt: null,
        lastSelectedAnswer: null
      };
    }

    var stats = state.progress.questionStats[questionId];
    stats.attempts += 1;
    if (wasCorrect) {
      stats.correct += 1;
    }

    if (!wasCorrect && state.progress.wrongQuestionIds.indexOf(questionId) === -1) {
      state.progress.wrongQuestionIds.push(questionId);
    }

    if (wasCorrect) {
      state.progress.wrongQuestionIds = state.progress.wrongQuestionIds.filter(function (id) {
        return id !== questionId;
      });
    }

    if (state.progress.completedQuestionIds.indexOf(questionId) === -1) {
      state.progress.completedQuestionIds.push(questionId);
    }

    stats.lastAnsweredAt = nowIso();
    stats.lastSelectedAnswer = selectedAnswer;
  }

  function getSubjectSnapshot(subject) {
    var questions = getQuestions(subject);
    var answered = questions.filter(function (question) {
      return !!state.progress.questionStats[question.id];
    });
    var correctCount = answered.reduce(function (total, question) {
      var stats = state.progress.questionStats[question.id];
      return total + (stats ? stats.correct : 0);
    }, 0);
    var attemptsCount = answered.reduce(function (total, question) {
      var stats = state.progress.questionStats[question.id];
      return total + (stats ? stats.attempts : 0);
    }, 0);
    return {
      total: questions.length,
      answered: answered.length,
      completion: questions.length ? Math.round((answered.length / questions.length) * 100) : 0,
      accuracy: attemptsCount ? Math.round((correctCount / attemptsCount) * 100) : 0
    };
  }

  function getActiveStudyBucket() {
    var section = state.ui.activeSection;
    if (window.GEDData.catalog.subjectMeta[section]) {
      return section;
    }
    if (section === "practiceExams") {
      return "practiceExams";
    }
    if (section === "essayLab") {
      return "essayLab";
    }
    if (section === "diagnostics") {
      return "diagnostics";
    }
    return "general";
  }

  function recomputeStudyStreak() {
    var days = Object.keys(state.progress.dailyActivity || {}).sort().reverse();
    if (!days.length) {
      state.progress.studyStreak = 0;
      return;
    }

    var streak = 0;
    var cursor = new Date(days[0] + "T00:00:00");
    for (var index = 0; index < days.length; index += 1) {
      var expected = localDayKey(cursor);
      if (days[index] !== expected) {
        break;
      }
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    state.progress.studyStreak = streak;
  }

  function recordStudyMinute() {
    var today = localDayKey();
    state.progress.studyTimeSeconds += 60;
    state.progress.dailyActivity[today] = (state.progress.dailyActivity[today] || 0) + 60;
    state.progress.lastStudyDate = today;
    var bucket = getActiveStudyBucket();
    state.progress.sectionTimeSeconds[bucket] = (state.progress.sectionTimeSeconds[bucket] || 0) + 60;
    recomputeStudyStreak();
  }

  function deriveReadiness() {
    var subjectIds = Object.keys(window.GEDData.catalog.subjectMeta);
    var totals = subjectIds.map(getSubjectSnapshot);
    var avgCompletion = Math.round(
      totals.reduce(function (sum, item) {
        return sum + item.completion;
      }, 0) / Math.max(totals.length, 1)
    );
    var avgAccuracy = Math.round(
      totals.reduce(function (sum, item) {
        return sum + item.accuracy;
      }, 0) / Math.max(totals.length, 1)
    );
    var composite = Math.round(avgCompletion * 0.45 + avgAccuracy * 0.55);
    var label = "Building baseline";

    if (composite >= 75) {
      label = "Near test ready";
    } else if (composite >= 55) {
      label = "Steady progress";
    } else if (composite >= 35) {
      label = "Core skills growing";
    }

    state.progress.readiness = {
      label: label,
      percent: composite
    };
  }

  function buildSkillSnapshots() {
    var skillMap = {};

    window.GEDData.questions.forEach(function (question) {
      var key = question.subject + "::" + question.skill;
      if (!skillMap[key]) {
        skillMap[key] = {
          key: key,
          subject: question.subject,
          skill: question.skill,
          attempts: 0,
          correct: 0,
          missed: 0
        };
      }

      var stats = state.progress.questionStats[question.id];
      if (stats) {
        skillMap[key].attempts += stats.attempts;
        skillMap[key].correct += stats.correct;
        skillMap[key].missed += stats.attempts - stats.correct;
      }
    });

    return Object.keys(skillMap)
      .map(function (key) {
        var item = skillMap[key];
        item.accuracy = item.attempts ? Math.round((item.correct / item.attempts) * 100) : 0;
        return item;
      })
      .sort(function (left, right) {
        if (left.attempts === 0 && right.attempts === 0) {
          return left.skill.localeCompare(right.skill);
        }
        if (left.attempts === 0) {
          return 1;
        }
        if (right.attempts === 0) {
          return -1;
        }
        if (left.accuracy !== right.accuracy) {
          return left.accuracy - right.accuracy;
        }
        return right.missed - left.missed;
      });
  }

  function getWeakSkills(limit) {
    return buildSkillSnapshots()
      .filter(function (item) {
        return item.attempts > 0;
      })
      .slice(0, limit || 4);
  }

  function getRecentScores(limit) {
    return state.progress.diagnosticHistory
      .concat(state.progress.practiceHistory)
      .slice()
      .sort(function (left, right) {
        return new Date(right.completedAt) - new Date(left.completedAt);
      })
      .slice(0, limit || 6);
  }

  function getMostMissedSkills(limit) {
    return buildSkillSnapshots()
      .filter(function (item) {
        return item.missed > 0;
      })
      .sort(function (left, right) {
        if (right.missed !== left.missed) {
          return right.missed - left.missed;
        }
        return left.accuracy - right.accuracy;
      })
      .slice(0, limit || 6);
  }

  function getMasterySnapshot(limit) {
    return buildSkillSnapshots()
      .filter(function (item) {
        return item.attempts > 0;
      })
      .sort(function (left, right) {
        if (right.accuracy !== left.accuracy) {
          return right.accuracy - left.accuracy;
        }
        return right.attempts - left.attempts;
      })
      .slice(0, limit || 8);
  }

  function getSubjectImprovement(subject) {
    var history = state.progress.subjectHistory[subject] || [];
    if (history.length < 2) {
      return null;
    }
    var first = history[0];
    var latest = history[history.length - 1];
    return {
      start: first.score,
      current: latest.score,
      delta: latest.score - first.score
    };
  }

  function getDiagnosticDelta(subject) {
    var history = state.progress.diagnosticHistory.filter(function (entry) {
      return entry.subject === subject;
    });
    if (history.length < 2) {
      return null;
    }
    return history[0].score - history[1].score;
  }

  function getTimeAllocation(limit) {
    return Object.keys(state.progress.sectionTimeSeconds || {})
      .map(function (key) {
        return {
          key: key,
          label: window.GEDData.catalog.subjectMeta[key] ? window.GEDData.catalog.subjectMeta[key].label : formatTypeLabel(key),
          seconds: state.progress.sectionTimeSeconds[key]
        };
      })
      .filter(function (item) {
        return item.seconds > 0;
      })
      .sort(function (left, right) {
        return right.seconds - left.seconds;
      })
      .slice(0, limit || 8);
  }

  function getDailyStudySeries(days) {
    var totalDays = days || 14;
    var series = [];

    for (var offset = totalDays - 1; offset >= 0; offset -= 1) {
      var date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      var key = localDayKey(date);
      var seconds = state.progress.dailyActivity[key] || 0;
      series.push({
        key: key,
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        shortLabel: date.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }),
        seconds: seconds,
        minutes: Math.round(seconds / 60)
      });
    }

    return series;
  }

  function getDifficultyPerformance(subject) {
    var buckets = {
      foundation: {
        label: window.GEDData.catalog.difficultyLabels.foundation,
        total: 0,
        answered: 0,
        attempts: 0,
        correct: 0
      },
      standard: {
        label: window.GEDData.catalog.difficultyLabels.standard,
        total: 0,
        answered: 0,
        attempts: 0,
        correct: 0
      },
      stretch: {
        label: window.GEDData.catalog.difficultyLabels.stretch,
        total: 0,
        answered: 0,
        attempts: 0,
        correct: 0
      }
    };

    getQuestions(subject).forEach(function (question) {
      var bucket = buckets[question.difficulty];
      var questionStat = state.progress.questionStats[question.id];
      if (!bucket) {
        return;
      }
      bucket.total += 1;
      if (questionStat) {
        bucket.answered += 1;
        bucket.attempts += questionStat.attempts;
        bucket.correct += questionStat.correct;
      }
    });

    Object.keys(buckets).forEach(function (key) {
      buckets[key].accuracy = buckets[key].attempts ? Math.round((buckets[key].correct / buckets[key].attempts) * 100) : 0;
      buckets[key].completion = buckets[key].total ? Math.round((buckets[key].answered / buckets[key].total) * 100) : 0;
    });

    return buckets;
  }

  function getQuestionReviewQueue(mode, limit, subject) {
    var ids = mode === "bookmarks" ? state.progress.bookmarks : state.progress.wrongQuestionIds;
    return ids
      .map(function (questionId) {
        var question = getQuestionById(questionId);
        if (!question || (subject && question.subject !== subject)) {
          return null;
        }
        var questionStat = state.progress.questionStats[question.id] || {
          attempts: 0,
          correct: 0,
          lastSelectedAnswer: null
        };
        return {
          id: question.id,
          subject: question.subject,
          subjectLabel: window.GEDData.catalog.subjectMeta[question.subject]
            ? window.GEDData.catalog.subjectMeta[question.subject].label
            : formatTypeLabel(question.subject),
          skill: question.skill,
          prompt: question.prompt,
          correctAnswer: question.correctAnswer,
          lastSelectedAnswer: questionStat.lastSelectedAnswer,
          attempts: questionStat.attempts,
          accuracy: questionStat.attempts ? Math.round((questionStat.correct / questionStat.attempts) * 100) : 0
        };
      })
      .filter(Boolean)
      .slice(0, limit || 6);
  }

  function getReadinessDrivers() {
    var subjectIds = Object.keys(window.GEDData.catalog.subjectMeta);
    var averageCompletion = Math.round(
      subjectIds.reduce(function (sum, subject) {
        return sum + getSubjectSnapshot(subject).completion;
      }, 0) / Math.max(subjectIds.length, 1)
    );
    var averageAccuracy = Math.round(
      subjectIds.reduce(function (sum, subject) {
        return sum + getSubjectSnapshot(subject).accuracy;
      }, 0) / Math.max(subjectIds.length, 1)
    );
    var diagnosticCoverage = Math.round((Math.min(state.progress.diagnosticHistory.length, subjectIds.length) / Math.max(subjectIds.length, 1)) * 100);
    var essayProgress = Math.min(100, state.progress.essayHistory.length * 10);
    var queuePressure = Math.min(100, state.progress.wrongQuestionIds.length * 8);

    return [
      {
        label: "Question coverage",
        value: averageCompletion + "%",
        detail: "Average completion across the four core subjects"
      },
      {
        label: "Measured accuracy",
        value: averageAccuracy + "%",
        detail: "Live accuracy from all answered questions"
      },
      {
        label: "Diagnostics",
        value: diagnosticCoverage + "%",
        detail: "Shows how much baseline evidence exists"
      },
      {
        label: "Essay progress",
        value: essayProgress + "%",
        detail: "Keeps written response work from falling behind"
      },
      {
        label: "Wrong-answer pressure",
        value: queuePressure + "%",
        detail: state.progress.wrongQuestionIds.length + " questions currently waiting for review"
      }
    ];
  }

  function getSubjectCoverage(subject) {
    var meta = window.GEDData.catalog.subjectMeta[subject];
    var domains = meta.domains || [
      {
        title: "Full bank",
        focus: meta.summary || "",
        skills: meta.skills
      }
    ];

    return domains.map(function (domain) {
      var rows = domain.skills.map(function (skill) {
        var difficulties = {
          foundation: 0,
          standard: 0,
          stretch: 0
        };
        var types = {};
        var total = 0;
        var answered = 0;
        var attempts = 0;
        var correct = 0;
        var queued = 0;

        getQuestions(subject).forEach(function (question) {
          if (question.skill !== skill) {
            return;
          }
          total += 1;
          difficulties[question.difficulty] += 1;
          types[question.type] = (types[question.type] || 0) + 1;

          var questionStat = state.progress.questionStats[question.id];
          if (questionStat) {
            answered += 1;
            attempts += questionStat.attempts;
            correct += questionStat.correct;
          }

          if (state.progress.wrongQuestionIds.indexOf(question.id) !== -1) {
            queued += 1;
          }
        });

        return {
          skill: skill,
          total: total,
          answered: answered,
          completion: total ? Math.round((answered / total) * 100) : 0,
          accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
          queued: queued,
          typesLabel: Object.keys(types)
            .slice(0, 3)
            .map(formatTypeLabel)
            .join(", "),
          difficulties: difficulties
        };
      });

      return {
        title: domain.title,
        focus: domain.focus,
        totalQuestions: rows.reduce(function (sum, row) {
          return sum + row.total;
        }, 0),
        skills: rows
      };
    });
  }

  function getStudyRecommendation() {
    var weakSkills = getWeakSkills(3);
    var mathSnapshot = getSubjectSnapshot("math");
    var rlaSnapshot = getSubjectSnapshot("rla");
    var essayCount = state.progress.essayHistory.length;

    if (!state.progress.diagnosticHistory.length) {
      return "Start one diagnostic in each subject to establish a true baseline.";
    }

    if (essayCount < 2) {
      return "Spend one session in Essay Lab so written-response practice does not lag behind multiple-choice work.";
    }

    if (state.progress.wrongQuestionIds.length >= 5) {
      return "Use retake mode on missed questions before adding harder new work.";
    }

    if (mathSnapshot.accuracy && mathSnapshot.accuracy < 60) {
      return "Prioritize Math recovery with focused number sense, ratios, and equation practice.";
    }

    if (rlaSnapshot.accuracy && rlaSnapshot.accuracy < 60) {
      return "Shift into RLA passage work and evidence questions until reading accuracy steadies.";
    }

    if (weakSkills.length) {
      var nextSkill = weakSkills[0];
      var subjectLabel = window.GEDData.catalog.subjectMeta[nextSkill.subject].label;
      return "Review " + nextSkill.skill + " in " + subjectLabel + " while accuracy is still low.";
    }

    return "Keep building consistency with one timed set and one review block this week.";
  }

  function getSubjectPriorityList() {
    return Object.keys(window.GEDData.catalog.subjectMeta)
      .map(function (subject) {
        var snapshot = getSubjectSnapshot(subject);
        var latestDiagnostic = state.progress.diagnosticHistory.find(function (entry) {
          return entry.subject === subject;
        });
        var urgency = (100 - snapshot.accuracy) * 0.55 + (100 - snapshot.completion) * 0.25 + (latestDiagnostic ? 100 - latestDiagnostic.score : 35) * 0.2;
        return {
          subject: subject,
          label: window.GEDData.catalog.subjectMeta[subject].label,
          urgency: Math.round(urgency),
          snapshot: snapshot,
          latestDiagnostic: latestDiagnostic
        };
      })
      .sort(function (left, right) {
        return right.urgency - left.urgency;
      });
  }

  var EXAM_PRESETS = [
    { id: "math-mini", title: "Math Mini Test", subject: "math", count: 15, minutes: 20 },
    { id: "rla-mini", title: "RLA Mini Test", subject: "rla", count: 15, minutes: 20 },
    { id: "science-mini", title: "Science Mini Test", subject: "science", count: 15, minutes: 20 },
    { id: "social-mini", title: "Social Studies Mini Test", subject: "socialStudies", count: 15, minutes: 20 },
    { id: "mixed-timed", title: "Mixed Timed Test", subject: "mixed", count: 25, minutes: 35 },
    { id: "full-mock", title: "Full Mock Exam", subject: "mixed", count: 60, minutes: 90 }
  ];

  function getEssayById(id) {
    return (window.GEDData.essays || []).find(function (essay) {
      return essay.id === id;
    });
  }

  function getSelectedEssay() {
    return getEssayById(state.ui.selectedEssayId) || (window.GEDData.essays || [])[0] || null;
  }

  function getEssayDraft(essayId) {
    if (!state.progress.essayDrafts[essayId]) {
      state.progress.essayDrafts[essayId] = {
        thesis: "",
        evidenceA: "",
        evidenceB: "",
        outline: "",
        draft: "",
        checklist: {
          claim: false,
          passageA: false,
          passageB: false,
          explanation: false
        },
        rubric: {
          analysis: "0",
          evidence: "0",
          organization: "0",
          clarity: "0"
        }
      };
    }
    return state.progress.essayDrafts[essayId];
  }

  function formatDuration(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours + "h " + String(minutes).padStart(2, "0") + "m";
  }

  function formatCountdown(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function buildSelectOptions(options, selected) {
    return options
      .map(function (option) {
        return (
          '<option value="' +
          escapeHtml(option.value) +
          '"' +
          (selected === option.value ? " selected" : "") +
          ">" +
          escapeHtml(option.label) +
          "</option>"
        );
      })
      .join("");
  }

  function formatTypeLabel(type) {
    return String(type)
      .split("-")
      .map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");
  }

  function buildCatalogIndex() {
    var index = {};

    Object.keys(window.GEDData.catalog.subjectMeta).forEach(function (subject) {
      index[subject] = {
        total: 0,
        skills: {},
        types: {},
        difficulties: {
          foundation: 0,
          standard: 0,
          stretch: 0
        }
      };
    });

    (window.GEDData.questions || []).forEach(function (question) {
      if (!index[question.subject]) {
        return;
      }
      index[question.subject].total += 1;
      index[question.subject].skills[question.skill] = (index[question.subject].skills[question.skill] || 0) + 1;
      index[question.subject].types[question.type] = (index[question.subject].types[question.type] || 0) + 1;
      index[question.subject].difficulties[question.difficulty] = (index[question.subject].difficulties[question.difficulty] || 0) + 1;
    });

    window.GEDData.catalog.index = index;
  }

  function toggleBookmark(questionId) {
    var bookmarks = state.progress.bookmarks;
    if (bookmarks.indexOf(questionId) === -1) {
      bookmarks.push(questionId);
      pushRecentActivity({
        type: "bookmark",
        title: "Bookmarked a question",
        detail: questionId
      });
    } else {
      state.progress.bookmarks = bookmarks.filter(function (id) {
        return id !== questionId;
      });
    }
    saveState();
  }

  var quizEngine = {
    createSession: function (options) {
      var pool = (options.pool || []).map(function (question) {
        return question.id;
      });
      state.sessions.activeQuiz = {
        id: "quiz-" + Date.now(),
        title: options.title || "Practice session",
        subject: options.subject || "mixed",
        mode: options.mode || "practice",
        timerSeconds: options.timerSeconds || 0,
        remainingSeconds: options.timerSeconds || 0,
        originSection: options.originSection || options.subject || "dashboard",
        startedAt: nowIso(),
        questionIds: pool,
        cursor: 0,
        answers: {},
        finishedAt: null
      };
      state.ui.lastOpenedSubject = options.subject || "mixed";
      pushRecentActivity({
        type: "session-start",
        title: state.sessions.activeQuiz.title,
        detail: pool.length + " questions"
      });
      saveState();
      return state.sessions.activeQuiz;
    },

    getSession: function () {
      return state.sessions.activeQuiz;
    },

    getCurrentQuestion: function () {
      var session = this.getSession();
      if (!session || !session.questionIds.length) {
        return null;
      }
      return getQuestionById(session.questionIds[session.cursor]);
    },

    submitAnswer: function (answer) {
      var session = this.getSession();
      var question = this.getCurrentQuestion();
      if (!session || !question) {
        return null;
      }

      var wasCorrect = answer === question.correctAnswer;
      session.answers[question.id] = {
        answer: answer,
        isCorrect: wasCorrect,
        answeredAt: nowIso()
      };
      upsertQuestionStat(question.id, wasCorrect, answer);
      deriveReadiness();
      saveState();
      return {
        isCorrect: wasCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
    },

    next: function () {
      var session = this.getSession();
      if (!session) {
        return;
      }
      session.cursor = Math.min(session.cursor + 1, session.questionIds.length - 1);
      saveState();
    },

    previous: function () {
      var session = this.getSession();
      if (!session) {
        return;
      }
      session.cursor = Math.max(session.cursor - 1, 0);
      saveState();
    },

    jumpTo: function (index) {
      var session = this.getSession();
      if (!session) {
        return;
      }
      session.cursor = Math.max(0, Math.min(index, session.questionIds.length - 1));
      saveState();
    },

    finish: function () {
      var session = this.getSession();
      if (!session) {
        return null;
      }

      var total = session.questionIds.length;
      var answered = Object.keys(session.answers);
      var answeredCount = answered.length;
      var unansweredCount = Math.max(total - answeredCount, 0);
      var correct = answered.reduce(function (count, questionId) {
        return count + (session.answers[questionId].isCorrect ? 1 : 0);
      }, 0);
      var score = total ? Math.round((correct / total) * 100) : 0;
      var weakSkills = {};
      var skillBreakdown = {};
      var subjectBreakdown = {};

      session.questionIds.forEach(function (questionId) {
        var question = getQuestionById(questionId);
        var answer = session.answers[questionId];
        if (question) {
          if (!subjectBreakdown[question.subject]) {
            subjectBreakdown[question.subject] = {
              correct: 0,
              total: 0,
              answered: 0
            };
          }
          if (!skillBreakdown[question.skill]) {
            skillBreakdown[question.skill] = {
              correct: 0,
              total: 0
            };
          }
          subjectBreakdown[question.subject].total += 1;
          skillBreakdown[question.skill].total += 1;
          if (answer) {
            subjectBreakdown[question.subject].answered += 1;
          }
          if (answer && answer.isCorrect) {
            subjectBreakdown[question.subject].correct += 1;
            skillBreakdown[question.skill].correct += 1;
          }
        }
        if (question && answer && !answer.isCorrect) {
          weakSkills[question.skill] = (weakSkills[question.skill] || 0) + 1;
        }
      });

      var weakSkillList = Object.keys(weakSkills)
        .map(function (skill) {
          return {
            skill: skill,
            misses: weakSkills[skill]
          };
        })
        .sort(function (left, right) {
          return right.misses - left.misses;
        });

      var result = {
        id: session.id,
        title: session.title,
        mode: session.mode,
        subject: session.subject,
        score: score,
        correct: correct,
        answeredCount: answeredCount,
        unansweredCount: unansweredCount,
        total: total,
        completedAt: nowIso(),
        timeUsedSeconds: session.timerSeconds ? session.timerSeconds - (session.remainingSeconds || 0) : 0,
        weakSkills: weakSkillList,
        subjectBreakdown: Object.keys(subjectBreakdown).map(function (subjectId) {
          var stats = subjectBreakdown[subjectId];
          return {
            subject: subjectId,
            label: window.GEDData.catalog.subjectMeta[subjectId]
              ? window.GEDData.catalog.subjectMeta[subjectId].label
              : formatTypeLabel(subjectId),
            correct: stats.correct,
            total: stats.total,
            answered: stats.answered,
            accuracy: stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0
          };
        }),
        skillBreakdown: Object.keys(skillBreakdown).map(function (skill) {
          var stats = skillBreakdown[skill];
          return {
            skill: skill,
            correct: stats.correct,
            total: stats.total,
            accuracy: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0
          };
        })
      };

      if (!state.progress.subjectHistory[session.subject]) {
        state.progress.subjectHistory[session.subject] = [];
      }

      state.progress.subjectHistory[session.subject].push({
        date: result.completedAt,
        score: score,
        mode: session.mode
      });

      if (session.mode === "diagnostic") {
        state.progress.diagnosticHistory.unshift(result);
        state.progress.diagnosticHistory = state.progress.diagnosticHistory.slice(0, 20);
      } else {
        state.progress.practiceHistory.unshift(result);
        state.progress.practiceHistory = state.progress.practiceHistory.slice(0, 20);
      }

      result.skillBreakdown.forEach(function (item) {
        var historyKey = session.subject + "::" + item.skill;
        if (!state.progress.skillHistory[historyKey]) {
          state.progress.skillHistory[historyKey] = [];
        }
        state.progress.skillHistory[historyKey].push({
          date: result.completedAt,
          accuracy: item.accuracy,
          total: item.total,
          mode: session.mode
        });
        state.progress.skillHistory[historyKey] = state.progress.skillHistory[historyKey].slice(-12);
      });

      state.progress.lastSessionResult = result;
      state.sessions.activeQuiz = null;

      pushRecentActivity({
        type: "session-finish",
        title: session.title,
        detail: score + "% score"
      });
      deriveReadiness();
      saveState();
      return result;
    },

    buildPool: function (subject, filters) {
      filters = filters || {};
      return getQuestions(subject).filter(function (question) {
        var matchesDifficulty = filters.difficulty === "all" || !filters.difficulty || question.difficulty === filters.difficulty;
        var matchesSkill = filters.skill === "all" || !filters.skill || question.skill === filters.skill;
        var matchesType = filters.type === "all" || !filters.type || question.type === filters.type;
        var matchesMode = true;

        if (filters.mode === "bookmarked") {
          matchesMode = state.progress.bookmarks.indexOf(question.id) !== -1;
        }

        if (filters.mode === "wrongOnly") {
          matchesMode = state.progress.wrongQuestionIds.indexOf(question.id) !== -1;
        }

        return matchesDifficulty && matchesSkill && matchesType && matchesMode;
      });
    }
  };

  function renderNavigation() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-nav") === state.ui.activeSection);
    });

    var titleMap = {
      dashboard: "Dashboard",
      diagnostics: "Diagnostic Center",
      math: "Math",
      rla: "Reasoning Through Language Arts",
      science: "Science",
      socialStudies: "Social Studies",
      essayLab: "Essay Lab",
      practiceExams: "Practice Exams",
      progress: "Progress Tracker",
      studyPlan: "Study Plan",
      montana: "Montana GED Info"
    };

    appElements.workspaceTitle.textContent = titleMap[state.ui.activeSection] || "GED Prep Hub";
    appElements.activeSectionEyebrow.textContent = "Local GED study workspace";
  }

  function renderPanels() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-panel]"), function (panel) {
      panel.classList.toggle("is-visible", panel.getAttribute("data-panel") === state.ui.activeSection);
    });
    renderDashboard();
    renderDiagnostics();
    renderSubject("math");
    renderSubject("rla");
    renderSubject("science");
    renderSubject("socialStudies");
    renderProgress();
    renderEssayLab();
    renderPracticeExams();
    renderStudyPlans();
    renderMontanaInfo();
    renderInspector();
  }

  function renderDashboard() {
    deriveReadiness();
    var subjectIds = Object.keys(window.GEDData.catalog.subjectMeta);
    var questionCompletion = Math.round(
      subjectIds.reduce(function (sum, subject) {
        return sum + getSubjectSnapshot(subject).completion;
      }, 0) / Math.max(subjectIds.length, 1)
    );
    var diagnosticCoverage = Math.round((Math.min(state.progress.diagnosticHistory.length, subjectIds.length) / subjectIds.length) * 100);
    var essayProgress = Math.min(100, state.progress.essayHistory.length * 10);
    var overallCompletion = Math.round(questionCompletion * 0.65 + diagnosticCoverage * 0.2 + essayProgress * 0.15);
    var weakSkills = getWeakSkills(4);
    var recentScores = getRecentScores(5);
    var recommendation = getStudyRecommendation();
    var lastSession = state.progress.lastSessionResult;
    var activitySeries = getDailyStudySeries(10);
    var readinessDrivers = getReadinessDrivers();

    appElements.dashboardOverallProgress.textContent = overallCompletion + "%";
    appElements.dashboardNextStep.textContent = recommendation;
    appElements.dashboardLastScore.textContent = recentScores.length
      ? recentScores[0].score + "%"
      : "--";
    appElements.dashboardEssayCount.textContent = state.progress.essayHistory.length;
    appElements.timeChip.textContent = formatDuration(state.progress.studyTimeSeconds);
    appElements.streakChip.textContent = state.progress.studyStreak + " days";
    appElements.readinessPillValue.textContent = state.progress.readiness.label + " • " + state.progress.readiness.percent + "%";

    appElements.dashboardSubjectProgress.innerHTML = subjectIds
      .map(function (subject) {
        var meta = window.GEDData.catalog.subjectMeta[subject];
        var snapshot = getSubjectSnapshot(subject);
        var blend = Math.round(snapshot.completion * 0.5 + snapshot.accuracy * 0.5);
        return (
          '<div class="progress-row">' +
          "<strong>" +
          escapeHtml(meta.label) +
          "</strong>" +
          '<div class="progress-bar"><span class="progress-bar__fill" style="width:' +
          blend +
          '%"></span></div>' +
          '<span class="pill">' +
          snapshot.accuracy +
          "% accuracy</span>" +
          "</div>"
        );
      })
      .join("");

    appElements.dashboardPriorityPanel.innerHTML =
      '<article class="stack-item"><div class="stack-item__label">Recommended next step</div><strong>' +
      escapeHtml(recommendation) +
      "</strong></article>" +
      (lastSession
        ? '<article class="stack-item"><div class="stack-item__label">Last completed set</div><strong>' +
          escapeHtml(lastSession.title) +
          '</strong><div class="stack-item__meta">' +
          lastSession.score +
          "% score across " +
          lastSession.total +
          " questions</div></article>"
        : '<article class="stack-item"><div class="stack-item__label">Last completed set</div><strong>No completed set yet</strong><div class="stack-item__meta">Finish a diagnostic or practice set to see a score summary here.</div></article>') +
      (weakSkills.length
        ? weakSkills
            .map(function (item) {
              return (
                '<article class="stack-item"><div class="stack-item__label">Weak skill alert</div><strong>' +
                escapeHtml(item.skill) +
                '</strong><div class="stack-item__meta">' +
                escapeHtml(window.GEDData.catalog.subjectMeta[item.subject].label) +
                " at " +
                item.accuracy +
                "% accuracy across " +
                item.attempts +
                " attempts</div></article>"
              );
            })
            .join("")
        : '<article class="stack-item"><div class="stack-item__label">Weak skill alert</div><strong>No weak skills flagged yet</strong><div class="stack-item__meta">Complete a few questions and the dashboard will start surfacing priority areas.</div></article>');

    appElements.dashboardRecentActivity.innerHTML = state.progress.recentActivity.length
      ? state.progress.recentActivity
          .map(function (item) {
            return (
              '<article class="stack-item">' +
              '<div class="stack-item__label">' +
              escapeHtml(item.type.replace(/-/g, " ")) +
              "</div>" +
              "<strong>" +
              escapeHtml(item.title) +
              "</strong>" +
              '<div class="stack-item__meta">' +
              escapeHtml(item.detail || "Saved locally") +
              "</div>" +
              "</article>"
            );
          })
          .join("")
      : '<div class="empty-state">No activity yet. Starting a diagnostic or practice set will begin filling this timeline.</div>';

    appElements.dashboardRecentScores.innerHTML = recentScores.length
      ? recentScores
          .map(function (entry) {
            return (
              '<article class="stack-item"><div class="stack-item__label">' +
              escapeHtml(entry.mode || "practice") +
              "</div><strong>" +
              escapeHtml(entry.title) +
              '</strong><div class="stack-item__meta">' +
              entry.score +
              "% on " +
              entry.total +
              " questions</div></article>"
            );
          })
          .join("")
      : '<div class="empty-state">Score history will appear after the first completed diagnostic or practice set.</div>';

    if (appElements.dashboardStudyActivity) {
      appElements.dashboardStudyActivity.innerHTML = buildActivityMarkup(activitySeries);
    }

    if (appElements.dashboardReadinessDrivers) {
      appElements.dashboardReadinessDrivers.innerHTML = readinessDrivers
        .map(function (driver) {
          return (
            '<article class="stack-item"><div class="stack-item__label">' +
            escapeHtml(driver.label) +
            "</div><strong>" +
            escapeHtml(driver.value) +
            '</strong><div class="stack-item__meta">' +
            escapeHtml(driver.detail) +
            "</div></article>"
          );
        })
        .join("");
    }
  }

  function renderDiagnostics() {
    var subjects = Object.keys(window.GEDData.catalog.subjectMeta);
    var priorityList = getSubjectPriorityList();

    appElements.diagnosticCards.innerHTML = subjects
      .map(function (subject) {
        var meta = window.GEDData.catalog.subjectMeta[subject];
        var latestDiagnostic = state.progress.diagnosticHistory.find(function (entry) {
          return entry.subject === subject;
        });
        var delta = getDiagnosticDelta(subject);
        return (
          '<article class="stat-block">' +
          '<span class="stat-block__label">' +
          escapeHtml(meta.label) +
          "</span>" +
          '<strong class="stat-block__value stat-block__value--small">8-question diagnostic</strong>' +
          '<span class="stat-block__detail">' +
          (latestDiagnostic
            ? "Latest baseline: " + latestDiagnostic.score + "%." + (delta !== null ? " Change from prior retake: " + (delta >= 0 ? "+" : "") + delta + " points." : "")
            : "Identify starting priorities and log a baseline score.") +
          "</span>" +
          '<div class="button-row" style="margin-top:14px;">' +
          '<button class="button button--primary" data-start-diagnostic="' +
          subject +
          '">Start</button>' +
          '<button class="button button--secondary" data-start-diagnostic-retake="' +
          subject +
          '">Retake</button>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    appElements.diagnosticSummary.innerHTML =
      state.progress.diagnosticHistory.length > 0
        ? state.progress.diagnosticHistory
            .slice(0, 3)
            .map(function (entry) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(window.GEDData.catalog.subjectMeta[entry.subject].label) +
                "</div><strong>" +
                entry.score +
                '% baseline</strong><div class="stack-item__meta">' +
                (entry.weakSkills && entry.weakSkills.length
                  ? "Most missed: " + escapeHtml(entry.weakSkills[0].skill)
                  : "No clear weak skill flagged yet.") +
                "</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Diagnostic summaries will appear here once a baseline check is complete.</div>';

    appElements.diagnosticStudyOrder.innerHTML = priorityList
      .map(function (item, index) {
        return (
          '<article class="stack-item"><div class="stack-item__label">Priority ' +
          (index + 1) +
          "</div><strong>" +
          escapeHtml(item.label) +
          '</strong><div class="stack-item__meta">' +
          "Urgency score " +
          item.urgency +
          ". Accuracy " +
          item.snapshot.accuracy +
          "%, completion " +
          item.snapshot.completion +
          "%." +
          (item.latestDiagnostic && item.latestDiagnostic.weakSkills && item.latestDiagnostic.weakSkills.length
            ? " Most missed skill: " + escapeHtml(item.latestDiagnostic.weakSkills[0].skill) + "."
            : "") +
          "</div></article>"
        );
      })
      .join("");

    appElements.diagnosticHistory.innerHTML = state.progress.diagnosticHistory.length
      ? state.progress.diagnosticHistory
          .map(function (entry) {
            var delta =
              state.progress.diagnosticHistory.find(function (item) {
                return item.subject === entry.subject;
              }) === entry
                ? getDiagnosticDelta(entry.subject)
                : null;
            return (
              '<article class="stack-item">' +
              '<div class="stack-item__label">' +
              escapeHtml(window.GEDData.catalog.subjectMeta[entry.subject].label) +
              "</div>" +
              "<strong>" +
              entry.score +
              "%</strong>" +
              '<div class="stack-item__meta">' +
              escapeHtml(new Date(entry.completedAt).toLocaleString()) +
              (delta !== null ? " | Latest change " + (delta >= 0 ? "+" : "") + delta + " points" : "") +
              "</div>" +
              "</article>"
            );
          })
          .join("")
      : '<div class="empty-state">Diagnostic history will appear here after the first baseline check.</div>';
  }

  function buildSubjectControls(subject) {
    var meta = window.GEDData.catalog.subjectMeta[subject];
    var catalog = window.GEDData.catalog.index[subject];
    var filterState = state.ui.filters[subject];
    var typeOptions = [{ value: "all", label: "All types" }].concat(
      Object.keys(catalog.types)
        .map(function (type) {
          return { value: type, label: formatTypeLabel(type) };
        })
    );
    return (
      '<div class="controls-panel">' +
      '<label class="field"><span class="label">Difficulty</span><select data-filter-subject="' +
      subject +
      '" data-filter-key="difficulty">' +
      buildSelectOptions(
        [
          { value: "all", label: "All levels" },
          { value: "foundation", label: "Foundation" },
          { value: "standard", label: "GED Standard" },
          { value: "stretch", label: "College Readiness Stretch" }
        ],
        filterState.difficulty
      ) +
      "</select></label>" +
      '<label class="field"><span class="label">Skill</span><select data-filter-subject="' +
      subject +
      '" data-filter-key="skill">' +
      buildSelectOptions(
        [{ value: "all", label: "All skills" }].concat(
          meta.skills.map(function (skill) {
            return { value: skill, label: skill };
          })
        ),
        filterState.skill
      ) +
      "</select></label>" +
      '<label class="field"><span class="label">Question type</span><select data-filter-subject="' +
      subject +
      '" data-filter-key="type">' +
      buildSelectOptions(typeOptions, filterState.type) +
      "</select></label>" +
      '<label class="field"><span class="label">Mode</span><select data-filter-subject="' +
      subject +
      '" data-filter-key="mode">' +
      buildSelectOptions(
        [
          { value: "all", label: "All questions" },
          { value: "bookmarked", label: "Bookmarked" },
          { value: "wrongOnly", label: "Wrong answers" }
        ],
        filterState.mode
      ) +
      "</select></label>" +
      '<div class="field"><span class="label">Quick actions</span><div class="button-row"><button class="button button--primary" data-start-subject="' +
      subject +
      '">Start set</button><button class="button button--secondary" data-resume-subject="' +
      subject +
      '">Resume</button><button class="button button--secondary" data-subject-mode="' +
      subject +
      '" data-subject-mode-value="wrongOnly">Retake wrong</button><button class="button button--secondary" data-subject-mode="' +
      subject +
      '" data-subject-mode-value="bookmarked">Bookmarks</button></div></div>' +
      '<div class="field"><span class="label">Focus</span><div class="subject-summary"><div class="stack-item__meta">' +
      catalog.total +
      " questions | Foundation " +
      catalog.difficulties.foundation +
      " | Standard " +
      catalog.difficulties.standard +
      " | Stretch " +
      catalog.difficulties.stretch +
      "</div></div></div>" +
      "</div>"
    );
  }

  function buildActivityMarkup(series) {
    var highest = series.reduce(function (max, item) {
      return Math.max(max, item.seconds);
    }, 0);

    return (
      '<div class="activity-chart">' +
      series
        .map(function (item) {
          var height = item.seconds ? Math.max(14, Math.round((item.seconds / Math.max(highest, 1)) * 100)) : 6;
          return (
            '<div class="activity-bar"><div class="activity-bar__value">' +
            item.minutes +
            'm</div><div class="activity-bar__track"><span class="activity-bar__column" style="height:' +
            height +
            '%"></span></div><div class="activity-bar__label">' +
            escapeHtml(item.label) +
            '</div><div class="activity-bar__sub">' +
            escapeHtml(item.shortLabel) +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function buildSubjectCoverageMarkup(subject) {
    var meta = window.GEDData.catalog.subjectMeta[subject];
    return (
      '<div class="surface"><div class="surface__header"><div><h4>Question bank coverage</h4><p>' +
      escapeHtml(meta.summary || "Coverage map") +
      '</p></div><span class="pill">' +
      window.GEDData.catalog.index[subject].total +
      " questions</span></div>" +
      getSubjectCoverage(subject)
        .map(function (domain) {
          return (
            '<section class="coverage-domain"><div class="coverage-domain__header"><div><h5>' +
            escapeHtml(domain.title) +
            '</h5><p>' +
            escapeHtml(domain.focus) +
            '</p></div><span class="pill">' +
            domain.totalQuestions +
            " questions</span></div><div class=\"coverage-list\">" +
            domain.skills
              .map(function (item) {
                return (
                  '<article class="coverage-row"><div class="coverage-row__main"><div class="stack-item__label">' +
                  escapeHtml(item.skill) +
                  "</div><strong>" +
                  escapeHtml(item.skill) +
                  '</strong><div class="stack-item__meta">' +
                  item.total +
                  " questions | " +
                  item.completion +
                  "% completed | " +
                  item.accuracy +
                  "% accuracy" +
                  (item.queued ? " | " + item.queued + " still in wrong-answer review" : "") +
                  "</div><div class=\"meta-line\"><span class=\"pill\">F " +
                  item.difficulties.foundation +
                  '</span><span class="pill">S ' +
                  item.difficulties.standard +
                  '</span><span class="pill">T ' +
                  item.difficulties.stretch +
                  "</span>" +
                  (item.typesLabel ? '<span class="pill">' + escapeHtml(item.typesLabel) + "</span>" : "") +
                  '</div></div><div class="button-row"><button class="button button--secondary" data-start-skill-practice-subject="' +
                  subject +
                  '" data-start-skill-practice-skill="' +
                  escapeHtml(item.skill) +
                  '">Practice skill</button></div></article>'
                );
              })
              .join("") +
            "</div></section>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function buildSubjectQueueMarkup(subject) {
    var wrongQueue = getQuestionReviewQueue("wrong", 4, subject);
    var bookmarks = getQuestionReviewQueue("bookmarks", 4, subject);

    function buildQueueItems(items, emptyText) {
      if (!items.length) {
        return '<div class="empty-state">' + escapeHtml(emptyText) + "</div>";
      }

      return (
        '<div class="stack-list">' +
        items
          .map(function (item) {
            return (
              '<article class="stack-item"><div class="stack-item__label">' +
              escapeHtml(item.skill) +
              "</div><strong>" +
              escapeHtml(item.prompt.slice(0, 120)) +
              '</strong><div class="stack-item__meta">' +
              item.accuracy +
              "% accuracy across " +
              item.attempts +
              " attempts" +
              (item.lastSelectedAnswer ? " | Last answer: " + escapeHtml(item.lastSelectedAnswer) : "") +
              "</div></article>"
            );
          })
          .join("") +
        "</div>"
      );
    }

    return (
      '<div class="two-up">' +
      '<div class="surface"><div class="surface__header"><h4>Wrong-answer queue</h4><p>Use this queue to turn misses into targeted review instead of repeated guessing.</p></div><div class="button-row" style="margin-bottom:16px;"><button class="button button--secondary" data-subject-mode="' +
      subject +
      '" data-subject-mode-value="wrongOnly">Retake missed in ' +
      escapeHtml(window.GEDData.catalog.subjectMeta[subject].label) +
      "</button></div>" +
      buildQueueItems(wrongQueue, "No missed questions are waiting in this subject right now.") +
      "</div>" +
      '<div class="surface"><div class="surface__header"><h4>Bookmarks in this subject</h4><p>Saved questions stay visible so review can stay deliberate and cumulative.</p></div><div class="button-row" style="margin-bottom:16px;"><button class="button button--secondary" data-subject-mode="' +
      subject +
      '" data-subject-mode-value="bookmarked">Open bookmarked set</button></div>' +
      buildQueueItems(bookmarks, "No bookmarked questions yet in this subject.") +
      "</div></div>"
    );
  }

  function buildChoiceMarkup(question, selectedAnswer) {
    return (question.choices || [])
      .map(function (choice) {
        var choiceClass = "choice";
        if (selectedAnswer) {
          if (choice === question.correctAnswer) {
            choiceClass += " is-correct";
          } else if (choice === selectedAnswer) {
            choiceClass += " is-incorrect";
          }
        }
        return (
          '<label class="' +
          choiceClass +
          '">' +
          '<input type="radio" name="choice-' +
          question.id +
          '" value="' +
          escapeHtml(choice) +
          '"' +
          (selectedAnswer === choice ? " checked" : "") +
          " />" +
          "<span>" +
          escapeHtml(choice) +
          "</span></label>"
        );
      })
      .join("");
  }

  function buildSessionNavigator(session) {
    return (
      '<div class="question-nav">' +
      session.questionIds
        .map(function (questionId, index) {
          var answer = session.answers[questionId];
          var className = "question-nav__btn";
          if (index === session.cursor) {
            className += " is-current";
          }
          if (answer) {
            className += answer.isCorrect ? " is-correct" : " is-incorrect";
          }
          return (
            '<button class="' +
            className +
            '" data-jump-question="' +
            index +
            '">' +
            (index + 1) +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function buildSubjectReferenceMarkup(subject) {
    if (subject === "math") {
      return (
        '<div class="surface"><div class="surface__header"><h4>Math reference</h4><p>Use these formulas and reminders while working through problem sets.</p></div><div class="stack-list">' +
        (window.GEDData.references.math.formulas || [])
          .map(function (formula) {
            return '<article class="stack-item"><strong>' + escapeHtml(formula) + "</strong></article>";
          })
          .join("") +
        '<article class="stack-item"><div class="stack-item__label">Calculator practice</div><strong>Use no-calculator sets to strengthen number sense, then use calculator-allowed sets for multi-step application.</strong></article></div></div>'
      );
    }

    if (subject === "rla") {
      return '<div class="surface"><div class="surface__header"><h4>RLA focus guide</h4><p>Read like a test taker: claim, evidence, tone, and revision choices all matter.</p></div><div class="stack-list"><article class="stack-item"><strong>Main idea first, then evidence.</strong><div class="stack-item__meta">Before choosing an answer, name the passage purpose in your own words.</div></article><article class="stack-item"><strong>For editing questions, prefer clarity over wordiness.</strong><div class="stack-item__meta">Professional, direct wording usually beats vague or repetitive sentences.</div></article></div></div>';
    }

    if (subject === "science") {
      return '<div class="surface"><div class="surface__header"><h4>Science reasoning guide</h4><p>Track the variable, control, and evidence before deciding what the data supports.</p></div><div class="stack-list"><article class="stack-item"><strong>Do not overclaim.</strong><div class="stack-item__meta">Choose the conclusion that matches the evidence shown, not the biggest statement possible.</div></article><article class="stack-item"><strong>Repeated trials improve reliability.</strong><div class="stack-item__meta">A single result matters less than the pattern across multiple trials.</div></article></div></div>';
    }

    if (subject === "socialStudies") {
      return '<div class="surface"><div class="surface__header"><h4>Social Studies guide</h4><p>Watch for level of government, type of source, and the historical or civic idea behind the example.</p></div><div class="stack-list"><article class="stack-item"><strong>Ask who created the source and when.</strong><div class="stack-item__meta">That quickly helps separate primary from secondary sources.</div></article><article class="stack-item"><strong>Connect examples to bigger systems.</strong><div class="stack-item__meta">Many questions test whether you can move from one fact to a broader principle such as federalism or checks and balances.</div></article></div></div>';
    }

    return "";
  }

  function buildSessionMarkup(session, question, options) {
    var passage = question.passageId ? getPassageById(question.passageId) : null;
    var answerRecord = session.answers[question.id];
    var timerPill =
      options && options.showTimer && session.timerSeconds
        ? '<span class="pill">' + formatCountdown(session.remainingSeconds || 0) + "</span>"
        : "";

    return (
      (passage
        ? '<article class="passage-card"><div class="meta-line"><span class="pill">' +
          escapeHtml(passage.type || "passage") +
          "</span></div><h4>" +
          escapeHtml(passage.title) +
          "</h4><p>" +
          escapeHtml(passage.text) +
          "</p></article>"
        : "") +
      '<article class="question-card">' +
      '<div class="question-card__header"><div class="meta-line"><span class="pill">' +
      escapeHtml(question.skill) +
      '</span><span class="pill">' +
      escapeHtml(formatTypeLabel(question.type)) +
      '</span><span class="pill">' +
      escapeHtml(window.GEDData.catalog.difficultyLabels[question.difficulty] || question.difficulty) +
      '</span><span class="pill">' +
      (question.calculatorAllowed ? "Calculator allowed" : "No calculator") +
      "</span>" +
      timerPill +
      '</div><button class="button button--secondary" data-bookmark-question="' +
      question.id +
      '">' +
      (state.progress.bookmarks.indexOf(question.id) === -1 ? "Bookmark" : "Bookmarked") +
      "</button></div>" +
      '<div class="question-card__body"><h4>' +
      escapeHtml(question.prompt) +
      "</h4>" +
      buildSessionNavigator(session) +
      '<div class="choices">' +
      buildChoiceMarkup(question, answerRecord && answerRecord.answer) +
      "</div>" +
      (answerRecord
        ? '<div class="explanation-box"><strong>' +
          (answerRecord.isCorrect ? "Correct. " : "Not quite. ") +
          "</strong>" +
          escapeHtml(question.explanation) +
          "</div>"
        : "") +
      "</div>" +
      '<div class="question-card__footer"><div class="meta-line"><span class="pill">Question ' +
      (session.cursor + 1) +
      " of " +
      session.questionIds.length +
      '</span></div><div class="button-row"><button class="button button--secondary" data-quiz-nav="prev">Previous</button><button class="button button--primary" data-submit-question>Submit answer</button><button class="button button--secondary" data-quiz-nav="next">Next</button><button class="button button--secondary" data-finish-session>Finish set</button></div></div>' +
      "</article>"
    );
  }

  function renderSubject(subject) {
    var controlsTarget = document.getElementById(subject + "-controls");
    var workspaceTarget = document.getElementById(subject + "-workspace");
    controlsTarget.innerHTML = buildSubjectControls(subject);

    var session = state.sessions.activeQuiz;
    var question = session && session.subject === subject ? quizEngine.getCurrentQuestion() : null;
    var filterState = state.ui.filters[subject];
    var pool = quizEngine.buildPool(subject, filterState);
    var lastResult = state.progress.lastSessionResult;
    var subjectLabel = window.GEDData.catalog.subjectMeta[subject].label;

    if (!question) {
      var difficultyPerformance = getDifficultyPerformance(subject);
      workspaceTarget.innerHTML =
        buildSubjectReferenceMarkup(subject) +
        (lastResult && lastResult.subject === subject
          ? '<div class="surface"><div class="surface__header"><h4>Latest ' +
            escapeHtml(subjectLabel) +
            ' result</h4><p>This summary stays visible after the set ends so you can act on it.</p></div><div class="stack-list"><article class="stack-item"><div class="stack-item__label">' +
            escapeHtml(lastResult.mode) +
            "</div><strong>" +
            lastResult.score +
            "% score</strong><div class=\"stack-item__meta\">" +
            "Correct answers: " +
            lastResult.correct +
            " of " +
            lastResult.total +
            "</div></article>" +
            (lastResult.weakSkills && lastResult.weakSkills.length
              ? '<article class="stack-item"><div class="stack-item__label">Most missed skill</div><strong>' +
                escapeHtml(lastResult.weakSkills[0].skill) +
                '</strong><div class="stack-item__meta">' +
                lastResult.weakSkills[0].misses +
                " misses in the latest set</div></article>"
              : "") +
            "</div></div>"
          : "") +
        '<div class="surface">' +
        '<div class="surface__header"><h4>Ready to study</h4><p>Select filters, then start a practice set for this subject. The bank summary below shows how deep the current build already is.</p></div>' +
        '<div class="meta-line"><span class="pill">' +
        pool.length +
        ' available questions</span><span class="pill">' +
        getSubjectSnapshot(subject).answered +
        " answered so far</span><span class=\"pill\">" +
        getSubjectSnapshot(subject).accuracy +
        '% accuracy</span></div><div class="stack-list" style="margin-top:16px;"><article class="stack-item"><div class="stack-item__label">Difficulty coverage</div><strong>' +
        escapeHtml(difficultyPerformance.foundation.label) +
        ": " +
        difficultyPerformance.foundation.total +
        " | " +
        escapeHtml(difficultyPerformance.standard.label) +
        ": " +
        difficultyPerformance.standard.total +
        " | " +
        escapeHtml(difficultyPerformance.stretch.label) +
        ": " +
        difficultyPerformance.stretch.total +
        '</strong><div class="stack-item__meta">Use the filters above to stay at foundation, work at GED standard, or push into stretch readiness.</div></article></div></div>' +
        buildSubjectCoverageMarkup(subject) +
        buildSubjectQueueMarkup(subject);
      return;
    }

    workspaceTarget.innerHTML = buildSubjectReferenceMarkup(subject) + buildSessionMarkup(session, question);
  }

  function renderProgress() {
    var weakSkills = getWeakSkills(6);
    var mostMissed = getMostMissedSkills(6);
    var mastery = getMasterySnapshot(8);
    var recentScores = getRecentScores(6);
    var timeAllocation = getTimeAllocation(6);
    var activitySeries = getDailyStudySeries(14);
    var difficultyPerformance = getDifficultyPerformance();
    var wrongQueue = getQuestionReviewQueue("wrong", 6);
    var bookmarks = getQuestionReviewQueue("bookmarks", 6);
    var subjectRows = Object.keys(window.GEDData.catalog.subjectMeta)
      .map(function (subject) {
        var meta = window.GEDData.catalog.subjectMeta[subject];
        var snapshot = getSubjectSnapshot(subject);
        var improvement = getSubjectImprovement(subject);
        return (
          '<div class="chart-row"><strong>' +
          escapeHtml(meta.label) +
          '</strong><div class="chart-bar"><div class="chart-bar__fill" style="width:' +
          snapshot.accuracy +
          '%"></div></div><span>' +
          snapshot.accuracy +
          "%</span></div>" +
          (improvement
            ? '<div class="stack-item__meta">Change: ' + (improvement.delta >= 0 ? "+" : "") + improvement.delta + " points</div>"
            : '<div class="stack-item__meta">Need 2 scored sets for trend</div>')
        );
      })
      .join("");

    appElements.progressRoot.innerHTML =
      '<div class="stats-grid">' +
      '<article class="stat-block"><span class="stat-block__label">Quizzes completed</span><strong class="stat-block__value">' +
      state.progress.practiceHistory.length +
      "</strong></article>" +
      '<article class="stat-block"><span class="stat-block__label">Diagnostics completed</span><strong class="stat-block__value">' +
      state.progress.diagnosticHistory.length +
      "</strong></article>" +
      '<article class="stat-block"><span class="stat-block__label">Essays completed</span><strong class="stat-block__value">' +
      state.progress.essayHistory.length +
      "</strong></article>" +
      '<article class="stat-block"><span class="stat-block__label">Last visited section</span><strong class="stat-block__value stat-block__value--small">' +
      escapeHtml(state.ui.lastVisitedSection) +
      "</strong></article>" +
      "</div>" +
      '<div class="two-up">' +
      '<div class="surface"><div class="surface__header"><h4>Accuracy by subject</h4><p>Placeholder visuals are already wired to live question results.</p></div><div class="chart">' +
      subjectRows +
      "</div></div>" +
      '<div class="surface"><div class="surface__header"><h4>Current study state</h4><p>These values are saved locally and update the moment a session is submitted.</p></div><div class="stack-list">' +
      '<article class="stack-item"><div class="stack-item__label">Bookmarks</div><strong>' +
      state.progress.bookmarks.length +
      "</strong></article>" +
      '<article class="stack-item"><div class="stack-item__label">Wrong-answer queue</div><strong>' +
      state.progress.wrongQuestionIds.length +
      "</strong></article>" +
      '<article class="stack-item"><div class="stack-item__label">Practice sessions</div><strong>' +
      state.progress.practiceHistory.length +
      "</strong></article>" +
      '<article class="stack-item"><div class="stack-item__label">Readiness</div><strong>' +
      escapeHtml(state.progress.readiness.label) +
      '</strong><div class="stack-item__meta">' +
      state.progress.readiness.percent +
      "% composite estimate</div></article>" +
      "</div></div></div>" +
      '<div class="two-up" style="margin-top:18px;">' +
      '<div class="surface"><div class="surface__header"><h4>Study activity by day</h4><p>Visible routine matters. These bars show the last two weeks of tracked study time.</p></div>' +
      buildActivityMarkup(activitySeries) +
      "</div>" +
      '<div class="surface"><div class="surface__header"><h4>Performance by difficulty</h4><p>Use this to see whether performance is staying at one level or growing across all three.</p></div><div class="stack-list">' +
      Object.keys(difficultyPerformance)
        .map(function (level) {
          var bucket = difficultyPerformance[level];
          return (
            '<article class="stack-item"><div class="stack-item__label">' +
            escapeHtml(bucket.label) +
            "</div><strong>" +
            bucket.accuracy +
            '% accuracy</strong><div class="stack-item__meta">' +
            bucket.completion +
            "% of this level touched | " +
            bucket.answered +
            " of " +
            bucket.total +
            " questions answered</div></article>"
          );
        })
        .join("") +
      "</div></div></div>" +
      '<div class="two-up" style="margin-top:18px;">' +
      '<div class="surface"><div class="surface__header"><h4>Weak skills</h4><p>Lowest-performing skills rise to the top as soon as there is enough evidence.</p></div><div class="stack-list">' +
      (weakSkills.length
        ? weakSkills
            .map(function (item) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(window.GEDData.catalog.subjectMeta[item.subject].label) +
                "</div><strong>" +
                escapeHtml(item.skill) +
                '</strong><div class="stack-item__meta">' +
                item.accuracy +
                "% accuracy over " +
                item.attempts +
                " attempts</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Weak-skill alerts will appear after more questions are answered.</div>') +
      "</div></div>" +
      '<div class="surface"><div class="surface__header"><h4>Recent score trend</h4><p>Diagnostics and practice sets are combined here in time order.</p></div><div class="stack-list">' +
      (recentScores.length
        ? recentScores
            .map(function (entry) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(entry.mode || "practice") +
                "</div><strong>" +
                escapeHtml(entry.title) +
                '</strong><div class="stack-item__meta">' +
                entry.score +
                "% score on " +
                entry.total +
                " questions</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Recent score trend will appear after a completed diagnostic or practice set.</div>') +
      "</div></div></div>" +
      '<div class="two-up" style="margin-top:18px;">' +
      '<div class="surface"><div class="surface__header"><h4>Most-missed categories</h4><p>These skills are costing the most points overall.</p></div><div class="stack-list">' +
      (mostMissed.length
        ? mostMissed
            .map(function (item) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(window.GEDData.catalog.subjectMeta[item.subject] ? window.GEDData.catalog.subjectMeta[item.subject].label : item.subject) +
                "</div><strong>" +
                escapeHtml(item.skill) +
                '</strong><div class="stack-item__meta">' +
                item.missed +
                " misses across " +
                item.attempts +
                " attempts</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Most-missed categories will appear after more work is completed.</div>') +
      "</div></div>" +
      '<div class="surface"><div class="surface__header"><h4>Time allocation</h4><p>Study time is tracked by section so you can see where the hours are going.</p></div><div class="stack-list">' +
      (timeAllocation.length
        ? timeAllocation
            .map(function (item) {
              var percent = Math.round((item.seconds / Math.max(state.progress.studyTimeSeconds, 1)) * 100);
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(item.label) +
                "</div><strong>" +
                formatDuration(item.seconds) +
                '</strong><div class="stack-item__meta">' +
                percent +
                "% of tracked time</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Time allocation will appear after more time is spent in subject sections.</div>') +
      "</div></div></div>" +
      '<div class="two-up" style="margin-top:18px;">' +
      '<div class="surface"><div class="surface__header"><h4>Wrong-answer review queue</h4><p>These are the exact questions still dragging performance down.</p></div><div class="stack-list">' +
      (wrongQueue.length
        ? wrongQueue
            .map(function (item) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(item.subjectLabel) +
                " | " +
                escapeHtml(item.skill) +
                "</div><strong>" +
                escapeHtml(item.prompt.slice(0, 130)) +
                '</strong><div class="stack-item__meta">' +
                item.accuracy +
                "% accuracy over " +
                item.attempts +
                " attempts | Correct answer: " +
                escapeHtml(item.correctAnswer) +
                "</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">The wrong-answer queue is clear right now.</div>') +
      "</div></div>" +
      '<div class="surface"><div class="surface__header"><h4>Bookmarks queue</h4><p>Bookmarked questions create a second review lane for things worth returning to on purpose.</p></div><div class="stack-list">' +
      (bookmarks.length
        ? bookmarks
            .map(function (item) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(item.subjectLabel) +
                " | " +
                escapeHtml(item.skill) +
                "</div><strong>" +
                escapeHtml(item.prompt.slice(0, 130)) +
                '</strong><div class="stack-item__meta">' +
                "Latest accuracy: " +
                item.accuracy +
                "% across " +
                item.attempts +
                " attempts</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Bookmarked questions will appear here once questions start being saved.</div>') +
      "</div></div></div>" +
      '<div class="surface" style="margin-top:18px;"><div class="surface__header"><h4>Skill mastery table</h4><p>Top skills by current measured accuracy.</p></div><div class="stack-list">' +
      (mastery.length
        ? mastery
            .map(function (item) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(window.GEDData.catalog.subjectMeta[item.subject] ? window.GEDData.catalog.subjectMeta[item.subject].label : item.subject) +
                "</div><strong>" +
                escapeHtml(item.skill) +
                '</strong><div class="stack-item__meta">' +
                item.accuracy +
                "% accuracy over " +
                item.attempts +
                " attempts</div></article>"
              );
            })
            .join("")
        : '<div class="empty-state">Skill mastery will populate once enough questions have been answered to establish patterns.</div>') +
      "</div></div></div>";
  }

  function renderEssayLab() {
    var selectedEssay = getSelectedEssay();
    var draft = selectedEssay ? getEssayDraft(selectedEssay.id) : null;
    var modelResponses = (window.GEDData.essays || []).filter(function (essay) {
      return !!essay.modelResponse;
    });

    if (!selectedEssay) {
      appElements.essayLabRoot.innerHTML = '<div class="empty-state">Essay prompts could not be loaded.</div>';
      return;
    }

    appElements.essayLabRoot.innerHTML =
      '<div class="stats-grid">' +
      '<article class="stat-block"><span class="stat-block__label">Essay prompts</span><strong class="stat-block__value">' +
      window.GEDData.essays.length +
      "</strong></article>" +
      '<article class="stat-block"><span class="stat-block__label">Completed essays</span><strong class="stat-block__value">' +
      state.progress.essayHistory.length +
      "</strong></article>" +
      '<article class="stat-block"><span class="stat-block__label">Model responses</span><strong class="stat-block__value">' +
      modelResponses.length +
      "</strong></article>" +
      '<article class="stat-block"><span class="stat-block__label">Selected prompt</span><strong class="stat-block__value stat-block__value--small">' +
      escapeHtml(selectedEssay.title) +
      "</strong></article>" +
      "</div>" +
      '<div class="two-up">' +
      '<div class="surface"><div class="surface__header"><h4>Prompt workspace</h4><p>Build the claim, note evidence, and draft in one place.</p></div>' +
      '<label class="field"><span class="label">Choose a prompt</span><select data-essay-select>' +
      buildSelectOptions(
        window.GEDData.essays.map(function (essay) {
          return { value: essay.id, label: essay.title };
        }),
        selectedEssay.id
      ) +
      "</select></label>" +
      '<div class="stack-list" style="margin-top:16px;"><article class="stack-item"><div class="stack-item__label">Passage A</div><strong>' +
      escapeHtml(selectedEssay.passageA) +
      '</strong></article><article class="stack-item"><div class="stack-item__label">Passage B</div><strong>' +
      escapeHtml(selectedEssay.passageB) +
      '</strong></article></div>' +
      '<div class="field" style="margin-top:16px;"><span class="label">Thesis</span><textarea data-essay-field="thesis">' +
      escapeHtml(draft.thesis) +
      '</textarea></div><div class="field"><span class="label">Evidence from Passage A</span><textarea data-essay-field="evidenceA">' +
      escapeHtml(draft.evidenceA) +
      '</textarea></div><div class="field"><span class="label">Evidence from Passage B</span><textarea data-essay-field="evidenceB">' +
      escapeHtml(draft.evidenceB) +
      '</textarea></div><div class="field"><span class="label">Planner / outline</span><textarea data-essay-field="outline">' +
      escapeHtml(draft.outline) +
      '</textarea></div><div class="field"><span class="label">Draft</span><textarea data-essay-field="draft">' +
      escapeHtml(draft.draft) +
      '</textarea></div><div class="button-row"><button class="button button--primary" data-save-essay>Save draft</button><button class="button button--secondary" data-complete-essay>Mark complete</button></div></div>' +
      '<div class="surface"><div class="surface__header"><h4>Essay tools</h4><p>Use these supports to stay focused on evidence and structure.</p></div><div class="stack-list">' +
      '<article class="stack-item"><div class="stack-item__label">Sample thesis</div><strong>' +
      escapeHtml(selectedEssay.sampleThesis || "") +
      '</strong></article><article class="stack-item"><div class="stack-item__label">Thesis builder</div><strong>' +
      escapeHtml((window.GEDData.essayExamples.thesisFrames || [])[0] || "") +
      '</strong><div class="stack-item__meta">' +
      escapeHtml((window.GEDData.essayExamples.thesisFrames || [])[1] || "") +
      "</div></article>" +
      '<article class="stack-item"><div class="stack-item__label">Evidence checklist</div><div class="button-row"><label><input type="checkbox" data-essay-check="claim"' +
      (draft.checklist.claim ? " checked" : "") +
      ' /> Clear claim</label><label><input type="checkbox" data-essay-check="passageA"' +
      (draft.checklist.passageA ? " checked" : "") +
      ' /> Passage A evidence</label><label><input type="checkbox" data-essay-check="passageB"' +
      (draft.checklist.passageB ? " checked" : "") +
      ' /> Passage B evidence</label><label><input type="checkbox" data-essay-check="explanation"' +
      (draft.checklist.explanation ? " checked" : "") +
      ' /> Explanation</label></div></article>' +
      '<article class="stack-item"><div class="stack-item__label">Rubric self-score</div><div class="button-row"><label>Analysis <select data-rubric-key="analysis"><option value="0"' +
      (draft.rubric.analysis === "0" ? " selected" : "") +
      '>0</option><option value="1"' +
      (draft.rubric.analysis === "1" ? " selected" : "") +
      '>1</option><option value="2"' +
      (draft.rubric.analysis === "2" ? " selected" : "") +
      '">2</option></select></label><label>Evidence <select data-rubric-key="evidence"><option value="0"' +
      (draft.rubric.evidence === "0" ? " selected" : "") +
      '>0</option><option value="1"' +
      (draft.rubric.evidence === "1" ? " selected" : "") +
      '>1</option><option value="2"' +
      (draft.rubric.evidence === "2" ? " selected" : "") +
      '">2</option></select></label><label>Organization <select data-rubric-key="organization"><option value="0"' +
      (draft.rubric.organization === "0" ? " selected" : "") +
      '>0</option><option value="1"' +
      (draft.rubric.organization === "1" ? " selected" : "") +
      '>1</option><option value="2"' +
      (draft.rubric.organization === "2" ? " selected" : "") +
      '">2</option></select></label><label>Clarity <select data-rubric-key="clarity"><option value="0"' +
      (draft.rubric.clarity === "0" ? " selected" : "") +
      '>0</option><option value="1"' +
      (draft.rubric.clarity === "1" ? " selected" : "") +
      '>1</option><option value="2"' +
      (draft.rubric.clarity === "2" ? " selected" : "") +
      '">2</option></select></label></div></article>' +
      '<article class="stack-item"><div class="stack-item__label">Strong vs weak example</div><strong>' +
      escapeHtml(window.GEDData.essayExamples.strongVsWeak[0].strong) +
      '</strong><div class="stack-item__meta">' +
      escapeHtml(window.GEDData.essayExamples.strongVsWeak[0].weak) +
      "</div></article></div></div></div>" +
      '<div class="surface" style="margin-top:18px;"><div class="surface__header"><h4>Strong vs weak comparisons</h4><p>Study the difference between evidence-driven writing and thin responses.</p></div><div class="stack-list">' +
      (window.GEDData.essayExamples.strongVsWeak || [])
        .map(function (example) {
          return (
            '<article class="stack-item"><div class="stack-item__label">' +
            escapeHtml(example.title) +
            '</div><strong>Strong:</strong><div class="stack-item__meta">' +
            escapeHtml(example.strong) +
            '</div><strong style="margin-top:10px; display:block;">Weak:</strong><div class="stack-item__meta">' +
            escapeHtml(example.weak) +
            '</div><div class="stack-item__meta"><em>' +
            escapeHtml(example.lesson) +
            "</em></div></article>"
          );
        })
        .join("") +
      "</div></div>" +
      '<div class="surface" style="margin-top:18px;"><div class="surface__header"><h4>Model responses</h4><p>Use the models to study structure, evidence, and tone.</p></div><div class="stack-list">' +
      modelResponses
        .slice(0, 4)
        .map(function (essay) {
          return (
            '<article class="stack-item"><div class="stack-item__label">' +
            escapeHtml(essay.title) +
            "</div><strong>" +
            escapeHtml(essay.modelResponse) +
            "</strong></article>"
          );
        })
        .join("") +
      "</div></div>";
  }

  function renderPracticeExams() {
    var session = state.sessions.activeQuiz;
    var activeExam = session && session.mode === "exam" ? session : null;
    var lastExam = state.progress.lastSessionResult && state.progress.lastSessionResult.mode === "exam" ? state.progress.lastSessionResult : null;

    if (!activeExam) {
      appElements.examCenterRoot.innerHTML =
        '<div class="three-up">' +
        EXAM_PRESETS.map(function (preset) {
          return (
            '<article class="stat-block"><span class="stat-block__label">' +
            escapeHtml(preset.title) +
            "</span><strong class=\"stat-block__value stat-block__value--small\">" +
            preset.count +
            " questions</strong><span class=\"stat-block__detail\">" +
            preset.minutes +
            " minutes</span><div class=\"button-row\" style=\"margin-top:14px;\"><button class=\"button button--primary\" data-start-exam=\"" +
            preset.id +
            '">Start exam</button></div></article>'
          );
        }).join("") +
        "</div>" +
        (lastExam
          ? '<div class="two-up" style="margin-top:18px;"><div class="surface"><div class="surface__header"><h4>Last exam report</h4><p>Saved automatically after every completed exam.</p></div><div class="stack-list"><article class="stack-item"><div class="stack-item__label">' +
            escapeHtml(lastExam.title) +
            "</div><strong>" +
            lastExam.score +
            '% overall</strong><div class="stack-item__meta">' +
            lastExam.correct +
            " correct out of " +
            lastExam.total +
            " questions | " +
            lastExam.unansweredCount +
            " unanswered</div></article><article class=\"stack-item\"><div class=\"stack-item__label\">Time used</div><strong>" +
            formatDuration(lastExam.timeUsedSeconds || 0) +
            '</strong><div class="stack-item__meta">Open the progress tracker for broader trends after a timed test.</div></article></div><div class="button-row" style="margin-top:16px;"><button class="button button--secondary" data-nav="progress">Open progress tracker</button></div></div>' +
            '<div class="surface"><div class="surface__header"><h4>Breakdown</h4><p>Use this to spot whether a mixed test was dragged down by one subject or one skill family.</p></div><div class="stack-list">' +
            (lastExam.subjectBreakdown && lastExam.subjectBreakdown.length
              ? lastExam.subjectBreakdown
                  .map(function (item) {
                    return (
                      '<article class="stack-item"><div class="stack-item__label">' +
                      escapeHtml(item.label) +
                      "</div><strong>" +
                      item.accuracy +
                      '% accuracy</strong><div class="stack-item__meta">' +
                      item.answered +
                      " answered out of " +
                      item.total +
                      " questions</div></article>"
                    );
                  })
                  .join("")
              : lastExam.skillBreakdown
                  .slice(0, 4)
                  .map(function (item) {
                    return (
                      '<article class="stack-item"><div class="stack-item__label">' +
                      escapeHtml(item.skill) +
                      "</div><strong>" +
                      item.accuracy +
                      '% accuracy</strong><div class="stack-item__meta">' +
                      item.correct +
                      " correct out of " +
                      item.total +
                      "</div></article>"
                    );
                  })
                  .join("")) +
            '</div></div></div><div class="surface" style="margin-top:18px;"><div class="surface__header"><h4>Weak-skill notes</h4><p>Review the misses before taking another timed set.</p></div><div class="stack-list">' +
            ((lastExam.weakSkills && lastExam.weakSkills.length
              ? lastExam.weakSkills
                  .slice(0, 6)
                  .map(function (item) {
                    return (
                      '<article class="stack-item"><div class="stack-item__label">Missed skill</div><strong>' +
                      escapeHtml(item.skill) +
                      '</strong><div class="stack-item__meta">' +
                      item.misses +
                      " misses in the latest exam</div></article>"
                    );
                  })
                  .join("")
              : '<div class="empty-state">No weak-skill note was generated for this exam.</div>') +
              "</div></div>")
          : '<div class="empty-state" style="margin-top:18px;">Complete a timed mini test or full mock exam to see a score report here.</div>');
      return;
    }

    var currentQuestion = quizEngine.getCurrentQuestion();
    appElements.examCenterRoot.innerHTML =
      '<div class="surface"><div class="surface__header"><h4>' +
      escapeHtml(activeExam.title) +
      '</h4><p>Timer is live. The exam will auto-submit when time expires.</p></div><div class="meta-line"><span class="pill">' +
      formatCountdown(activeExam.remainingSeconds) +
      '</span><span class="pill">' +
      activeExam.questionIds.length +
      " questions</span></div></div>" +
      (currentQuestion ? buildSessionMarkup(activeExam, currentQuestion, { showTimer: true }) : '<div class="empty-state">No exam questions are available.</div>');
  }

  function renderStudyPlans() {
    appElements.studyPlanRoot.innerHTML = (window.GEDData.studyPlans || [])
      .map(function (plan) {
        return (
          '<div class="surface" style="margin-bottom:18px;"><div class="surface__header"><h4>' +
          escapeHtml(plan.title) +
          '</h4><p>' +
          escapeHtml(plan.summary) +
          '</p></div><div class="stack-list">' +
          plan.days
            .map(function (day) {
              return (
                '<article class="stack-item"><div class="stack-item__label">' +
                escapeHtml(day.label) +
                "</div><strong>" +
                escapeHtml(day.focus) +
                '</strong><div class="stack-item__meta">' +
                day.minutes +
                " minutes | " +
                escapeHtml(day.practice) +
                " | Review: " +
                escapeHtml(day.review) +
                "</div></article>"
              );
            })
            .join("") +
          "</div></div>"
        );
      })
      .join("");
  }

  function renderMontanaInfo() {
    appElements.montanaRoot.innerHTML =
      '<div class="three-up"><article class="stat-block"><span class="stat-block__label">Recognition</span><strong class="stat-block__value stat-block__value--small">GED and HiSET</strong><span class="stat-block__detail">Montana recognizes GED and HiSET as high school equivalency options.</span></article>' +
      '<article class="stat-block"><span class="stat-block__label">Official account setup</span><strong class="stat-block__value stat-block__value--small">Use the official GED website</strong><span class="stat-block__detail">Use the official GED site for account setup, official practice, and scheduling information.</span></article>' +
      '<article class="stat-block"><span class="stat-block__label">Local support</span><strong class="stat-block__value stat-block__value--small">Helena Adult Learning Center</strong><span class="stat-block__detail">Helena Adult Learning Center supports adult education and HiSET preparation.</span></article></div>' +
      '<div class="surface" style="margin-top:18px;"><div class="surface__header"><h4>Important reminder</h4><p>Testing rules, schedules, fees, and locations can change.</p></div><div class="stack-list"><article class="stack-item"><div class="stack-item__label">Verify details</div><strong>Always confirm current testing and scheduling details with official sources before registering.</strong></article><article class="stack-item"><div class="stack-item__label">Study use</div><strong>This local course is for preparation and confidence building, not official registration.</strong></article></div></div>';
  }

  function renderInspector() {
    appElements.inspectorSession.innerHTML = state.sessions.activeQuiz
      ? '<article class="stack-item"><div class="stack-item__label">' +
        escapeHtml(state.sessions.activeQuiz.subject) +
        '</div><strong>' +
        escapeHtml(state.sessions.activeQuiz.title) +
        '</strong><div class="stack-item__meta">Question ' +
        (state.sessions.activeQuiz.cursor + 1) +
        " of " +
        state.sessions.activeQuiz.questionIds.length +
        "</div></article>"
      : '<div class="empty-state">No active session yet.</div>';

    appElements.inspectorBookmarks.innerHTML = state.progress.bookmarks.length
      ? state.progress.bookmarks
          .slice(0, 4)
          .map(function (questionId) {
            var question = getQuestionById(questionId);
            return (
              '<article class="stack-item"><div class="stack-item__label">' +
              escapeHtml(question.subject) +
              "</div><strong>" +
              escapeHtml(question.skill) +
              '</strong><div class="stack-item__meta">' +
              escapeHtml(question.prompt.slice(0, 90)) +
              "...</div></article>"
            );
          })
          .join("")
      : '<div class="empty-state">Bookmarked questions will appear here.</div>';

    var weakQuestions = state.progress.wrongQuestionIds
      .slice(0, 4)
      .map(getQuestionById)
      .filter(Boolean);

    appElements.inspectorPriorities.innerHTML = weakQuestions.length
      ? weakQuestions
          .map(function (question) {
            return (
              '<article class="stack-item"><div class="stack-item__label">' +
              escapeHtml(question.subject) +
              "</div><strong>" +
              escapeHtml(question.skill) +
              '</strong><div class="stack-item__meta">Recommended for retake</div></article>'
            );
          })
          .join("")
      : '<div class="empty-state">Priority skills will populate after missed questions.</div>';
  }

  function setActiveSection(sectionId) {
    state.ui.activeSection = sectionId;
    state.ui.lastVisitedSection = sectionId;
    saveState();
    renderNavigation();
    renderPanels();
  }

  function startSubjectSession(subject) {
    var filters = state.ui.filters[subject];
    var pool = quizEngine.buildPool(subject, filters);
    if (!pool.length) {
      alert("No questions match the current filters yet.");
      return;
    }
    quizEngine.createSession({
      title: window.GEDData.catalog.subjectMeta[subject].label + " practice",
      subject: subject,
      pool: pool
    });
    setActiveSection(subject);
  }

  function startDiagnostic(subject) {
    var pool = getQuestions(subject).slice(0, 8);
    quizEngine.createSession({
      title: window.GEDData.catalog.subjectMeta[subject].label + " diagnostic",
      subject: subject,
      mode: "diagnostic",
      pool: pool
    });
    setActiveSection(subject);
  }

  function startExamSession(presetId) {
    var preset = EXAM_PRESETS.find(function (item) {
      return item.id === presetId;
    });
    if (!preset) {
      return;
    }
    var pool;
    if (preset.subject === "mixed") {
      pool = [];
      var buckets = ["math", "rla", "science", "socialStudies", "mixed"].map(function (subject) {
        return getQuestions(subject === "mixed" ? null : subject).filter(function (question) {
          return subject === "mixed" ? question.subject === "mixed" : question.subject === subject;
        });
      });
      var index = 0;
      while (pool.length < preset.count) {
        var bucket = buckets[index % buckets.length];
        var item = bucket[Math.floor(index / buckets.length)];
        if (item) {
          pool.push(item);
        }
        index += 1;
        if (index > preset.count * buckets.length + 10) {
          break;
        }
      }
    } else {
      pool = getQuestions(preset.subject).slice(0, preset.count);
    }
    quizEngine.createSession({
      title: preset.title,
      subject: preset.subject,
      mode: "exam",
      pool: pool,
      timerSeconds: preset.minutes * 60,
      originSection: "practiceExams"
    });
    setActiveSection("practiceExams");
  }

  function saveEssayDraft(markComplete) {
    var essay = getSelectedEssay();
    if (!essay) {
      return;
    }
    var draft = getEssayDraft(essay.id);
    if (markComplete) {
      state.progress.essayHistory.unshift({
        id: essay.id + "-" + Date.now(),
        essayId: essay.id,
        title: essay.title,
        completedAt: nowIso(),
        rubricTotal:
          Number(draft.rubric.analysis) +
          Number(draft.rubric.evidence) +
          Number(draft.rubric.organization) +
          Number(draft.rubric.clarity)
      });
      state.progress.essayHistory = state.progress.essayHistory.slice(0, 20);
      pushRecentActivity({
        type: "essay-complete",
        title: essay.title,
        detail: "Essay marked complete"
      });
    } else {
      pushRecentActivity({
        type: "essay-save",
        title: essay.title,
        detail: "Draft saved locally"
      });
    }
    saveState();
    renderPanels();
  }

  function handleSubmitCurrentQuestion() {
    var question = quizEngine.getCurrentQuestion();
    if (!question) {
      return;
    }

    var selected = document.querySelector('input[name="choice-' + question.id + '"]:checked');
    if (!selected) {
      alert("Choose an answer before submitting.");
      return;
    }

    quizEngine.submitAnswer(selected.value);
    renderPanels();
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var navButton = event.target.closest("[data-nav]");
      if (navButton) {
        setActiveSection(navButton.getAttribute("data-nav"));
        return;
      }

      var startSubjectButton = event.target.closest("[data-start-subject]");
      if (startSubjectButton) {
        startSubjectSession(startSubjectButton.getAttribute("data-start-subject"));
        return;
      }

      var skillPracticeButton = event.target.closest("[data-start-skill-practice-subject]");
      if (skillPracticeButton) {
        var skillSubject = skillPracticeButton.getAttribute("data-start-skill-practice-subject");
        var skillName = skillPracticeButton.getAttribute("data-start-skill-practice-skill");
        state.ui.filters[skillSubject].skill = skillName;
        state.ui.filters[skillSubject].mode = "all";
        saveState();
        startSubjectSession(skillSubject);
        return;
      }

      var subjectModeButton = event.target.closest("[data-subject-mode]");
      if (subjectModeButton) {
        var modeSubject = subjectModeButton.getAttribute("data-subject-mode");
        state.ui.filters[modeSubject].mode = subjectModeButton.getAttribute("data-subject-mode-value");
        saveState();
        startSubjectSession(modeSubject);
        return;
      }

      var resumeButton = event.target.closest("[data-resume-subject]");
      if (resumeButton) {
        setActiveSection(resumeButton.getAttribute("data-resume-subject"));
        return;
      }

      var diagnosticButton = event.target.closest("[data-start-diagnostic]");
      if (diagnosticButton) {
        startDiagnostic(diagnosticButton.getAttribute("data-start-diagnostic"));
        return;
      }

      var examButton = event.target.closest("[data-start-exam]");
      if (examButton) {
        startExamSession(examButton.getAttribute("data-start-exam"));
        return;
      }

      var retakeDiagnosticButton = event.target.closest("[data-start-diagnostic-retake]");
      if (retakeDiagnosticButton) {
        startDiagnostic(retakeDiagnosticButton.getAttribute("data-start-diagnostic-retake"));
        return;
      }

      var submitButton = event.target.closest("[data-submit-question]");
      if (submitButton) {
        handleSubmitCurrentQuestion();
        return;
      }

      var finishButton = event.target.closest("[data-finish-session]");
      if (finishButton) {
        quizEngine.finish();
        renderPanels();
        return;
      }

      var bookmarkButton = event.target.closest("[data-bookmark-question]");
      if (bookmarkButton) {
        toggleBookmark(bookmarkButton.getAttribute("data-bookmark-question"));
        renderPanels();
        return;
      }

      if (event.target.closest("[data-save-essay]")) {
        saveEssayDraft(false);
        return;
      }

      if (event.target.closest("[data-complete-essay]")) {
        saveEssayDraft(true);
        return;
      }

      var navQuiz = event.target.closest("[data-quiz-nav]");
      if (navQuiz) {
        if (navQuiz.getAttribute("data-quiz-nav") === "prev") {
          quizEngine.previous();
        } else {
          quizEngine.next();
        }
        renderPanels();
        return;
      }

      var jumpButton = event.target.closest("[data-jump-question]");
      if (jumpButton) {
        quizEngine.jumpTo(Number(jumpButton.getAttribute("data-jump-question")));
        renderPanels();
      }
    });

    document.addEventListener("change", function (event) {
      var essaySelect = event.target.closest("[data-essay-select]");
      if (essaySelect) {
        state.ui.selectedEssayId = essaySelect.value;
        saveState();
        renderEssayLab();
        return;
      }

      var essayCheck = event.target.closest("[data-essay-check]");
      if (essayCheck) {
        getEssayDraft(state.ui.selectedEssayId).checklist[essayCheck.getAttribute("data-essay-check")] = essayCheck.checked;
        saveState();
        return;
      }

      var rubricSelect = event.target.closest("[data-rubric-key]");
      if (rubricSelect) {
        getEssayDraft(state.ui.selectedEssayId).rubric[rubricSelect.getAttribute("data-rubric-key")] = rubricSelect.value;
        saveState();
        return;
      }

      var filterControl = event.target.closest("[data-filter-subject]");
      if (filterControl) {
        var subject = filterControl.getAttribute("data-filter-subject");
        var key = filterControl.getAttribute("data-filter-key");
        state.ui.filters[subject][key] = filterControl.value;
        saveState();
        renderSubject(subject);
      }
    });

    document.addEventListener("input", function (event) {
      var essayField = event.target.closest("[data-essay-field]");
      if (essayField) {
        getEssayDraft(state.ui.selectedEssayId)[essayField.getAttribute("data-essay-field")] = essayField.value;
        saveState();
      }
    });

    appElements.resumeLastSession.addEventListener("click", function () {
      if (!state.sessions.activeQuiz) {
        alert("No saved session yet.");
        return;
      }
      setActiveSection(state.sessions.activeQuiz.subject || "dashboard");
    });
  }

  function startStudyClock() {
    setInterval(function () {
      if (document.hidden) {
        return;
      }
      recordStudyMinute();
      saveState();
      renderDashboard();
    }, AUTOSAVE_INTERVAL);
  }

  function startSessionTimer() {
    setInterval(function () {
      var session = state.sessions.activeQuiz;
      if (!session || !session.timerSeconds || session.mode !== "exam") {
        return;
      }
      session.remainingSeconds = Math.max(0, (session.remainingSeconds || 0) - 1);
      if (session.remainingSeconds === 0) {
        quizEngine.finish();
        renderPanels();
        return;
      }
      saveState();
      if (state.ui.activeSection === "practiceExams") {
        renderPracticeExams();
      }
    }, 1000);
  }

  function cacheElements() {
    appElements.workspaceTitle = document.getElementById("workspace-title");
    appElements.activeSectionEyebrow = document.getElementById("active-section-eyebrow");
    appElements.dashboardOverallProgress = document.getElementById("dashboard-overall-progress");
    appElements.dashboardNextStep = document.getElementById("dashboard-next-step");
    appElements.dashboardLastScore = document.getElementById("dashboard-last-score");
    appElements.dashboardEssayCount = document.getElementById("dashboard-essay-count");
    appElements.dashboardSubjectProgress = document.getElementById("dashboard-subject-progress");
    appElements.dashboardPriorityPanel = document.getElementById("dashboard-priority-panel");
    appElements.dashboardRecentActivity = document.getElementById("dashboard-recent-activity");
    appElements.dashboardRecentScores = document.getElementById("dashboard-recent-scores");
    appElements.dashboardStudyActivity = document.getElementById("dashboard-study-activity");
    appElements.dashboardReadinessDrivers = document.getElementById("dashboard-readiness-drivers");
    appElements.diagnosticCards = document.getElementById("diagnostic-cards");
    appElements.diagnosticSummary = document.getElementById("diagnostic-summary");
    appElements.diagnosticStudyOrder = document.getElementById("diagnostic-study-order");
    appElements.diagnosticHistory = document.getElementById("diagnostic-history");
    appElements.progressRoot = document.getElementById("progress-root");
    appElements.essayLabRoot = document.getElementById("essay-lab-root");
    appElements.examCenterRoot = document.getElementById("exam-center-root");
    appElements.studyPlanRoot = document.getElementById("study-plan-root");
    appElements.montanaRoot = document.getElementById("montana-root");
    appElements.inspectorSession = document.getElementById("inspector-session");
    appElements.inspectorBookmarks = document.getElementById("inspector-bookmarks");
    appElements.inspectorPriorities = document.getElementById("inspector-priorities");
    appElements.timeChip = document.getElementById("time-chip");
    appElements.streakChip = document.getElementById("streak-chip");
    appElements.readinessPillValue = document.getElementById("readiness-pill-value");
    appElements.resumeLastSession = document.getElementById("resume-last-session");
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupAccessGate();
  });
})();
