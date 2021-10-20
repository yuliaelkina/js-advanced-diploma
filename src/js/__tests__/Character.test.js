/* eslint new-parens: 0 */
import Character from '../Character';
import Team from '../Team';

test('создание персонажа', () => {
  const team = new Team();
  expect(new team.npcTeams[0]).toBeDefined();
});

test('выброс ошибки при попытке создать Character', () => {
  expect(Character).toThrow();
});
