export default function randomPosition(allowedPositions = []) {
  return allowedPositions[Math.floor(Math.random() * allowedPositions.length)];
}
