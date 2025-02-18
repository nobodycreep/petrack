import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import * as L from 'leaflet';  // Importa Leaflet para usarlo

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  mascota = {
    nombre: 'Firulais',
    ubicacion: { lat: 19.432608, lng: -99.133209 },  // Coordenadas de ejemplo
  };

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Inicialización del mapa
  initMap() {
    const map = L.map('map').setView([this.mascota.ubicacion.lat, this.mascota.ubicacion.lng], 12);  // Menor zoom, más alejado

    // Cargar la capa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadir marcador en la ubicación de la mascota
    L.marker([this.mascota.ubicacion.lat, this.mascota.ubicacion.lng])
      .addTo(map)
      .bindPopup(`Ubicación actual de ${this.mascota.nombre}`)
      .openPopup();

    // Ajuste del tamaño cuando la ventana se redimensiona
    window.addEventListener('resize', () => {
      map.invalidateSize();  // Redimensionar el mapa si la ventana cambia de tamaño
    });
  }

  alertarUbicacion() {
    alert('¡Se ha enviado la ubicación de tu mascota!');
  }
}
