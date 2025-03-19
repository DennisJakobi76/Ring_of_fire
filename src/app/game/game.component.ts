import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { S } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    PlayerComponent,
    MatIconModule,
    MatButtonModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation: boolean = false;
  currentCard: string = '';
  game: Game;
  gameId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {
    this.game = new Game();
  }

  async ngOnInit() {
    this.newGame();
    this.gameId = this.route.snapshot.paramMap.get('id');
    const gamesCollection = collection(this.firestore, 'games');
    const gameDoc = doc(gamesCollection, `/${this.gameId}`);
    const data = await getDoc(gameDoc).then((doc) => doc.data());
    if (data) {
      this.game.currentPlayer = data['currentPlayer'];
      this.game.playedCards = data['playedCards'];
      this.game.stack = data['stack'];
      this.game.players = data['players'];
    }
  }

  async newGame() {
    this.game = new Game();
  }
  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() ?? '';
      this.pickCardAnimation = true;
      this.saveGame();
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveGame();
      }, 1500);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    const gamesCollection = collection(this.firestore, 'games');
    const gameDoc = doc(gamesCollection, `/${this.gameId}`);
    await updateDoc(gameDoc, this.game.toJson());
  }
}
