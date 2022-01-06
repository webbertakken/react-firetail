export function pluralise(number: number, singular: string, plural: string): string {
  return number >= 2 ? plural : singular;
}
