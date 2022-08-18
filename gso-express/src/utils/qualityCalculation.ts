const qualityTresholds = [
  [2, 2, 2],
  [4, 4, 4],
  [6, 6, 6],
  [8, 8, 8],
  [10, 10, 10],
  [12, 12, 12],
  [14, 14, 14],
  [16, 16, 16],
  [18, 18, 18],
  //[20, 20, 20],
];

export function calculateQuality(
  measurements: [[number, number, number]]
): number {
  let quality = 0;

  qualityTresholds.forEach((treshold) => {
    if (
      measurements[0][0] >= treshold[0] ||
      measurements[0][1] >= treshold[1] ||
      measurements[0][2] >= treshold[2]
    ) {
      quality--;
    }
  });

  return 10 + quality;
}
