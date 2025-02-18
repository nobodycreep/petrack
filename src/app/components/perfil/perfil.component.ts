import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAPa8kHSEk8SXjqjBfaRQ5zDPTv6yxBB0I",
    authDomain: "petrack-7f8d4.firebaseapp.com",
    projectId: "petrack-7f8d4",
    storageBucket: "petrack-7f8d4.appspot.com",
    messagingSenderId: "392588347137",
    appId: "1:392588347137:web:65ab15a1f7f48c92336660",
    measurementId: "G-Y6TF6TB2HJ"
  }
};

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
  db: any;
  mascotaId = 'mascota1';

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  ngOnInit() {
    this.inicializarPerfilMascota();
  }

  async inicializarPerfilMascota() {
    const docRef = doc(this.db, "mascotas", this.mascotaId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await this.crearPerfilMascota();
    } else {
      this.mascota = docSnap.data() as typeof this.mascota;
    }
  }

  async crearPerfilMascota() {
    const docRef = doc(this.db, "mascotas", this.mascotaId);
    await setDoc(docRef, this.mascota);
    console.log("Perfil de mascota creado");
  }

  editarPerfil() {
    this.editMode = true;
  }

  async guardarPerfil() {
    this.editMode = false;
    const docRef = doc(this.db, "mascotas", this.mascotaId);
    await setDoc(docRef, this.mascota);
    console.log("Perfil de mascota actualizado");
  }
}
