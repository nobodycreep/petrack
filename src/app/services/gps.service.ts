// src/app/services/gps.service.ts
import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
      const user = this.auth.currentUser;
      if (!user) {
        observer.next(null);
        observer.complete();
        return;
      }

      const positionRef = ref(this.db, `gpsData/${user.uid}`);
      onValue(positionRef, (snapshot) => {
        const data = snapshot.val();
        observer.next({
          latitude: data?.latitude || data?.lat,
          longitude: data?.longitude || data?.lng,
          timestamp: data?.timestamp
        });
      }, (error) => {
        observer.error(error);
      });
    });
  }
}
