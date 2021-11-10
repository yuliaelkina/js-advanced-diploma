export default class GameState {
  
  static turn = 'user';

  static changeTurn() {
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
