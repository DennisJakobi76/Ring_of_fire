import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  constructor(private firestore: Firestore, private router: Router) {}
  async newGame() {
    // Start game
    let game = new Game();
    const gameRef = collection(this.firestore, 'games');
    await addDoc(gameRef, game.toJson()).then((gameInfo) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}
