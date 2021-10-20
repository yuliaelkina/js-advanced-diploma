import PositionedCharacter from '../PositionedCharacter';
import Daemon from '../Daemon';

test('Проверка подстановки значений в шаблон', () => {
  const daemon = new PositionedCharacter(new Daemon(3), 23);
  const message = `\uD83C\uDF96 ${daemon.character.level} \u2694 ${daemon.character.attack} \uD83D\uDEE1 ${daemon.character.defence} \u2764 ${daemon.character.health}`;
  expect(message).toBe('\uD83C\uDF96 3 \u2694 10 \uD83D\uDEE1 40 \u2764 50');
});
