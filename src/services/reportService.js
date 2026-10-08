import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { version as appVersion } from '../../package.json';
import { db } from '../../firebase';

export const REPORT_REASONS = [
  'Wrong or misleading',
  'Harmful or unsafe',
  'Offensive',
  'Not relevant',
  'Other',
];

export async function submitAnswerReport({
  messageId,
  botMessage,
  userPrompt,
  reason,
  details = '',
}) {
  if (!REPORT_REASONS.includes(reason)) {
    throw new Error('Choose a valid report reason.');
  }
  if (details.length > 300) {
    throw new Error('Report details must be 300 characters or fewer.');
  }

  const report = {
    messageId,
    botMessage: botMessage.slice(0, 2000),
    reason,
    details,
    appVersion,
    platform: 'android',
    createdAt: serverTimestamp(),
  };

  if (userPrompt) {
    report.userPrompt = userPrompt.slice(0, 2000);
  }

  await addDoc(collection(db, 'reports'), report);
}
