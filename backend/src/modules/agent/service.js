const telegramClient = require("./telegramClient");
const commands = require("./commands");
const telegramLinksModel = require("../../db/models/telegramLinks");

// Single-user demo app (see DEFAULT_USER_ID in frontend/src/services/api.ts
// and the 'user-student-1' fallback throughout the backend controllers) —
// every chat that messages this bot is linked to that same demo user rather
// than building out real multi-tenant auth for a hackathon build.
const DEFAULT_USER_ID = "user-student-1";

function parseCommand(text) {
  const firstToken = text.trim().split(/\s+/)[0] || "";
  // Strip a leading "/" and a "@BotUsername" suffix Telegram appends to
  // commands sent in group chats, e.g. "/status@MyBot" -> "status".
  return firstToken.replace(/^\//, "").split("@")[0].toLowerCase();
}

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || "";
  const command = parseCommand(text);

  try {
    switch (command) {
      case "start":
        telegramLinksModel.linkChat(chatId, DEFAULT_USER_ID);
        await telegramClient.sendMessage(chatId, commands.buildStartReply());
        break;

      case "help":
        await telegramClient.sendMessage(chatId, commands.buildHelpReply());
        break;

      case "status": {
        const userId = telegramLinksModel.getUserIdByChat(chatId) || DEFAULT_USER_ID;
        await telegramClient.sendMessage(chatId, commands.buildStatusReply(userId));
        break;
      }

      case "latest": {
        const userId = telegramLinksModel.getUserIdByChat(chatId) || DEFAULT_USER_ID;
        await telegramClient.sendMessage(chatId, commands.buildLatestReply(userId));
        break;
      }

      default:
        await telegramClient.sendMessage(chatId, commands.buildUnknownReply());
    }
  } catch (err) {
    // A single bad command/DB hiccup should never take down the polling
    // loop — log it and tell the user something went wrong instead.
    console.error("[agent] handleMessage failed:", err);
    await telegramClient.sendMessage(
      chatId,
      "Something went wrong handling that — please try again in a moment."
    ).catch(() => {});
  }
}

let polling = false;

async function startPolling() {
  if (polling) return;
  polling = true;

  let offset = 0;
  console.log("[agent] Telegram bot polling started.");

  while (polling) {
    try {
      const updates = await telegramClient.getUpdates(offset);
      for (const update of updates) {
        offset = update.update_id + 1;
        if (update.message && update.message.text) {
          await handleMessage(update.message);
        }
      }
    } catch (err) {
      console.error("[agent] polling error, retrying in 5s:", err.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

function stopPolling() {
  polling = false;
}

/**
 * Periodically nudges every linked chat with a quick stats summary.
 * Interval is configurable via REMINDER_INTERVAL_HOURS (defaults to 24h)
 * so it's easy to shorten for a live demo.
 */
function startReminderLoop() {
  const hours = Number(process.env.REMINDER_INTERVAL_HOURS) || 24;
  const intervalMs = hours * 60 * 60 * 1000;

  setInterval(async () => {
    const chats = telegramLinksModel.listAllChats();
    for (const { chat_id, user_id } of chats) {
      try {
        const reply = "⏰ Progress check-in:\n\n" + commands.buildStatusReply(user_id);
        await telegramClient.sendMessage(chat_id, reply);
      } catch (err) {
        console.error(`[agent] reminder failed for chat ${chat_id}:`, err.message);
      }
    }
  }, intervalMs);

  console.log(`[agent] Reminder loop scheduled every ${hours}h.`);
}

module.exports = { handleMessage, startPolling, stopPolling, startReminderLoop, parseCommand };