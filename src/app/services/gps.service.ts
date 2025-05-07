// src/app/services/gps.service.ts
import { Injectable } from '@angular/core';
import { Database, ref, onValue, off } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  private lastKnownPosition = new BehaviorSubject<any>(null);
  private positionRef: any;

  constructor(
    private db: Database,
    private auth: Auth
  ) {}

  getLivePosition(): Observable<any> {
    return new Observable(observer => {
      // Referencia al nodo 'datos' donde el ESP32 escribe
      this.positionRef = ref(this.db, 'datos');
      
      // Suscripción a cambios en Firebase
      onValue(this.positionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Procesar y validar datos del GPS
          const position = this.processGpsData(data);
          
          if (position) {
            this.lastKnownPosition.next(position);
            observer.next(position);
          } else {
            console.warn('Datos GPS recibidos pero inválidos:', data);
            // Si hay una posición anterior, la seguimos usando
            if (this.lastKnownPosition.value) {
              observer.next(this.lastKnownPosition.value);
            } else {
              observer.next(null);
            }
          }
        } else {
          console.warn('No se recibieron datos de Firebase');
          observer.next(null);
        }
      }, (error) => {
        console.error('Error al leer datos GPS de Firebase:', error);
        observer.error(error);
      });

      // Limpieza cuando se destruye el observable
      return () => {
        if (this.positionRef) {
          off(this.positionRef);
        }
      };
    });
  }

  private processGpsData(data: any): any {
    // Validar que los datos recibidos sean números válidos
    const lat = parseFloat(data.latitud);
    const lng = parseFloat(data.longitud);
    
    // Validar coordenadas
    if (isNaN(lat) || isNaN(lng) || 
        lat < -90 || lat > 90 || 
        lng < -180 || lng > 180) {
      console.error('Coordenadas inválidas recibidas:', data);
      return null;
    }
    
    // Verificar si las coordenadas son (0,0) o valores sospechosos
    if ((lat === 0 && lng === 0) || 
        (Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001)) {
      console.warn('Coordenadas sospechosas (cerca de 0,0):', data);
    }
    
    // Si el ESP32 está enviando coordenadas en formato DMS o con otros formatos,
    // aquí se podría hacer la conversión a decimal
    
    // Añadir timestamp si no existe
    const timestamp = data.timestamp || Date.now();
    
    // Añadir exactitud estimada si está disponible
    const accuracy = data.precision || data.accuracy || 10; // valor predeterminado en metros
    
    return {
      latitude: lat,
      longitude: lng,
      timestamp: timestamp,
      accuracy: accuracy,
      rawData: data // Mantener los datos originales para depuración
    };
  }
  
  // Método para obtener la última posición conocida sin suscribirse a cambios
  getLastKnownPosition(): any {
    return this.lastKnownPosition.value;
  }
  
  // Método para convertir manualmente coordenadas DMS a decimales
  // Útil si el ESP32 está enviando en este formato
  convertDMSToDecimal(dmsStr: string, direction: string): number {
    // Ejemplo: "2°53'54.3\"S" -> -2.898417
    try {
      // Extraer grados, minutos y segundos
      const match = dmsStr.match(/(\d+)°(\d+)'(\d+(\.\d+)?)"/);
      if (!match) return 0;
      
      const degrees = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseFloat(match[3]);
      
      // Calcular decimal
      let decimal = degrees + (minutes / 60) + (seconds / 3600);
      
      // Ajustar según dirección
      if (direction === 'S' || direction === 'W' || 
          dmsStr.includes('S') || dmsStr.includes('W')) {
        decimal = -decimal;
      }
      
      return decimal;
    } catch (e) {
      console.error('Error al convertir coordenadas DMS:', e);
      return 0;
    }
  }
  
  // Método para configurar manualmente una ubicación para pruebas
  setManualPosition(lat: number, lng: number): void {
    this.lastKnownPosition.next({
      latitude: lat,
      longitude: lng,
      timestamp: Date.now(),
      accuracy: 5,
      isManual: true
    });
  }
}