/**
 * Global Rate Limiter
 *
 * 여러 유저의 스캔 요청이 동시에 들어올 때
 * Etherscan / Blockscout API rate limit을 초과하지 않도록
 * 전역적으로 요청 속도를 제한한다.
 *
 * Etherscan free tier: 5 calls/sec
 * Blockscout: 보통 50 calls/sec (관대하지만 안전하게 제한)
 */

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private lastRefill: number;
  private queue: Array<() => void> = [];

  constructor(callsPerSecond: number) {
    this.maxTokens = callsPerSecond;
    this.tokens = callsPerSecond;
    this.refillRate = callsPerSecond;
    this.lastRefill = Date.now();
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  async wait(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // 토큰이 없으면 대기열에 추가
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
      this.scheduleNext();
    });
  }

  private scheduleNext() {
    if (this.queue.length === 0) return;

    const waitMs = Math.ceil((1 - this.tokens) / this.refillRate * 1000);

    setTimeout(() => {
      this.refill();
      while (this.tokens >= 1 && this.queue.length > 0) {
        this.tokens -= 1;
        const next = this.queue.shift();
        next?.();
      }

      if (this.queue.length > 0) {
        this.scheduleNext();
      }
    }, waitMs);
  }
}

/**
 * 재시도 로직
 * 네트워크 에러나 일시적 API 오류 시 자동 재시도
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  opts: { maxRetries?: number; delayMs?: number } = {},
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000 } = opts;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const backoff = delayMs * Math.pow(2, attempt);
      console.warn(
        `[rate-limiter] Retry ${attempt + 1}/${maxRetries} after ${backoff}ms`,
      );
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw new Error("Unreachable");
}

// 전역 rate limiter 인스턴스
// Etherscan free tier: 3 calls/sec (계정 단위, 모든 체인 합산)
// 여유분 고려해 2.5로 설정 (버스트 방지)
export const etherscanLimiter = new RateLimiter(2.5);

// Blockscout: IP 단위, 인스턴스별 독립 (5/sec without key, 10/sec with key)
// 여러 인스턴스에 분산되므로 인스턴스당 4로 설정
export const blockscoutLimiter = new RateLimiter(4);
