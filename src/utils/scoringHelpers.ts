export const calculatePoints = (
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number => {
  if (predictedHome === actualHome && predictedAway === actualAway) return 3;
  const predictedWinner = predictedHome > predictedAway ? "home" : predictedHome < predictedAway ? "away" : "draw";
  const actualWinner = actualHome > actualAway ? "home" : actualHome < actualAway ? "away" : "draw";
  return predictedWinner === actualWinner ? 1 : 0;
};