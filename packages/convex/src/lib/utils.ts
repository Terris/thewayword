// uppercases the first letter of every word in a string
export function toTitleCase(str?: string) {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

// moves an item in an array to the position before it
export function moveItemAtIndexOnePositionUp<T>(arr: T[], index: number): T[] {
  if (index === 0) return arr;
  const newArr = [...arr];
  const temp = newArr[index];
  newArr[index] = newArr[index - 1];
  newArr[index - 1] = temp;
  return newArr;
}

// moves an item in an array to the position after it
export function moveItemAtIndexOnePositionDown<T>(
  arr: T[],
  index: number
): T[] {
  if (index === arr.length - 1) return arr;
  const newArr = [...arr];
  const temp = newArr[index];
  newArr[index] = newArr[index + 1];
  newArr[index + 1] = temp;
  return newArr;
}
