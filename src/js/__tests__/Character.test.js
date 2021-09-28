import Character from '../Character';
import characterTypesforComp from '../characterTypesForComp';

test('создание персонажа', () => {
expect(new characterTypesforComp[0]).toBeDefined();
});

test('выброс ошибки при попытке создать Character', () => {
  expect(Character).toThrow();
});
