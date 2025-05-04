import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { GpsService } from '../../services/gps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  private map!: L.Map;
  private marker!: L.Marker;
  private positionSubscription: Subscription | null = null;
  
  isTracking = false;
  locationError: string | null = null;
  currentPosition: { latitude: number; longitude: number; timestamp?: number } | null = null;

  constructor(private gpsService: GpsService) {}

  ngAfterViewInit(): void {
    // No inicialices el mapa aún. Espera la primera ubicación.
  }
  
  ngOnDestroy(): void {
    this.stopTracking();
  }

  private initMap(lat: number, lng: number): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup('Ubicación inicial')
      .openPopup();
  }
  
  startTracking(): void {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.locationError = null;
    
    this.positionSubscription = this.gpsService.getLivePosition().subscribe({
      next: (position) => {
        if (!position) {
          this.locationError = 'No se encontraron datos de posición. Verifica que el dispositivo esté conectado.';
          return;
        }

        this.currentPosition = position;

        if (!this.map) {
          // Solo inicializar el mapa la primera vez que se recibe una ubicación
          this.initMap(position.latitude, position.longitude);
        } else {
          this.updateMapPosition(position.latitude, position.longitude);
        }
      },
      error: (error) => {
        console.error('Error al obtener la posición:', error);
        this.locationError = 'Error al obtener la posición. Verifica tu conexión e inténtalo de nuevo.';
        this.isTracking = false;
      }
    });
  }
  
  stopTracking(): void {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
      this.positionSubscription = null;
    }
    this.isTracking = false;
  }
  
  toggleTracking(): void {
    if (this.isTracking) {
      this.stopTracking();
    } else {
      this.startTracking();
    }
  }
  
  private updateMapPosition(lat: number, lng: number): void {
    if (!lat || !lng || !this.map || !this.marker) return;

    this.marker.setLatLng([lat, lng]);

    let timestampStr = '';
    if (this.currentPosition?.timestamp) {
      const date = new Date(this.currentPosition.timestamp);
      timestampStr = `<br>Última actualización: ${date.toLocaleTimeString()}`;
    }

    this.marker.bindPopup(`
      <strong>Posición del dispositivo</strong><br>
      Lat: ${lat.toFixed(6)}<br>
      Lng: ${lng.toFixed(6)}
      ${timestampStr}
    `);

    this.map.setView([lat, lng], 16);
  }
  
  centerOnCurrentLocation(): void {
    if (this.currentPosition && this.map) {
      this.map.setView(
        [this.currentPosition.latitude, this.currentPosition.longitude], 
        16
      );
    }
  }
}
