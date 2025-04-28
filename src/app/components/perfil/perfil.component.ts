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
    const archivo = event.target.files[0];
    if (!archivo) return;
  
    const storage = getStorage();
    const ruta = `mascotas/${this.mascotaId}/foto.jpg`;
    const referencia = ref(storage, ruta);
  
    try {
      // Subir imagen
      await uploadBytes(referencia, archivo);
      const url = await getDownloadURL(referencia);
  
      // Actualizar foto localmente
      this.mascota.foto = url;
  
      // Guardar también en Firestore
      await this.mascotaService.guardarMascota(this.mascotaId, this.mascota);
  
      console.log('Imagen subida y perfil actualizado con la nueva foto:', url);
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  }
}

