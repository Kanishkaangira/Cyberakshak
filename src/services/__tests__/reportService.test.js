import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { submitAnswerReport } from '../reportService';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(() => 'reports-collection'),
  serverTimestamp: jest.fn(() => 'server-timestamp'),
}));

jest.mock('../../../firebase', () => ({ db: 'firestore-db' }));

describe('submitAnswerReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a report with bounded text and a server timestamp', async () => {
    const botMessage = 'b'.repeat(2100);
    const userPrompt = 'u'.repeat(2100);

    await submitAnswerReport({
      messageId: 'bot-1',
      botMessage,
      userPrompt,
      reason: 'Wrong or misleading',
      details: 'Incorrect information',
    });

    expect(collection).toHaveBeenCalledWith('firestore-db', 'reports');
    expect(serverTimestamp).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith('reports-collection', {
      messageId: 'bot-1',
      botMessage: botMessage.slice(0, 2000),
      userPrompt: userPrompt.slice(0, 2000),
      reason: 'Wrong or misleading',
      details: 'Incorrect information',
      appVersion: '0.0.1',
      platform: 'android',
      createdAt: 'server-timestamp',
    });
  });

  it('does not add a user prompt when one is unavailable', async () => {
    await submitAnswerReport({
      messageId: 'bot-1',
      botMessage: 'Answer',
      reason: 'Other',
    });

    expect(addDoc.mock.calls[0][1]).not.toHaveProperty('userPrompt');
  });

  it('rejects a reason outside the available options', async () => {
    await expect(
      submitAnswerReport({
        messageId: 'bot-1',
        botMessage: 'Answer',
        reason: 'Invalid',
      }),
    ).rejects.toThrow('Choose a valid report reason.');
    expect(addDoc).not.toHaveBeenCalled();
  });
});
