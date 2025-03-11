import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation: boolean = false;
  game: Game;

  constructor() {
    this.game = new Game();
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
  }
  takeCard() {
    this.pickCardAnimation = true;
  }
}
