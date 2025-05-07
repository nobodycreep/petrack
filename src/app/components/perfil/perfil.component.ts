import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class PerfilComponent implements OnInit {
  mascota = {
    nombre: 'Nueva Mascota',
    foto: 'https://img.freepik.com/vector-premium/ilustracion-silueta-cabeza-plana-perro_972258-1044.jpg',
    edad: 0,
    raza: 'Desconocida',
    peso: 0,
    salud: 'No especificada',
    nacimiento: '',
  };

  editMode = false;
  mascotaId = 'mascota1';

  constructor(private mascotaService: MascotaService) {}

  async ngOnInit() {
    const data = await this.mascotaService.obtenerMascota(this.mascotaId);
    if (data) this.mascota = data;
    else await this.mascotaService.guardarMascota(this.mascotaId, this.mascota);
  }

  editarPerfil() {
    this.editMode = true;
  }

  async guardarPerfil() {
    this.editMode = false;
    await this.mascotaService.guardarMascota(this.mascotaId, this.mascota);
    console.log('Perfil actualizado');
  }

  async subirImagenMascota(event: any) {
    console.log('Iniciando subida de imagen...');
    const archivo = event.target.files[0];
    if (!archivo) {
      console.log('No se seleccionó archivo');
      return;
    }
  
    console.log('Archivo seleccionado:', archivo.name);
    
    const storage = getStorage();
    const ruta = `mascotas/${this.mascotaId}/foto.jpg`;
    const referencia = ref(storage, ruta);
  
    try {
      console.log('Subiendo imagen a Firebase Storage...');
      await uploadBytes(referencia, archivo);
      const url = await getDownloadURL(referencia);
      console.log('URL obtenida:', url);
  
      // Actualización con spread operator para forzar detección de cambios
      this.mascota = {...this.mascota, foto: url};
      console.log('Foto actualizada localmente');
  
      await this.mascotaService.guardarMascota(this.mascotaId, this.mascota);
      console.log('Perfil guardado en Firestore');
    } catch (error) {
      console.error('Error completo:', error);
    }
  }
}

