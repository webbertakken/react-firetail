/**
 * Returns hostname in the form of
 *
 * Examples:
 *    https://www.example.com
 *    https://www.example.com:8080
 *
 * Todo - add compatibility with server
 */
export function useHostname() {
  const { protocol, host } = window.location;

  return `${protocol}//${host}`;
}
