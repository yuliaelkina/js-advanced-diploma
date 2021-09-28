/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const characterType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  return new characterType(Math.floor(Math.random() * maxLevel));
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  for (let i = 0; i < characterCount; i++) {
    characterGenerator(allowedTypes, maxLevel);
  }
}
