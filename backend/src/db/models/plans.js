const db = require("../connection");

function savePlan(sessionId, plan) {
  db.prepare(
    `INSERT INTO plans (session_id, architecture, tech_stack_json, milestones_json, apis_json)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET
       architecture = excluded.architecture,
       tech_stack_json = excluded.tech_stack_json,
       milestones_json = excluded.milestones_json,
       apis_json = excluded.apis_json`
  ).run(
    sessionId,
    JSON.stringify(plan.architecture),   // ← fixed
    JSON.stringify(plan.techStack),
    JSON.stringify(plan.milestones),
    JSON.stringify(plan.apisAndDatasets)
  );
}

function getPlan(sessionId) {
  const row = db.prepare(`SELECT * FROM plans WHERE session_id = ?`).get(sessionId);
  if (!row) return null;
  return {
    sessionId,
    architecture: JSON.parse(row.architecture),   // ← fixed
    techStack: JSON.parse(row.tech_stack_json),
    milestones: JSON.parse(row.milestones_json),
    apisAndDatasets: JSON.parse(row.apis_json),
  };
}

function countPlansByUser(userId) {
  return db
    .prepare(
      `SELECT COUNT(*) as count FROM plans
       JOIN sessions ON plans.session_id = sessions.id
       WHERE sessions.user_id = ?`
    )
    .get(userId).count;
}

module.exports = { savePlan, getPlan, countPlansByUser };
