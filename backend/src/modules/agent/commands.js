const platformService = require("../platform/service");
const sessionsModel = require("../../db/models/sessions");
const plansModel = require("../../db/models/plans");

const HELP_TEXT = `iNSIGHTS Copilot Bot — commands:

/status — your dashboard stats + recent sessions
/latest — the plan for your most recently created idea
/help — show this message

Tip: run a new idea through the web app, then come back here and try /status.`;

function buildStartReply() {
  return `Welcome to your iNSIGHTS Research Copilot assistant!\n\nThis chat is now linked to your account. I can send you progress updates and let you check on your research from here.\n\n${HELP_TEXT}`;
}

function buildHelpReply() {
  return HELP_TEXT;
}

function buildStatusReply(userId) {
  const dashboard = platformService.getDashboard(userId);
  const { stats, sessions } = dashboard;

  const lines = [
    "📊 Your iNSIGHTS Dashboard",
    `Ideas Explored: ${stats.ideasExplored}`,
    `Sources Analyzed: ${stats.sourcesAnalyzed}`,
    `Plans Generated: ${stats.plansGenerated}`,
    "",
  ];

  if (sessions.length === 0) {
    lines.push("No sessions yet — submit an idea on the web app to get started.");
  } else {
    lines.push("Recent sessions:");
    sessions.slice(0, 5).forEach((s, i) => {
      lines.push(`${i + 1}. "${s.ideaText}" — ${s.status}`);
    });
  }

  return lines.join("\n");
}

function buildLatestReply(userId) {
  const sessions = sessionsModel.listSessionsByUser(userId);
  if (sessions.length === 0) {
    return "You haven't started any research sessions yet — submit an idea on the web app first.";
  }

  const latest = sessions[0]; // listSessionsByUser orders by created_at DESC
  const plan = plansModel.getPlan(latest.id);

  if (!plan) {
    return `Your most recent idea: "${latest.idea_text}"\nStatus: ${latest.status}\n\nNo project plan yet — open Project HUB on the web app to generate one.`;
  }

  const lines = [
    `📌 Latest idea: "${latest.idea_text}"`,
    "",
    "Architecture:",
    plan.architecture,
    "",
    "Tech stack:",
    ...plan.techStack.map((c) => `• ${c.category}: ${c.items.join(", ")}`),
  ];

  return lines.join("\n");
}

function buildUnknownReply() {
  return `I didn't recognize that command.\n\n${HELP_TEXT}`;
}

module.exports = {
  buildStartReply,
  buildHelpReply,
  buildStatusReply,
  buildLatestReply,
  buildUnknownReply,
};