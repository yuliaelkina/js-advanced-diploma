import Character from './Character';

const characterTypesforComp = [
  class Vampire extends Character {
    constructor (level) {
      super(level, 'vampire');
      this.attack = 25;
      this.defence = 25;
    }
  },
  class Undead extends Character {
    constructor (level) {
      super(level, 'undead');
      this.attack = 40;
      this.defence = 10;
    }
  },
  class Daemon extends Character {
    constructor (level) {
      super(level, 'daemon');
      this.attack = 10;
      this.defence = 40;
    }
  }
]

export default characterTypesforComp;