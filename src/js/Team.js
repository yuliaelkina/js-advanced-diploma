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
    this._fullTeam = [];
  }

  createNpcUnits(maxLevel, characterCount) {
    generateTeam(this.npcTeams, maxLevel, characterCount).forEach((el) => {
      this._fullTeam.push(el);
    })
  }

  createPlayerUnits(maxLevel, characterCount) {
    generateTeam(this.playerTeams, maxLevel, characterCount).forEach((el) => {
      this._fullTeam.push(el);
    })
  }

  get fullTeam() {
    return this._fullTeam;
  }

  createCharactersForGameStart() {
    this.createNpcUnits(4, 2);
    this.createPlayerUnits(1, 2);
  }
}
