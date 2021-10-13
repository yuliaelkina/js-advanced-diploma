import themes from './themes';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.team = new Team();

  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.team.createCharactersForGameStart();
    this.gamePlay.redrawPositions(this.team.fullTeam);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    
    // TODO: react to mouse enter
  }

  onCellEnter(index) {

    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
