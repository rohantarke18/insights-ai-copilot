const { startPolling, startReminderLoop } = require("./service");

/**
 * Starts the Telegram bot's polling + reminder loops. Safe to call
 * unconditionally from server.js — if TELEGRAM_BOT_TOKEN isn't set, this
 * just logs a notice and does nothing, rather than crashing the whole
 * backend for a feature that's optional.
 */
function startAgent() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log("[agent] TELEGRAM_BOT_TOKEN not set — Telegram bot disabled.");
    return;
  }
  // Intentionally not awaited: this is a long-running background loop,
  // not a one-off async task the server needs to wait on before serving
  // HTTP requests.
  startPolling();
  startReminderLoop();
}

module.exports = { startAgent };