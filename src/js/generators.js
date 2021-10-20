/* eslint no-plusplus: 0 */
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import PositionedCharacter from './PositionedCharacter';
import randomPosition from './randomPosition';
import Bowman from './Bowman';

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const CharacterType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    yield new CharacterType(Math.floor(Math.random() * (maxLevel - 1)) + 1);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const positionedTeam = [];
  let allowedPositions;
  if (allowedTypes.indexOf(Bowman) !== -1) {
    allowedPositions = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
  } else {
    allowedPositions = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  }
  const generator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    const unit = new PositionedCharacter(generator.next().value, randomPosition(allowedPositions));
    positionedTeam.push(unit);
  }
  return positionedTeam;
}
