export function calculateImageOrientation({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  if (width > height) {
    return "landscape";
  } else if (height > width) {
    return "portrait";
  } else {
    return "square";
  }
}
