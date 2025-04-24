import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';  // Importar MatInputModule para el campo de entrada

// ...importaciones iguales...

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule],
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.scss'],
})
export class RecordatoriosComponent {
  recordatorios = [
    { titulo: 'Vacunas cada mes', descripcion: 'No olvides llevar a tu mascota al veterinario para las vacunas.', completado: false },
    { titulo: 'Ejercicio diario', descripcion: 'Haz que tu mascota haga ejercicio todos los días.', completado: false },
    { titulo: 'Revisión periódica', descripcion: 'Visita al veterinario cada seis meses para revisión general.', completado: true },
  ];

  recordatorioEditando: number | null = null;

  get pendientes() {
    return this.recordatorios.filter(r => !r.completado);
  }

  get completados() {
    return this.recordatorios.filter(r => r.completado);
  }

  marcarComoRealizado(index: number) {
    const pendiente = this.pendientes[index];
    const realIndex = this.recordatorios.indexOf(pendiente);
    if (realIndex !== -1) {
      this.recordatorios[realIndex].completado = true;
    }
  }

  eliminarRecordatorio(index: number, completado: boolean = false) {
    const lista = completado ? this.completados : this.pendientes;
    const target = lista[index];
    const realIndex = this.recordatorios.indexOf(target);
    if (realIndex !== -1) {
      this.recordatorios.splice(realIndex, 1);
    }
  }

  agregarRecordatorio() {
    this.recordatorios.push({
      titulo: 'Nuevo recordatorio',
      descripcion: 'Escribe la descripción del nuevo recordatorio.',
      completado: false
    });
  }

  editarRecordatorio(index: number, completado: boolean = false) {
    const lista = completado ? this.completados : this.pendientes;
    const target = lista[index];
    this.recordatorioEditando = this.recordatorios.indexOf(target);
  }

  guardarEdicion(index: number, titulo: string, descripcion: string) {
    if (titulo.trim() && descripcion.trim() && this.recordatorioEditando !== null) {
      this.recordatorios[this.recordatorioEditando] = {
        ...this.recordatorios[this.recordatorioEditando],
        titulo,
        descripcion
      };
      this.recordatorioEditando = null;
    }
  }

  cancelarEdicion() {
    this.recordatorioEditando = null;
  }
}
