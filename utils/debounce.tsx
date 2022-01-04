export function debounce(fn, timeout: number = 300) {
  let timer;

  return (...arguments_) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments_), timeout);
  };
}
