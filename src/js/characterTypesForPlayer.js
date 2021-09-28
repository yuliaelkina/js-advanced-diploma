import Character from './Character';

const characterTypesforPlayer = [
  class Bowman extends Character {
    constructor (level) {
      super(level, 'bowman');
      this.attack = 25;
      this.defence = 25;
    }
  },
  class Swordsman extends Character {
    constructor (level) {
      super(level, 'swordsman');
      this.attack = 40;
      this.defence = 10;
    }
  },
  class Magician extends Character {
    constructor (level) {
      super(level, 'magician');
      this.attack = 10;
      this.defence = 40;
    }
  }
]

export default characterTypesforPlayer;