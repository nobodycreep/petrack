import { Injectable } from '@angular/core';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private db: Firestore;
  private firebaseConfig = {
    apiKey: "AIzaSyAPa8kHSEk8SXjqjBfaRQ5zDPTv6yxBB0I",
    authDomain: "petrack-7f8d4.firebaseapp.com",
    projectId: "petrack-7f8d4",
    storageBucket: "petrack-7f8d4.appspot.com",
    messagingSenderId: "392588347137",
    appId: "1:392588347137:web:65ab15a1f7f48c92336660",
    measurementId: "G-Y6TF6TB2HJ"
  };

  constructor() {
    const app = initializeApp(this.firebaseConfig);
    this.db = getFirestore(app);
  }

  async obtenerMascota(id: string): Promise<any> {
    const ref = doc(this.db, 'mascotas', id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  async guardarMascota(id: string, data: any): Promise<void> {
    const ref = doc(this.db, 'mascotas', id);
    await setDoc(ref, data);
  }
}
