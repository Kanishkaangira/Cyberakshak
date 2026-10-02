// CyberAkshak chatbot client for React Native. No extra npm packages needed.
// Talks to the CyberAkshak API. Conversation state is kept in memory for the app session.
import { API_BASE_URL, API_KEY } from '../config/secrets';

let sessionId = null;
let convState = null; // signed token from the server; send it back with every message
let serverAwake = false;

const WARMUP_TIMEOUT_MS = 70000; // background wake-up of a sleeping free server (~1 minute)
const CHAT_TIMEOUT_MS = 25000;   // a chat call that takes longer falls back to your local answer

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Safe message shown if the server cannot be reached. Critical help still works offline.
function failure(kind) {
  return {
    ok: false,
    error: kind, // 'network' | 'timeout' | 'busy' | 'auth' | 'server'
    reply:
      kind === 'busy'
        ? 'Abhi bahut zyada log chat kar rahe hain. Thodi der baad dobara try karein.\n\nAgar aapke saath fraud hua hai aur paise gaye hain, to turant 1930 par call karein.'
        : 'Abhi server se connect nahi ho pa raha. Kripya thodi der baad dobara try karein.\n\nAgar aapke saath fraud hua hai, to der na karein: turant 1930 par call karein aur cybercrime.gov.in par shikayat darj karein.',
    actions: [
      { type: 'call', label: 'Call 1930', value: 'tel:1930' },
      { type: 'link', label: 'cybercrime.gov.in', value: 'https://cybercrime.gov.in' },
    ],
    chips: [],
    steps: [],
    urgent: false,
  };
}

/** Call when the chat screen opens. Wakes a sleeping server while the user is typing. */
export async function warmUp() {
  try {
    await fetchWithTimeout(`${API_BASE_URL}/health`, {}, WARMUP_TIMEOUT_MS);
    serverAwake = true;
  } catch (e) {
    /* ignore: sendMessage will retry */
  }
}

/** Start a fresh conversation (e.g. "New chat" button). */
export function resetChat() {
  sessionId = null;
  convState = null;
}

/**
 * Send one user message. Never throws.
 * Returns { ok, reply, actions, chips, steps, urgent, stage, scam, messageId, error? }
 *   reply   -> text for the bot bubble
 *   actions -> [{type:'call'|'link', label, value}] optional buttons (value = 'tel:1930' or a URL)
 *   chips   -> suggested quick replies (optional)
 * If ok is false, use your own local answer (see toBotMessage / ChatbotScreen changes).
 */
export async function sendMessage(text, language = null) {
  const body = JSON.stringify({ message: text, session_id: sessionId, state: convState, language });
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
    body,
  };
  const timeout = CHAT_TIMEOUT_MS;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/v1/chat`, options, timeout);
      if (res.status === 429) return failure('busy');
      if (res.status === 401) {
        console.warn('[chat] API key rejected (401). Check API_KEY in src/config/secrets.js');
        return failure('auth');
      }
      if (!res.ok) {
        if (res.status >= 500 && attempt === 0) {
          await sleep(1500);
          continue;
        }
        return failure('server');
      }
      const d = await res.json();
      sessionId = d.session_id || sessionId;
      convState = d.state || convState;
      serverAwake = true;
      return {
        ok: true,
        reply: d.reply,
        actions: d.quick_actions || [],
        chips: [...((d.question && d.question.chips) || []), ...(d.suggestions || [])],
        steps: d.steps || [],
        urgent: !!d.urgent,
        stage: d.stage,
        scam: d.scam,
        title: d.title,
        messageId: d.message_id,
      };
    } catch (e) {
      const timedOut = e && e.name === 'AbortError';
      if (timedOut) return failure('timeout'); // do not make the user wait twice
      if (attempt === 0) {
        await sleep(1500);
        continue;
      }
      return failure('network');
    }
  }
  return failure('network');
}

/** Optional: thumbs up/down. rating = 'up' | 'down'. Never throws. */
export async function sendFeedback(messageId, rating, comment = '') {
  try {
    await fetchWithTimeout(
      `${API_BASE_URL}/v1/feedback`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
        body: JSON.stringify({ session_id: sessionId, message_id: messageId, rating, comment }),
      },
      10000,
    );
  } catch (e) {
    /* ignore */
  }
}

/** Open an action button: 'tel:1930' opens the dialer, https links open the browser. */
export function openAction(action) {
  const { Linking } = require('react-native');
  return Linking.openURL(action.value);
}

/**
 * Converts an API result into the message fields your ChatbotScreen already renders:
 * { badge, badgeType, text, steps, helpline }.  Steps are already written inside `text`.
 */
export function toBotMessage(r) {
  let badge;
  let badgeType;
  if (r.stage === 'safety') {
    badge = 'Get help now';
    badgeType = 'red';
  } else if (r.stage === 'guide') {
    badge = r.title || 'Cyber fraud help';
    badgeType = r.urgent ? 'red' : 'orange';
  }
  const showHelpline = r.stage === 'safety' || r.stage === 'guide';
  return {
    badge,
    badgeType,
    text: r.reply,
    steps: [], // the reply text already contains the steps; avoids showing them twice
    helpline: showHelpline ? '1930' : undefined,
  };
}
