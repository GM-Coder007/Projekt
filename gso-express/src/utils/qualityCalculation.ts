const qualityTresholds = [
  [1, 1, 1],
  [2, 2, 2],
  [3, 3, 3],
  [4, 4, 4],
  [5, 5, 5],
  [6, 6, 6],
  [7, 7, 7],
  [8, 8, 8],
  [9, 9, 9],
  [10, 10, 10],
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
      quality++;
      console.log;
    }
  });

  return quality;
}
