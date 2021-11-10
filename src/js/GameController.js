import themes from './themes';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import avaiableMoves from './avaiableMoves';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    const userTeam = new Team();
    const npcTeam = new Team();
    this.userTeam = userTeam;
    this.npcTeam = npcTeam;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.userTeam.createPlayerUnits(1, 2);
    this.npcTeam.createNpcUnits(4, 2);
    this.gamePlay.redrawPositions(this.getFullTeam());
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
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
      } else if (this.selectedCharacter !== undefined) {
        this.gamePlay.deselectCell(this.gamePlay.cells.findIndex((el) => el.classList.contains('selected')));
        if (this.gamePlay.cells[index].classList.contains('selected-green')) {
          console.log(index);
          this.selectedCharacter.position = index;
          this.gamePlay.deselectCell(index);
          this.selectedCharacter = undefined;
          this.gamePlay.redrawPositions(this.getFullTeam());
        } else if (this.gamePlay.cells[index].classList.contains('selected-red')) {
          console.log(index);
        } else if (this.gamePlay.cells[index].classList.contains('selected-yellow')) { 
          this.gamePlay.deselectCell(this.selectedCharacter.position);
          this.gamePlay.selectCell(index);
          this.selectedCharacter = this.userTeam.list.find((el) => el.position === index);
        } else {
          this.selectedCharacter = undefined;
        }
      }  
    }
  }

  onCellEnter(index) {
    if (GameState.turn === 'user') {
      if (this.getFullTeam().find((el) => el.position === index) !== undefined) {
        this.gamePlay.setCursor(cursors.pointer);
        const hero = this.getFullTeam().find((el) => el.position === index);
        const message = `\uD83C\uDF96 ${hero.character.level} \u2694 ${hero.character.attack} \uD83D\uDEE1 ${hero.character.defence} \u2764 ${hero.character.health}`;
        this.gamePlay.showCellTooltip(message, index);
      } else if (this.selectedCharacter !== undefined) {
        const indexOfSelectedCharacter = this.selectedCharacter.position;
        const Character = this.userTeam.list.find((el) => el.position === indexOfSelectedCharacter);
        const typeOfCharacter = Character.character.type;
        this.userTurnVisual(indexOfSelectedCharacter, typeOfCharacter, index);
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
    if (typeOfCharacter === 'magician'){
      if (avaiableMoves.avaiableMovesAndAttacksfor1Cell[selectedIndex].includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else if (avaiableMoves.avaiableAttackfor4Cells[selectedIndex].includes(index) && this.userTeam.list.find((el) => el.position === index) !== undefined) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (typeOfCharacter === 'bowman') {
      if (avaiableMoves.avaiableMovesfor2Cells[selectedIndex].includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else if (avaiableMoves.avaiableAttackfor2Cells[selectedIndex].includes(index) && this.userTeam.list.find((el) => el.position === index) !== undefined) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (typeOfCharacter === 'swordsman') {
      if (avaiableMoves.avaiableMovesfor4Cells[selectedIndex].includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else if (avaiableMoves.avaiableMovesAndAttacksfor1Cell[selectedIndex].includes(index) && this.userTeam.list.find((el) => el.position === index) !== undefined) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else {
      this.gamePlay.setCursor(cursors.notallowed);
      }
    } 
    
  }
}
