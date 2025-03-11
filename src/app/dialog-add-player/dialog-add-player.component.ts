import { M } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-dialog-add-player',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss',
})
export class DialogAddPlayerComponent {
  name: string = '';

  onNoClick() {
    // Code
  }

  addPlayer() {
    console.log(this.name);
  }
}
