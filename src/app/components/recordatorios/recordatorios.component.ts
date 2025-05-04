import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.scss'],
})
export class RecordatoriosComponent {
  recordatorios = [
    {
      titulo: 'Vacunas cada mes',
      descripcion: 'No olvides llevar a tu mascota al veterinario para las vacunas.',
      completado: false
    },
    {
      titulo: 'Ejercicio diario',
      descripcion: 'Haz que tu mascota haga ejercicio todos los días.',
      completado: false
    },
    {
      titulo: 'Revisión periódica',
      descripcion: 'Visita al veterinario cada seis meses para revisión general.',
      completado: true
    }
  ];

  recordatorioEditando: number | null = null;

  get pendientes() {
    return this.recordatorios.filter(r => !r.completado);
  }

  get completados() {
    return this.recordatorios.filter(r => r.completado);
  }

  getIndex(recordatorio: any): number {
    return this.recordatorios.indexOf(recordatorio);
  }

  marcarComoRealizado(index: number) {
    const realIndex = this.getIndex(this.pendientes[index]);
    if (realIndex !== -1) this.recordatorios[realIndex].completado = true;
  }

  eliminarRecordatorio(index: number, completado: boolean = false) {
    const lista = completado ? this.completados : this.pendientes;
    const realIndex = this.getIndex(lista[index]);
    if (realIndex !== -1) this.recordatorios.splice(realIndex, 1);
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
    this.recordatorioEditando = this.getIndex(lista[index]);
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
