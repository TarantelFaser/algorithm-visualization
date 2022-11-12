import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'algorithm-vizualisation';

  buttonClicked() {
    alert("Dieser Button wurde gedrückt");
  }
}
