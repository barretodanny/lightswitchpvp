const NUM_COLORS = 7;
const colors = ["Red", "Yellow", "Blue", "Green", "Orange", "Purple", "White"];

export function getRandomColor() {
  return colors[Math.floor(Math.random() * (NUM_COLORS - 1)) + 1];
}

export function getColorString(color: string) {
  const colorVal = parseInt(color);

  return colors[colorVal];
}
