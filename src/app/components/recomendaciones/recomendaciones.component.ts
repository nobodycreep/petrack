import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';  // Asegúrate de importar el módulo necesario
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  templateUrl: './recomendaciones.component.html',
  styleUrls: ['./recomendaciones.component.css'],
  imports: [MatCardModule, CommonModule]  // Aquí importamos MatCardModule
})
export class RecomendacionesComponent {
  recomendaciones = [
    {
      titulo: 'Visita al veterinario',
      descripcion: 'Es recomendable llevar a tu mascota al veterinario una vez al año para un chequeo general y mantener su salud bajo control.'
    },
    {
      titulo: 'Alimentación adecuada',
      descripcion: 'Asegúrate de darle la comida adecuada a tu mascota según su raza, edad y tamaño. Una buena alimentación es clave para su bienestar.'
    },
    {
      titulo: 'Ejercicio diario',
      descripcion: 'El ejercicio diario es vital para mantener a tu mascota en forma. Realiza caminatas o juegos al aire libre para que se mantenga activa.'
    },
    {
      titulo: 'Hidratación constante',
      descripcion: 'No olvides que tu mascota debe tener acceso a agua fresca y limpia durante todo el día, especialmente en climas calurosos.'
    },
    {
      titulo: 'Vacunas al día',
      descripcion: 'Asegúrate de que las vacunas de tu mascota estén al día para protegerla de enfermedades graves.'
    }
  ];
}