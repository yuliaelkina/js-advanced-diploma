import themes from './themes';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    const userTeam = new Team();
    const npcTeam = new Team();
    this.userTeam = userTeam;
    this.npcTeam = npcTeam;
    const gameState = new GameState();
    this.gameState = gameState;
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
    if (this.gamePlay.cells.findIndex((el) => el.classList.contains('selected')) !== -1) {
      this.gamePlay.deselectCell(this.gamePlay.cells.findIndex((el) => el.classList.contains('selected')));
    }
    if (this.gameState.turn === 'user' && this.userTeam.list.find((el) => el.position === index) !== undefined) {
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError('Выберите своего персонажа');
    }
  }

  onCellEnter(index) {
    if (this.getFullTeam().find((el) => el.position === index) !== undefined) {
      const hero = this.getFullTeam().find((el) => el.position === index);
      const message = `\uD83C\uDF96 ${hero.character.level} \u2694 ${hero.character.attack} \uD83D\uDEE1 ${hero.character.defence} \u2764 ${hero.character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  getFullTeam() {
    return this.npcTeam.list.concat(this.userTeam.list);
  }
}
