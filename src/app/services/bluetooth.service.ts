import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;

  // Método para conectar al dispositivo BLE
  async connect(): Promise<void> {
    try {
      console.log('Solicitando dispositivo BLE...');
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Acepta cualquier dispositivo cercano
        optionalServices: ['battery_service'] // Cambia si usas un servicio específico
      });

      if (!this.device) {
        throw new Error('No se pudo conectar al dispositivo.');
      }

      console.log('Conectando al dispositivo...');
      this.server = await this.device.gatt?.connect() ?? null;

      if (this.server) {
        console.log('Conexión establecida con el dispositivo BLE.');
      }
    } catch (error) {
      console.error('Error al conectar con el dispositivo:', error);
    }
  }

  // Método para desconectar
  disconnect(): void {
    if (this.device) {
      this.device.gatt?.disconnect();
      console.log('Dispositivo desconectado.');
    }
  }
}
