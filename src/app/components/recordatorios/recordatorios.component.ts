import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';  // Importar MatInputModule para el campo de entrada

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule,  ],
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.scss'],
})
export class RecordatoriosComponent {
  recordatorios = [
    { titulo: 'Vacunas cada mes', descripcion: 'No olvides llevar a tu mascota al veterinario para las vacunas.', completado: false },
    { titulo: 'Ejercicio diario', descripcion: 'Haz que tu mascota haga ejercicio todos los días.', completado: false },
    { titulo: 'Revisión periódica', descripcion: 'Visita al veterinario cada seis meses para revisión general.', completado: false },
  ];

  // Variable para almacenar el índice del recordatorio que se va a editar
  recordatorioEditando: number | null = null;

  // Marcar como realizado
  marcarComoRealizado(index: number) {
    this.recordatorios[index].completado = true;
  }

  // Eliminar un recordatorio
  eliminarRecordatorio(index: number) {
    this.recordatorios.splice(index, 1);
  }

  // Agregar un nuevo recordatorio
  agregarRecordatorio() {
    const nuevoRecordatorio = { 
      titulo: 'Nuevo recordatorio', 
      descripcion: 'Escribe la descripción del nuevo recordatorio.',
      completado: false 
    };
    this.recordatorios.push(nuevoRecordatorio);
  }

  // Editar un recordatorio
  editarRecordatorio(index: number) {
    this.recordatorioEditando = index;  // Establecer el índice del recordatorio que se va a editar
  }

  // Guardar cambios de la edición
  guardarEdicion(index: number, titulo: string, descripcion: string) {
    if (titulo.trim() && descripcion.trim()) {
      this.recordatorios[index].titulo = titulo;
      this.recordatorios[index].descripcion = descripcion;
      this.recordatorioEditando = null;  // Limpiar la variable de edición
    }
  }

  // Cancelar la edición
  cancelarEdicion() {
    this.recordatorioEditando = null;
  }
}
