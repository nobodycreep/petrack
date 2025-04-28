// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth'; // 👈 nuevo
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment'; // 👈 tu config de firebase

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./app/components/home/home.component').then(m => m.HomeComponent) },
      { path: 'perfil', loadComponent: () => import('./app/components/perfil/perfil.component').then(m => m.PerfilComponent) },
      { path: 'recomendaciones', loadComponent: () => import('./app/components/recomendaciones/recomendaciones.component').then(m => m.RecomendacionesComponent) },
      { path: 'recordatorios', loadComponent: () => import('./app/components/recordatorios/recordatorios.component').then(m => m.RecordatoriosComponent) },
      { path: 'usuario', loadComponent: () => import('./app/components/usuario/usuario.component').then(m => m.UsuarioComponent) }
    ]),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()), // 👈 aquí agregamos el Auth
  ],
}).catch(err => console.error(err));
