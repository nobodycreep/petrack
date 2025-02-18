import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./app/components/home/home.component').then(m => m.HomeComponent) },
      { path: 'perfil', loadComponent: () => import('./app/components/perfil/perfil.component').then(m => m.PerfilComponent) }, // Aquí agregamos el PerfilComponent
      { path: 'recomendaciones', loadComponent: () => import('./app/components/recomendaciones/recomendaciones.component').then(m => m.RecomendacionesComponent) },	
      { path: 'recordatorios', loadComponent: () => import('./app/components/recordatorios/recordatorios.component').then(m => m.RecordatoriosComponent) },
      { path: 'bluetooth-tracker', loadComponent: () => import('./app/components/bluetooth-tracker/bluetooth-tracker.component').then(m => m.BluetoothTrackerComponent) },
      { path: 'usuario', loadComponent: () => import('./app/components/usuario/usuario.component').then(m => m.UsuarioComponent) }
    ]),
    provideAnimationsAsync(), provideAnimationsAsync(),
  ],
}).catch(err => console.error(err));
