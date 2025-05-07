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
  private accuracyCircle!: L.Circle;
  private positionSubscription: Subscription | null = null;
  private positionHistory: Array<[number, number]> = [];
  private historyLine!: L.Polyline;
  
  isTracking = false;
  locationError: string | null = null;
  currentPosition: any = null;
  
  // Coordenada de referencia actualizada (2°54'58.6"S 79°00'57.4"W)
  // Cálculo manual detallado:
  // Latitud: - (2 + 54/60 + 58.6/3600) = -2.9162778
  // Longitud: - (79 + 0/60 + 57.4/3600) = -79.0159444
  private readonly REFERENCE_POSITION = {
    latitude: -2.9162778,  // 2°54'58.6"S convertido a decimal con mayor precisión
    longitude: -79.0159444 // 79°00'57.4"W convertido a decimal con mayor precisión
  };
  
  // Función para ajustar manualmente la posición de referencia si es necesario
  private readonly REFERENCE_ADJUSTMENT = {
    latitude: 0.0000000,  // Ajuste fino de latitud si es necesario
    longitude: 0.0000000  // Ajuste fino de longitud si es necesario
  };

  constructor(private gpsService: GpsService) {}

  ngAfterViewInit(): void {
    // Inicializar el mapa con la ubicación de referencia
    this.initMap(this.REFERENCE_POSITION.latitude, this.REFERENCE_POSITION.longitude);
  }
  
  ngOnDestroy(): void {
    this.stopTracking();
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(lat: number, lng: number): void {
    // Si ya existe un mapa, eliminarlo antes de crear uno nuevo
    if (this.map) {
      this.map.remove();
    }

    // Crear mapa con nivel de zoom más alto para mayor precisión
    // Aumentamos el zoom a 20 para máxima precisión si el proveedor lo soporta
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      zoomSnap: 0.5, // Permite zooms más precisos
      zoomDelta: 0.5 // Incrementos más pequeños de zoom
    }).setView([lat, lng], 20);

    // Usar OpenStreetMap como proveedor de mapas con máxima resolución
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    });
    
    // Añadir capa de satélite de mayor resolución cuando esté disponible
    const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 20
    });
    
    // Crear capas base para poder cambiar entre ellas
    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satélite": esriSatellite
    };
    
    // Añadir la capa inicial
    osmLayer.addTo(this.map);
    
    // Añadir control de capas
    L.control.layers(baseMaps).addTo(this.map);

    // Crear marcador en la posición inicial
    this.marker = L.marker([lat, lng], {
      draggable: false,
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(this.map);

    // Añadir círculo de precisión
    this.accuracyCircle = L.circle([lat, lng], {
      radius: 10, // Radio inicial
      color: '#4285F4',
      fillColor: '#4285F4',
      fillOpacity: 0.2,
      weight: 1
    }).addTo(this.map);
    
    // Inicializar la línea del historial de posiciones
    this.historyLine = L.polyline([], {
      color: '#4285F4',
      weight: 3,
      opacity: 0.7,
      smoothFactor: 1
    }).addTo(this.map);
    
    // Añadir escala al mapa
    L.control.scale({ imperial: false }).addTo(this.map);
    
    // Añadir marcador de referencia para la posición esperada con mayor precisión visual
    
    // Calcular la posición de referencia final con ajustes manuales
    const refLatitude = this.REFERENCE_POSITION.latitude + this.REFERENCE_ADJUSTMENT.latitude;
    const refLongitude = this.REFERENCE_POSITION.longitude + this.REFERENCE_ADJUSTMENT.longitude;
    
    // Primero añadir un círculo pequeño que marca exactamente el punto
    L.circle([refLatitude, refLongitude], {
      radius: 0.5, // Radio muy pequeño para máxima precisión
      color: '#FF4500', // Naranja-rojo para mayor visibilidad
      fillColor: '#FF4500',
      fillOpacity: 1,
      weight: 2
    }).addTo(this.map);
    
    // Añadir marcador con mejor anclaje usando la posición ajustada
    L.marker([refLatitude, refLongitude], {
      icon: L.icon({
        iconUrl: 'assets/marker-reference.png', // Deberías crear este icono
        iconSize: [25, 41],
        // Mejorar anclaje para más precisión (punto exacto en la base del pin)
        iconAnchor: [12, 41]
      })
    }).addTo(this.map)
      .bindPopup(`<strong>Posición de referencia</strong><br>
                  2°54'58.6"S 79°00'57.4"W<br>
                  (${this.REFERENCE_POSITION.latitude.toFixed(7)}, ${this.REFERENCE_POSITION.longitude.toFixed(7)})
                  <br><small>Precisión aumentada</small>`)
      .openPopup();
    
    // Configurar popup inicial
    this.marker.bindPopup('Esperando datos del dispositivo...').openPopup();
  }
  
  startTracking(): void {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.locationError = null;
    this.positionHistory = []; // Reiniciar historial
    
    if (this.historyLine) {
      this.historyLine.setLatLngs([]); // Limpiar línea de historial
    }
    
    this.positionSubscription = this.gpsService.getLivePosition().subscribe({
      next: (position) => {
        if (!position) {
          this.locationError = 'No se encontraron datos de posición. Verifica que el dispositivo ESP32 esté enviando correctamente.';
          return;
        }

        this.currentPosition = position;
        
        // Actualizar el mapa con la nueva posición
        this.updateMapPosition(position);
        
        // Añadir posición al historial
        this.addPositionToHistory(position.latitude, position.longitude);
      },
      error: (error) => {
        console.error('Error al obtener la posición del ESP32:', error);
        this.locationError = 'Error al recibir datos de Firebase: ' + (error.message || 'Error desconocido');
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
  
  private updateMapPosition(position: any): void {
    if (!position || !this.map || !this.marker) return;
    
    const { latitude, longitude, accuracy, rawData } = position;
    
    // Validar que las coordenadas sean números válidos
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Coordenadas inválidas:', position);
      this.locationError = 'Coordenadas inválidas recibidas del dispositivo';
      return;
    }
    
    // Calcular distancia a la posición de referencia
    // Usar la posición ajustada para calcular la distancia
    const refLatitude = this.REFERENCE_POSITION.latitude + this.REFERENCE_ADJUSTMENT.latitude;
    const refLongitude = this.REFERENCE_POSITION.longitude + this.REFERENCE_ADJUSTMENT.longitude;
    
    const referenceDistance = this.calculateDistance(
      latitude, longitude,
      refLatitude, refLongitude
    );
    
    const latLng = L.latLng(latitude, longitude);

    // Actualizar posición del marcador
    this.marker.setLatLng(latLng);
    
    // Actualizar círculo de precisión
    this.accuracyCircle.setLatLng(latLng);
    this.accuracyCircle.setRadius(accuracy || 10);

    // Actualizar el contenido del popup con información detallada
    let timestampStr = '';
    if (position.timestamp) {
      const date = new Date(position.timestamp);
      timestampStr = `<br>Última actualización: ${date.toLocaleTimeString()}`;
    }
    
    // Información de depuración (solo visible en desarrollo)
    let debugInfo = '';
    if (rawData) {
      debugInfo = `<br><br><small>Datos originales:<br>`;
      for (const key in rawData) {
        if (typeof rawData[key] !== 'object') {
          debugInfo += `${key}: ${rawData[key]}<br>`;
        }
      }
      debugInfo += `</small>`;
    }

    this.marker.bindPopup(`
      <strong>Posición actual del ESP32</strong><br>
      Lat: ${latitude.toFixed(6)}<br>
      Lng: ${longitude.toFixed(6)}<br>
      Precisión: ±${accuracy || 'N/A'} metros<br>
      Distancia a referencia: ${referenceDistance.toFixed(2)} metros
      ${timestampStr}
      ${debugInfo}
    `).openPopup();

    // Centrar el mapa solo si estamos en modo tracking
    if (this.isTracking) {
      this.map.setView(latLng, this.map.getZoom());
    }
  }
  
  private addPositionToHistory(lat: number, lng: number): void {
    // Añadir al array de historial
    this.positionHistory.push([lat, lng]);
    
    // Limitar el historial a 100 puntos para no sobrecargar
    if (this.positionHistory.length > 100) {
      this.positionHistory.shift();
    }
    
    // Actualizar la polyline con el nuevo historial
    this.historyLine.setLatLngs(this.positionHistory);
  }
  
  centerOnCurrentLocation(): void {
    if (this.currentPosition && this.map) {
      this.map.setView(
        [this.currentPosition.latitude, this.currentPosition.longitude], 
        this.map.getZoom() || 20
      );
    } else if (this.map) {
      // Si no hay posición actual, centrar en la ubicación de referencia
      const refLatitude = this.REFERENCE_POSITION.latitude + this.REFERENCE_ADJUSTMENT.latitude;
      const refLongitude = this.REFERENCE_POSITION.longitude + this.REFERENCE_ADJUSTMENT.longitude;
      
      this.map.setView(
        [refLatitude, refLongitude], 
        this.map.getZoom() || 20
      );
    }
  }
  
  // Método para facilitar ajustes finos a la posición de referencia
  adjustReferencePosition(latAdjust: number, lngAdjust: number): void {
    // Actualizar los ajustes
    this.REFERENCE_ADJUSTMENT.latitude = latAdjust;
    this.REFERENCE_ADJUSTMENT.longitude = lngAdjust;
    
    // Reiniciar el mapa para aplicar los ajustes
    this.initMap(
      this.REFERENCE_POSITION.latitude + this.REFERENCE_ADJUSTMENT.latitude,
      this.REFERENCE_POSITION.longitude + this.REFERENCE_ADJUSTMENT.longitude
    );
  }
  
  // Método para centrar en coordenadas específicas
  setCoordenadas(latStr: string, lngStr: string): void {
    try {
      // Verificar si las coordenadas están en formato DMS
      if (latStr.includes('°') || lngStr.includes('°')) {
        // Convertir DMS a decimal
        const latDec = this.convertDMSToDecimal(latStr);
        const lngDec = this.convertDMSToDecimal(lngStr);
        
        if (this.map && this.marker) {
          const latLng = L.latLng(latDec, lngDec);
          this.marker.setLatLng(latLng);
          this.map.setView(latLng, 19);
          this.marker.bindPopup(`
            <strong>Posición manual (DMS)</strong><br>
            ${latStr}<br>
            ${lngStr}<br>
            Decimal: (${latDec.toFixed(6)}, ${lngDec.toFixed(6)})
          `).openPopup();
        }
      } else {
        // Coordenadas ya en decimal
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        
        if (this.map && this.marker && !isNaN(lat) && !isNaN(lng)) {
          const latLng = L.latLng(lat, lng);
          this.marker.setLatLng(latLng);
          this.map.setView(latLng, 19);
          this.marker.bindPopup(`
            <strong>Posición manual</strong><br>
            Lat: ${lat.toFixed(6)}<br>
            Lng: ${lng.toFixed(6)}
          `).openPopup();
        }
      }
    } catch (error) {
      console.error('Error al establecer coordenadas:', error);
      this.locationError = 'Error al procesar las coordenadas';
    }
  }
  
  // Método mejorado para convertir DMS a decimal con mayor precisión
  private convertDMSToDecimal(dmsStr: string): number {
    // Ejemplo: "2°54'58.6\"S" -> -2.9162778
    try {
      // Extraer grados, minutos y segundos usando regex más flexible
      // Acepta diferentes formatos comunes de coordenadas DMS
      const regex = /(\d+)\s*°\s*(\d+)\s*[''′]\s*([\d\.]+)\s*["″]?\s*([NSWE])/i;
      const match = dmsStr.match(regex);
      if (!match) {
        console.warn('Formato DMS no reconocido:', dmsStr);
        
        // Intentar con formato alternativo sin segundos
        const altRegex = /(\d+)\s*°\s*(\d+\.?\d*)\s*[''′]?\s*([NSWE])/i;
        const altMatch = dmsStr.match(altRegex);
        if (altMatch) {
          const degrees = parseInt(altMatch[1], 10);
          const minutes = parseFloat(altMatch[2]);
          const direction = altMatch[3].toUpperCase();
          
          // Calcular decimal con alta precisión
          let decimal = degrees + (minutes / 60);
          
          // Ajustar según dirección
          if (direction === 'S' || direction === 'W') {
            decimal = -decimal;
          }
          
          return parseFloat(decimal.toFixed(8)); // Mantener alta precisión
        }
        
        return 0;
      }
      
      const degrees = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseFloat(match[3]);
      const direction = match[4].toUpperCase();
      
      // Calcular decimal con máxima precisión
      const decimal = degrees + (minutes / 60) + (seconds / 3600);
      
      // Ajustar según dirección
      const signedDecimal = (direction === 'S' || direction === 'W') ? -decimal : decimal;
      
      // Retornar con precisión de 7 decimales (aprox. 1.1cm de precisión en el ecuador)
      return parseFloat(signedDecimal.toFixed(8));
    } catch (e) {
      console.error('Error al convertir coordenadas DMS:', e);
      return 0;
    }
  }
  
  // Calcular distancia entre dos puntos usando la fórmula haversine
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
  }
}