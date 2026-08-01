/**
 * Minimal Telegram Bot API client — just the two calls this module needs.
 * No library dependency (node-telegram-bot-api etc.) on purpose: the Bot
 * API is plain HTTPS + JSON, and pulling in a whole library for two
 * endpoints adds a dependency for no real benefit in a hackathon build.
 */
function apiBase() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in the environment.");
  }
  return `https://api.telegram.org/bot${token}`;
}

async function sendMessage(chatId, text) {
  const response = await fetch(`${apiBase()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      // No markdown parse_mode — command replies build plain text with
      // things like "_" in idea text, and Telegram's Markdown parser
      // throws a 400 on unescaped special characters rather than just
      // rendering them literally. Plain text is safer for a demo.
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    console.error(`[telegram] sendMessage failed (${response.status}): ${errText}`);
  }
}

/**
 * Long-polls Telegram for new updates. `timeoutSeconds` controls how long
 * Telegram holds the connection open waiting for a new message before
 * returning an empty result — this is what makes polling efficient instead
 * of hammering the API every second.
 */
async function getUpdates(offset, timeoutSeconds = 30) {
  const url = `${apiBase()}/getUpdates?offset=${offset}&timeout=${timeoutSeconds}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`getUpdates failed (${response.status}): ${errText}`);
  }
  const data = await response.json();
  return data.result || [];
}

module.exports = { sendMessage, getUpdates };