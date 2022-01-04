/**
 * Return 'loading' after a delay.
 *
 * Usage example:
 *    const result = await Promise.race([loadingDelay(250), otherAction]);
 *    if (result === 'loading') { setIsLoading(true); await otherAction; }
 */
export const loadingDelay = async (delayMs = 250) => {
  return new Promise((resolve) => setTimeout(() => resolve('loading'), delayMs));
};
