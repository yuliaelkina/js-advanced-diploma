import { calcTileType } from "../utils";

test ('получаем значения плиток для поля 6*6', () => {
  expect(calcTileType(0, 6)).toBe('top-left');
  expect(calcTileType(1, 6)).toBe('top');
  expect(calcTileType(3, 6)).toBe('top');
  expect(calcTileType(5, 6)).toBe('top-right');
  expect(calcTileType(6, 6)).toBe('left');
  expect(calcTileType(18, 6)).toBe('left');
  expect(calcTileType(24, 6)).toBe('left');
  expect(calcTileType(11, 6)).toBe('right');
  expect(calcTileType(17, 6)).toBe('right');
  expect(calcTileType(29, 6)).toBe('right');
  expect(calcTileType(30, 6)).toBe('bottom-left');
  expect(calcTileType(32, 6)).toBe('bottom');
  expect(calcTileType(35, 6)).toBe('bottom-right');
})