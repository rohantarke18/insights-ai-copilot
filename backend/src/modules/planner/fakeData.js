/**
 * DAY 1 ONLY — hardcoded stand-ins for the `sessions` and `sources` tables.
 * Field names deliberately match the real schema (idea_text, session_id,
 * snippet, etc.) so the Day 2 swap in service.js is a clean drop-in.
 *
 * DAY 2 TODO:
 *   Once /backend/src/db/schema.js is filled in and there's a shared DB
 *   connection module, replace fetchSessionData() in service.js with real
 *   queries against `sessions` and `sources`, e.g.:
 *     const session = await db.get("SELECT * FROM sessions WHERE id = ?", [sessionId]);
 *     const sources  = await db.all("SELECT * FROM sources WHERE session_id = ?", [sessionId]);
 *
 * Test with these sessionIds:
 *   GET /api/sessions/food-waste-demo/plan
 *   GET /api/sessions/traffic-demo/plan
 *   GET /api/sessions/cert-demo/plan
 */

const FAKE_SESSIONS = {
  "food-waste-demo": {
    id: "food-waste-demo",
    idea_text:
      "An AI-powered platform that helps households and restaurants reduce food waste by " +
      "predicting expiry dates from receipts/photos, suggesting recipes for soon-to-expire " +
      "ingredients, and connecting surplus food with local shelters or donation centers.",
    status: "processing",
    user_id: "U001",
  },
  "traffic-demo": {
    id: "traffic-demo",
    idea_text:
      "A smart traffic monitoring system using computer vision on existing CCTV feeds to " +
      "detect congestion, count vehicles, and dynamically adjust traffic signal timing in " +
      "real time, with a public dashboard showing live congestion heatmaps for a city.",
    status: "processing",
    user_id: "U001",
  },
  "cert-demo": {
    id: "cert-demo",
    idea_text:
      "A blockchain-based certificate verification system for universities to issue tamper-proof " +
      "digital degree certificates, allowing employers to instantly verify authenticity without " +
      "contacting the institution, using smart contracts and a public verification portal.",
    status: "processing",
    user_id: "U001",
  },
};

const FAKE_SOURCES = {
  "food-waste-demo": [
    { id: "SRC001", session_id: "food-waste-demo", type: "article", title: "USDA Food Waste FAQs", snippet: "Roughly 30-40% of the US food supply goes to waste, with households and restaurants as major contributors.", url: "https://example.com", citation_index: 1 },
    { id: "SRC002", session_id: "food-waste-demo", type: "api", title: "Too Good To Go API docs", snippet: "Third-party API for listing surplus food from restaurants at discounted prices.", url: "https://example.com", citation_index: 2 },
    { id: "SRC003", session_id: "food-waste-demo", type: "api", title: "Spoonacular API", snippet: "Recipe search API that accepts a list of ingredients and returns matching recipes.", url: "https://spoonacular.com/food-api", citation_index: 3 },
  ],
  "traffic-demo": [
    { id: "SRC004", session_id: "traffic-demo", type: "article", title: "OpenCV vehicle detection tutorial", snippet: "YOLO-based object detection is widely used for real-time vehicle counting on traffic camera feeds.", url: "https://example.com", citation_index: 1 },
    { id: "SRC005", session_id: "traffic-demo", type: "dataset", title: "City of LA open traffic signal data", snippet: "Public datasets exist for signal timing plans and historical congestion in major cities.", url: "https://example.com", citation_index: 2 },
    { id: "SRC006", session_id: "traffic-demo", type: "api", title: "Google Maps Traffic API", snippet: "Provides live traffic condition data useful for cross-validation of custom detection systems.", url: "https://example.com", citation_index: 3 },
  ],
  "cert-demo": [
    { id: "SRC007", session_id: "cert-demo", type: "article", title: "Ethereum ERC-721 / Soulbound tokens", snippet: "Non-transferable NFT standards are increasingly used to represent credentials that should not be resold.", url: "https://example.com", citation_index: 1 },
    { id: "SRC008", session_id: "cert-demo", type: "article", title: "IPFS for document storage", snippet: "Decentralized storage commonly paired with blockchain records to store the certificate file/hash off-chain.", url: "https://example.com", citation_index: 2 },
    { id: "SRC009", session_id: "cert-demo", type: "dataset", title: "W3C Verifiable Credentials spec", snippet: "An open standard for issuing and verifying digital credentials, interoperable across systems.", url: "https://example.com", citation_index: 3 },
  ],
};

function getFakeSession(sessionId) {
  return (
    FAKE_SESSIONS[sessionId] || {
      id: sessionId,
      idea_text: "A generic hackathon software project idea (no fake data configured for this sessionId).",
      status: "processing",
      user_id: "U001",
    }
  );
}

function getFakeSources(sessionId) {
  return FAKE_SOURCES[sessionId] || [];
}

module.exports = { getFakeSession, getFakeSources };
