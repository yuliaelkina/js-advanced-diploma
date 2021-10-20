import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import Daemon from './Daemon';
import { generateTeam } from './generators';

export default class Team {
  constructor() {
    this.playerTeams = [Bowman, Swordsman, Magician];
    this.npcTeams = [Daemon, Vampire, Undead];
    this.list = [];
  }

  createNpcUnits(maxLevel, characterCount) {
    generateTeam(this.npcTeams, maxLevel, characterCount).forEach((el) => {
      this.list.push(el);
    });
  }

  createPlayerUnits(maxLevel, characterCount) {
    generateTeam(this.playerTeams, maxLevel, characterCount).forEach((el) => {
      this.list.push(el);
    });
  }
}
