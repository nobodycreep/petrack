import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([-2.9125, -79.0296], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([-2.9125, -79.0296]).addTo(this.map)
      .bindPopup('Tu posición')
      .openPopup();
  }
}
