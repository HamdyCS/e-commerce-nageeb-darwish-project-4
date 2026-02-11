export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function stringSlice(text: string): string {
  return text.length > 12 ? `${text.slice(1, 12)}...` : text;
}
