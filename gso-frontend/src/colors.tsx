// colors from 1 to 10 (red to green)
export default function getColor(quality: number) {
  switch (quality) {
    case 1:
      return "#ff0000";
    case 2:
      return "#ff4000";
    case 3:
      return "#ff8000";
    case 4:
      return "#ffbf00";
    case 5:
      return "#ffff00";
    case 6:
      return "#bfff00";
    case 7:
      return "#80ff00";
    case 8:
      return "#40ff00";
    case 9:
      return "#00ff00";
    case 10:
      return "#00ff40";
    default:
      return "#3c64c8";
  }
}
