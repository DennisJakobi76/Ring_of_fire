import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class GameComponent implements OnDestroy {
  game: Game;
  gameId: string | null = null;
  private gameSubscription: Subscription | undefined;

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

    if (this.gameId) {
      const gamesCollection = collection(this.firestore, 'games');
      const gameDoc = doc(gamesCollection, this.gameId);

      // Subscribe to real-time updates
      this.gameSubscription = new Subscription();
      this.gameSubscription.add(
        onSnapshot(gameDoc, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            this.updateGameData(data);
          }
        })
      );
    }
  }

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  private updateGameData(data: any) {
    this.game.currentPlayer = data['currentPlayer'];
    this.game.playedCards = data['playedCards'];
    this.game.stack = data['stack'];
    this.game.players = data['players'];
    this.game.pickCardAnimation = data['pickCardAnimation'];
    this.game.currentCard = data['currentCard'];
  }

  async newGame() {
    this.game = new Game();
  }
  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() ?? '';
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
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
