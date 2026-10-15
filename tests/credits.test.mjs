import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

// Import the Vercel handler using Node's experimental TypeScript support
const { default: handler } = await import('../api/improve.ts');

/**
 * Creates a mock HTTP request and response for testing the serverless handler
 */
function createMockHttp({
  method = 'POST',
  headers = {},
  body = null,
  ip = '192.168.1.100',
} = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.headers = {
    'content-type': 'application/json',
    'x-forwarded-for': ip,
    ...headers,
  };
  req.socket = { remoteAddress: ip };
  req.body = body;

  let resolveResponse;
  const promise = new Promise((resolve) => {
    resolveResponse = resolve;
  });

  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    getHeader(key) {
      return this.headers[key.toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = JSON.stringify(data);
      resolveResponse({
        status: this.statusCode,
        headers: this.headers,
        data,
      });
    },
    end(chunk) {
      if (chunk) this.body = chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(this.body);
      } catch {
        parsed = this.body;
      }
      resolveResponse({
        status: this.statusCode,
        headers: this.headers,
        data: parsed,
      });
    },
  };

  return { req, res, waitForResponse: () => promise };
}

describe('Daily Free Credits (1,000 Credits) Test Suite', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test('1. Health check (GET /api/improve) returns 1,000 daily credit allowance', async () => {
    const { req, res, waitForResponse } = createMockHttp({
      method: 'GET',
      headers: {
        'x-client-id': 'test-client-health',
        'x-client-date': '2026-10-15',
      },
    });

    handler(req, res);
    const result = await waitForResponse();

    assert.equal(result.status, 200);
    assert.equal(result.data.status, 'ok');
    assert.equal(result.data.dailyCreditAllowance, 1000);
    assert.equal(result.data.credits.allowance, 1000);
    assert.equal(result.data.credits.remaining, 1000);
    assert.equal(result.data.credits.used, 0);
  });

  test('2. Successful Groq API prompt improvement deducts exactly 1 credit', async () => {
    process.env.GROQ_API_KEY = 'gsk_mock_test_key_abc123';
    process.env.GROQ_MODEL = 'openai/gpt-oss-120b';

    // Mock Groq API response
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: { overall: 92, clarity: 95, context: 90, specificity: 92, completeness: 91 },
                problems: ['Vague scope', 'Missing formatting'],
                improvedPrompt: 'Optimized production prompt for unit test.',
                whyBetter: ['Clear context', 'Enforced persona'],
                suggestions: ['Provide examples'],
              }),
            },
          },
        ],
      }),
    });

    const clientId = `test-client-success-${Date.now()}`;
    const date = '2026-10-15';

    // First request
    const { req: req1, res: res1, waitForResponse: wait1 } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '0',
      },
      body: { prompt: 'Write a python test suite', taskType: 'Coding' },
    });

    handler(req1, res1);
    const result1 = await wait1();

    assert.equal(result1.status, 200);
    assert.equal(result1.data.source, 'groq-api');
    assert.ok(result1.data.credits);
    assert.equal(result1.data.credits.allowance, 1000);
    assert.equal(result1.data.credits.used, 1, 'Exactly 1 credit should be deducted');
    assert.equal(result1.data.credits.remaining, 999, '999 credits should remain');

    // Second request with same client
    const { req: req2, res: res2, waitForResponse: wait2 } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '1',
      },
      body: { prompt: 'Write an email asking for feedback', taskType: 'Email' },
    });

    handler(req2, res2);
    const result2 = await wait2();

    assert.equal(result2.status, 200);
    assert.equal(result2.data.credits.used, 2, 'Cumulative deduction should be 2');
    assert.equal(result2.data.credits.remaining, 998, '998 credits should remain');
  });

  test('3. Failed requests, validation errors, and server errors deduct ZERO credits', async () => {
    process.env.GROQ_API_KEY = 'gsk_mock_test_key_abc123';
    const clientId = `test-client-failures-${Date.now()}`;
    const date = '2026-10-15';

    // 3a. Empty prompt validation failure (HTTP 400)
    const { req: reqEmpty, res: resEmpty, waitForResponse: waitEmpty } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '5',
      },
      body: { prompt: '   ' },
    });

    handler(reqEmpty, resEmpty);
    const resEmptyData = await waitEmpty();
    assert.equal(resEmptyData.status, 400);
    assert.equal(resEmptyData.data.error, 'INVALID_REQUEST');

    // 3b. Oversized prompt validation failure (>5000 chars) (HTTP 400)
    const { req: reqLong, res: resLong, waitForResponse: waitLong } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '5',
      },
      body: { prompt: 'a'.repeat(5001) },
    });

    handler(reqLong, resLong);
    const resLongData = await waitLong();
    assert.equal(resLongData.status, 400);
    assert.equal(resLongData.data.error, 'INVALID_REQUEST');

    // 3c. Upstream Groq API network/500 error triggers fallback with 0 credit deduction
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
      text: async () => 'Internal Groq Cloud error',
    });

    const { req: reqUpstream, res: resUpstream, waitForResponse: waitUpstream } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '5',
      },
      body: { prompt: 'Generate SQL query' },
    });

    handler(reqUpstream, resUpstream);
    const resUpstreamData = await waitUpstream();
    assert.equal(resUpstreamData.status, 200);
    assert.equal(resUpstreamData.data.source, 'rule-based-fallback');
    // Credit count must NOT be incremented because Groq failed
    assert.equal(resUpstreamData.data.credits.used, 5, 'Failed upstream request must not consume credit');
    assert.equal(resUpstreamData.data.credits.remaining, 995);
  });

  test('4. Server-side credit exhaustion (1,000/1,000) blocks requests with HTTP 429', async () => {
    const clientId = `test-client-exhausted-${Date.now()}`;
    const date = '2026-10-15';

    // Client reports or reaches 1000 credits used
    const { req, res, waitForResponse } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '1000',
      },
      body: { prompt: 'Can I have one more improvement?' },
    });

    handler(req, res);
    const result = await waitForResponse();

    assert.equal(result.status, 429, 'HTTP 429 must be returned when credits exhausted');
    assert.equal(result.data.error, 'CREDITS_EXHAUSTED');
    assert.ok(result.data.message.includes('1,000/1,000'));
    assert.equal(result.data.credits.allowance, 1000);
    assert.equal(result.data.credits.used, 1000);
    assert.equal(result.data.credits.remaining, 0);
  });

  test('5. Midnight local timezone reset restores 1,000 credits on new date', async () => {
    process.env.GROQ_API_KEY = 'gsk_mock_test_key_abc123';
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ score: { overall: 90 }, improvedPrompt: 'Test' }) } }],
      }),
    });

    const clientId = `test-client-midnight-${Date.now()}`;

    // Day 1: User exhausted all 1000 credits
    const { req: day1Req, res: day1Res, waitForResponse: day1Wait } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': '2026-10-15',
        'x-client-used': '1000',
      },
      body: { prompt: 'Prompt on Day 1' },
    });

    handler(day1Req, day1Res);
    const day1Result = await day1Wait();
    assert.equal(day1Result.status, 429, 'Day 1 exhausted');

    // Day 2 (Midnight has passed in user local timezone: date becomes 2026-10-16)
    const { req: day2Req, res: day2Res, waitForResponse: day2Wait } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': '2026-10-16',
        'x-client-used': '0',
      },
      body: { prompt: 'Fresh prompt on Day 2 after midnight' },
    });

    handler(day2Req, day2Res);
    const day2Result = await day2Wait();

    assert.equal(day2Result.status, 200, 'Day 2 request must succeed');
    assert.equal(day2Result.data.credits.allowance, 1000);
    assert.equal(day2Result.data.credits.used, 1, 'Only 1 credit used on the new day');
    assert.equal(day2Result.data.credits.remaining, 999, '999 credits remaining on new day');
  });

  test('6. Concurrent requests process properly without credit corruption', async () => {
    process.env.GROQ_API_KEY = 'gsk_mock_test_key_abc123';
    let delay = 10;
    globalThis.fetch = async () => {
      await new Promise((r) => setTimeout(r, delay));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify({ score: { overall: 88 }, improvedPrompt: 'Optimized' }) } }],
        }),
      };
    };

    const clientId = `test-client-concurrent-${Date.now()}`;
    const date = '2026-10-15';

    // Fire 5 concurrent requests from the same user
    const concurrentRequests = Array.from({ length: 5 }, (_, i) => {
      const { req, res, waitForResponse } = createMockHttp({
        method: 'POST',
        headers: {
          'x-client-id': clientId,
          'x-client-date': date,
          'x-client-used': '0',
        },
        body: { prompt: `Concurrent test prompt #${i}` },
      });
      handler(req, res);
      return waitForResponse();
    });

    const results = await Promise.all(concurrentRequests);

    // All 5 requests should succeed
    for (const res of results) {
      assert.equal(res.status, 200);
      assert.ok(res.data.credits.used >= 1 && res.data.credits.used <= 5);
      assert.equal(res.data.credits.allowance, 1000);
    }

    // A final request should reflect at least 5 used credits
    const { req: finalReq, res: finalRes, waitForResponse: finalWait } = createMockHttp({
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-date': date,
        'x-client-used': '5',
      },
      body: { prompt: 'Final verification after concurrent bursts' },
    });

    handler(finalReq, finalRes);
    const finalResult = await finalWait();
    assert.equal(finalResult.status, 200);
    assert.equal(finalResult.data.credits.used, 6);
    assert.equal(finalResult.data.credits.remaining, 994);
  });

  test('7. Manipulated arbitrary dates (e.g., 2099-12-31) are rejected and default to server date', async () => {
    const { req, res, waitForResponse } = createMockHttp({
      method: 'GET',
      headers: {
        'x-client-id': 'test-spoof-date-client',
        'x-client-date': '2099-12-31', // Future date attempt to bypass daily tracking
      },
    });

    handler(req, res);
    const result = await waitForResponse();

    assert.equal(result.status, 200);
    const today = new Date().toISOString().slice(0, 10);
    assert.equal(result.data.credits.userDate, today, 'Server must reject date >36h from UTC and default to today');
  });

  test('8. Rotating X-Client-Id on the same IP cannot bypass IP-level daily credit ceiling', async () => {
    const ip = '198.51.100.42';
    const date = new Date().toISOString().slice(0, 10);

    // First request with clientId-A succeeds and exhausts IP allowance
    const { req: reqA, res: resA, waitForResponse: waitA } = createMockHttp({
      method: 'POST',
      ip,
      headers: {
        'x-client-id': 'client-A',
        'x-client-date': date,
        'x-client-used': '1000',
      },
      body: { prompt: 'Initial prompt from client A' },
    });

    handler(reqA, resA);
    const resAData = await waitA();
    assert.equal(resAData.status, 429, 'Client A reaches limit');

    // Second request from same IP attempts to bypass limit by sending new client-B with used=0
    const { req: reqB, res: resB, waitForResponse: waitB } = createMockHttp({
      method: 'POST',
      ip,
      headers: {
        'x-client-id': 'client-B-spoofed',
        'x-client-date': date,
        'x-client-used': '0',
      },
      body: { prompt: 'Bypassing with fresh client-id' },
    });

    handler(reqB, resB);
    const resBData = await waitB();
    assert.equal(resBData.status, 429, 'Client B on same exhausted IP must still be blocked');
    assert.equal(resBData.data.error, 'CREDITS_EXHAUSTED');
  });
});
