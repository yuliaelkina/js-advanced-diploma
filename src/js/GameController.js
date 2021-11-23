/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */

import themes from './themes';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import {
  MovesAndAttacksfor1Cell, Movesfor2Cells, Movesfor4Cells, Attackfor2Cells, Attackfor4Cells,
} from './avaiableMoves';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    const userTeam = new Team();
    const npcTeam = new Team();
    this.userTeam = userTeam;
    this.npcTeam = npcTeam;
  }

  init(type) {
    if (type === undefined) {
      GameState.turn = 'user';
      GameState.totalScore = '0';
      GameState.level = 1;
      this.gamePlay.drawUi(themes.prairie);
      this.userTeam.createPlayerUnits(1, 2);
      this.npcTeam.createNpcUnits(4, 2);
      this.gamePlay.redrawPositions(this.getFullTeam());
      this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
      this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
      this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
      this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
      this.selectedCharacter = undefined;
    } else if (type === 'load') {
      const state = this.stateService.load();
      GameState.turn = state.turn;
      GameState.totalScore = state.totalScore;
      GameState.level = state.level;
      GameState.maxScore = state.maxScore;
      this.userTeam = state.userTeam;
      this.npcTeam = state.npcTeam;
      this.gamePlay.redrawPositions(this.getFullTeam());
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
      this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
      this.selectedCharacter = undefined;
    }
  }

  onNewGameClick() {
    this.npcTeam.clearTeam();
    this.userTeam.clearTeam();
    this.init();
  }

  onSaveGameClick() {
    const state = {};
    state.maxScore = GameState.maxScore;
    state.level = GameState.level;
    state.totalScore = GameState.totalScore;
    state.turn = GameState.turn;
    state.userTeam = this.userTeam;
    state.npcTeam = this.npcTeam;
    this.stateService.save(state);
  }

  onLoadGameClick() {
    if (!this.stateService.load()) {
      alert('невозможно загрузить игру');
    } else {
      this.init('load');
    }
  }

  onCellClick(index) {
    if (GameState.turn === 'user') {
      if (this.selectedCharacter === undefined) {
        if (this.userTeam.list.find((el) => el.position === index) !== undefined) {
          this.gamePlay.selectCell(index);
          this.selectedCharacter = this.userTeam.list.find((el) => el.position === index);
        } else {
          GamePlay.showError('Выберите своего персонажа');
        }
      } else {
        if (this.userTeam.list.find((el) => el.position === index) !== undefined) {
          this.gamePlay.deselectCell(this.selectedCharacter.position);
          this.gamePlay.selectCell(index);
          this.selectedCharacter = this.userTeam.list.find((el) => el.position === index);
        } else if (this.gamePlay.cells[index].classList.contains('selected-red')) {
          this.gamePlay.deselectCell(this.gamePlay.cells.findIndex((el) => el.classList.contains('selected-red')));
          const victim = this.npcTeam.list.find((el) => el.position === index);
          const damage = Math.max(this.selectedCharacter.character.attack - victim.character.defence, this.selectedCharacter.character.attack * 0.1);
          this.gamePlay.showDamage(index, damage).then(() => {
            victim.character.health -= damage;
            if (victim.character.health <= 0) {
              this.npcTeam.list.splice(this.npcTeam.list.indexOf(victim), 1);
            }
            this.gamePlay.deselectCell(this.selectedCharacter.position);
            this.selectedCharacter = undefined;
            this.gamePlay.redrawPositions(this.getFullTeam());
            this.changeTurn();
          });
        } else if (this.gamePlay.cells[index].classList.contains('selected-green')) {
          this.selectedCharacter.position = index;
          this.gamePlay.deselectCell(index);
          this.gamePlay.deselectCell(this.gamePlay.cells.findIndex((el) => el.classList.contains('selected')));
          this.selectedCharacter = undefined;
          this.gamePlay.redrawPositions(this.getFullTeam());
          this.changeTurn();
        } else {
          alert('действие невозможно');
        }
      }
    }
  }

  onCellEnter(index) {
    if (GameState.turn === 'user') {
      if (this.selectedCharacter !== undefined) {
        const indexOfSelectedCharacter = this.selectedCharacter.position;
        const Character = this.userTeam.list.find((el) => el.position === indexOfSelectedCharacter);
        const typeOfCharacter = Character.character.type;
        this.userTurnVisual(indexOfSelectedCharacter, typeOfCharacter, index);
      } else if (this.getFullTeam().find((el) => el.position === index) !== undefined) {
        this.gamePlay.setCursor(cursors.pointer);
        const hero = this.getFullTeam().find((el) => el.position === index);
        const message = `\uD83C\uDF96 ${hero.character.level} \u2694 ${hero.character.attack} \uD83D\uDEE1 ${hero.character.defence} \u2764 ${hero.character.health}`;
        this.gamePlay.showCellTooltip(message, index);
      }
    }
  }

  onCellLeave(index) {
    if (GameState.turn === 'user') {
      this.gamePlay.hideCellTooltip(index);
      this.gamePlay.setCursor(cursors.auto);
      if (this.selectedCharacter !== undefined && index !== this.selectedCharacter.position) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  getFullTeam() {
    return this.npcTeam.list.concat(this.userTeam.list);
  }

  userTurnVisual(selectedIndex, typeOfCharacter, index) {
    let avaiableMoving;
    let avaiableAttack;
    if (typeOfCharacter === 'magician') {
      avaiableMoving = GameController.possibleMoves('magician', selectedIndex);
      avaiableAttack = GameController.possibleAttack('magician', selectedIndex);
    } else if (typeOfCharacter === 'bowman') {
      avaiableMoving = GameController.possibleMoves('bowman', selectedIndex);
      avaiableAttack = GameController.possibleAttack('bowman', selectedIndex);
    } else if (typeOfCharacter === 'swordsman') {
      avaiableMoving = GameController.possibleMoves('swordsman', selectedIndex);
      avaiableAttack = GameController.possibleAttack('swordsman', selectedIndex);
    }
    if (this.userTeam.list.find((el) => el.position === index)) {
      this.gamePlay.setCursor(cursors.pointer);
    } else if (avaiableAttack.includes(index) && this.npcTeam.list.find((el) => el.position === index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    } else if (this.npcTeam.list.find((el) => el.position === index)) {
      this.gamePlay.setCursor(cursors.notallowed);
      const hero = this.npcTeam.list.find((el) => el.position === index);
      const message = `\uD83C\uDF96 ${hero.character.level} \u2694 ${hero.character.attack} \uD83D\uDEE1 ${hero.character.defence} \u2764 ${hero.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    } else if (avaiableMoving.includes(index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  changeTurn() {
    if (this.userTeam.list.length === 0) {
      this.totalCounting();
      this.gameOver();
      return;
    }
    if (this.npcTeam.list.length === 0) {
      this.totalCounting();
      if (GameState.level === 4) {
        this.gameOver();
      } else {
        this.newLevel();
      }
      return;
    }
    if (GameState.turn === 'user') {
      GameState.turn = 'npc';
      this.npcTurn();
    } else {
      GameState.turn = 'user';
    }
  }

  npcTurn() {
    if (GameState.turn === 'npc') {
      const attackVars = [];
      this.npcTeam.list.forEach((el) => {
        const avaiableAttackforNpc = GameController.possibleAttack(el.character.type, el.position);
        if (this.userTeam.list.find((item) => avaiableAttackforNpc.includes(item.position)) !== undefined) {
          const attackPair = [];
          attackPair.push(this.userTeam.list.find((item) => avaiableAttackforNpc.includes(item.position)));
          attackPair.push(el);
          attackVars.push(attackPair);
        }
      });
      if (attackVars.length > 0) {
        const rand = attackVars[Math.floor(Math.random() * attackVars.length)];
        const victim = this.userTeam.list.find((el) => el.position === rand[0].position);
        const attacker = this.npcTeam.list.find((el) => el.position === rand[1].position);
        const damage = Math.max(attacker.character.attack - victim.character.defence, attacker.character.attack * 0.1);
        this.gamePlay.showDamage(victim.position, damage).then(() => {
          victim.character.health -= damage;
          if (victim.character.health <= 0) {
            this.userTeam.list.splice(this.userTeam.list.indexOf(victim), 1);
          }
          this.gamePlay.redrawPositions(this.getFullTeam());
          this.changeTurn();
        });
      } else {
        const attacker = this.npcTeam.list[Math.floor(Math.random() * this.npcTeam.list.length)];
        const movesVars = GameController.possibleMoves(attacker.character.type, attacker.position);
        const rand = Math.floor(Math.random() * movesVars.length);
        attacker.position = movesVars[rand];
        this.gamePlay.redrawPositions(this.getFullTeam());
        this.changeTurn();
      }
    }
  }

  static possibleMoves(typeOfCharacter, index) {
    let avaiable;
    if (typeOfCharacter === 'magician' || typeOfCharacter === 'daemon') {
      avaiable = MovesAndAttacksfor1Cell[index];
    } else if (typeOfCharacter === 'bowman' || typeOfCharacter === 'vampire') {
      avaiable = Movesfor2Cells[index];
    } else if (typeOfCharacter === 'swordsman' || typeOfCharacter === 'undead') {
      avaiable = Movesfor4Cells[index];
    }
    return avaiable;
  }

  static possibleAttack(typeOfCharacter, index) {
    let avaiable;
    if (typeOfCharacter === 'magician' || typeOfCharacter === 'daemon') {
      avaiable = Attackfor4Cells[index];
    } else if (typeOfCharacter === 'bowman' || typeOfCharacter === 'vampire') {
      avaiable = Attackfor2Cells[index];
    } else if (typeOfCharacter === 'swordsman' || typeOfCharacter === 'undead') {
      avaiable = MovesAndAttacksfor1Cell[index];
    }
    return avaiable;
  }

  totalCounting() {
    let points;
    this.userTeam.list.forEach((el) => {
      points += el.character.health;
    });
    GameState.totalScore += points;
  }

  gameOver() {
    if (GameState.totalScore > GameState.maxScore) {
      GameState.maxScore = GameState.totalScore;
    }
    const block = document.createElement('div');
    block.classList.add('overlay');
    document.querySelector('.board-container').appendChild(block);
    this.gamePlay.setCursor(cursors.notallowed);
  }

  newLevel() {
    GameState.level += 1;
    let theme;
    this.userTeam.list.forEach((el) => {
      el.character.level += 1;
      const attackAfter = Math.max(el.character.attack, (el.character.attack * (1.8 - el.character.health / 100)) / 100);
      const healthAfter = el.character.health + 80;
      el.character.attack = attackAfter;
      if (healthAfter <= 100) {
        el.character.health = healthAfter;
      } else {
        el.character.health = 100;
      }
    });
    if (GameState.level === 2) {
      theme = 'desert';
      this.userTeam.createPlayerUnits(1, 1);
      this.npcTeam.createNpcUnits(2, this.userTeam.list.length);
    } else if (GameState.level === 3) {
      this.userTeam.createPlayerUnits(2, 2);
      this.npcTeam.createNpcUnits(3, this.userTeam.list.length);
      theme = 'arctic';
    } else if (GameState.level === 4) {
      theme = 'mountain';
      this.userTeam.createPlayerUnits(3, 2);
      this.npcTeam.createNpcUnits(4, this.userTeam.list.length);
    }
    this.gamePlay.drawUi(themes[theme]);
    this.gamePlay.redrawPositions(this.getFullTeam());
  }
}
