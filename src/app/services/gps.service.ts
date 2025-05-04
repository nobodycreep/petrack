// src/app/services/gps.service.ts
import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  constructor(
    private db: Database,
    private auth: Auth
  ) {}

  getLivePosition(): Observable<any> {
    return new Observable(observer => {
      // Referencia directa al nodo 'datos' donde el ESP32 escribe
      const positionRef = ref(this.db, 'datos');
      
      onValue(positionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          observer.next({
            latitude: data.latitud, // El ESP32 usa 'latitud'
            longitude: data.longitud, // El ESP32 usa 'longitud'
            timestamp: data.timestamp || Date.now() // Si existe timestamp lo usa, sino usa la hora actual
          });
        } else {
          observer.next(null);
        }
      }, (error) => {
        console.error('Error al leer datos GPS:', error);
        observer.error(error);
      });
    });
  }
}