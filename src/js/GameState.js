export default class GameState {
  constructor() {
    this.turn = 'user';
  }

  changeTurn() {
    if (this.turn === 'user') {
      this.turn = 'npc';
    } else {
      this.turn = 'user';
    }
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
