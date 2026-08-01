const db = require("../connection");

function linkChat(chatId, userId) {
  db.prepare(
    `INSERT INTO telegram_links (chat_id, user_id, linked_at)
     VALUES (?, ?, ?)
     ON CONFLICT(chat_id) DO UPDATE SET user_id = excluded.user_id`
  ).run(String(chatId), userId, new Date().toISOString());
}

function getUserIdByChat(chatId) {
  const row = db
    .prepare(`SELECT user_id FROM telegram_links WHERE chat_id = ?`)
    .get(String(chatId));
  return row ? row.user_id : null;
}

function isLinked(chatId) {
  return getUserIdByChat(chatId) !== null;
}

function listAllChats() {
  return db.prepare(`SELECT chat_id, user_id FROM telegram_links`).all();
}

module.exports = { linkChat, getUserIdByChat, isLinked, listAllChats };