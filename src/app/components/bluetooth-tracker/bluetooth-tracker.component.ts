import { Component } from '@angular/core';
import { BluetoothService } from '../../services/bluetooth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bluetooth-tracker',
  templateUrl: './bluetooth-tracker.component.html',
  styleUrls: ['./bluetooth-tracker.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class BluetoothTrackerComponent {
  isConnected: boolean = false;

  constructor(private bluetoothService: BluetoothService) {}

  async connectToDevice(): Promise<void> {
    try {
      await this.bluetoothService.connect();
      this.isConnected = true;
    } catch (error) {
      console.error('No se pudo conectar al dispositivo:', error);
    }
  }

  disconnect(): void {
    this.bluetoothService.disconnect();
    this.isConnected = false;
  }
}
