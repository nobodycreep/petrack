import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'My App';

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const nav = document.querySelector('nav');
    if (this.menuOpen) {
      nav?.classList.add('active');  // Agregar clase 'active' al menú
    } else {
      nav?.classList.remove('active');  // Remover clase 'active' al cerrar
    }
  }
}
