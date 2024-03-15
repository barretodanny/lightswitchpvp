export function getColorString(color: string) {
  const colorVal = parseInt(color);

  switch (colorVal) {
    case 0:
      return "Red";
    case 1:
      return "Yellow";
    case 2:
      return "Blue";
    case 3:
      return "Green";
    case 4:
      return "Orange";
    case 5:
      return "Purple";
    case 6:
      return "White";
    default:
      break;
  }
}
