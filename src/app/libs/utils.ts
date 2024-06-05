export function handleError(error: string) {
  alert(error);
};

export function compareIgnoreCase(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

export function containIgnoreCase(a: string, b: string) {
  return a.toLowerCase().includes(b.toLowerCase());
}