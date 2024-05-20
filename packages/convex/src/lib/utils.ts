// uppercases the first letter of every word in a string
export function toTitleCase(str?: string) {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

export function stringToSlug(string: string) {
  return string.toLowerCase().replace(/\s/g, "-");
}
