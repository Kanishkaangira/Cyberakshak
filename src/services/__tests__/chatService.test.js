import { resetChat, sendMessage } from '../chatService';

describe('sendMessage personal data handling', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetChat();
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        reply: 'Safe reply',
        quick_actions: [],
        question: { chips: [] },
        suggestions: [],
      }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('redacts email addresses and phone numbers without changing the API shape', async () => {
    await sendMessage('Email test@example.com or call +91 98765 43210.');

    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody).toEqual({
      message: 'Email [email] or call [phone].',
      session_id: null,
      state: null,
      language: null,
    });
  });
});
