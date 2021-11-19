import avaiableMoves from '../avaiableMoves';

test('avaiable numbers', () => {
  expect(avaiableMoves.avaiableAttackfor2Cells[13].includes(15)).toBe(true);
  expect(avaiableMoves.avaiableMovesAndAttacksfor1Cell[36].includes(10)).toBe(false);
  expect(avaiableMoves.avaiableMovesfor4Cells[36].includes(22)).toBe(true);
});
