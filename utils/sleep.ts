export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function simulateMinimumLoadingTime(ms) {
  return sleep(ms);
}
