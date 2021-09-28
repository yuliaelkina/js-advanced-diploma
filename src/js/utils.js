/* eslint-disable no-plusplus */

export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  }
  if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index === boardSize * (boardSize - 1)) {
    return 'bottom-left';
  }
  if (index > 0 && index < boardSize - 1) {
    return 'top';
  }
  if (index > boardSize * (boardSize - 1) && index < boardSize ** 2 - 1) {
    return 'bottom';
  }
  const left = [];
  for (let i = 1; i < boardSize; i++) {
    left.push(boardSize * i);
  }
  const right = [];
  for (let i = 1; i < boardSize; i++) {
    right.push(boardSize * i - 1);
  }
  if (left.includes(index)) {
    return 'left';
  }
  if (right.includes(index)) {
    return 'right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
