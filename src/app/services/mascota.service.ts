import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private mascotaSource = new BehaviorSubject({
    nombre: 'Firulais',
    ubicacion: 'Parque Central',
  });

  mascota$ = this.mascotaSource.asObservable();

  actualizarMascota(nuevaMascota: any) {
    this.mascotaSource.next(nuevaMascota);
  }
}
