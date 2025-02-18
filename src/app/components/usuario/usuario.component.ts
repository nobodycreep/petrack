import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const firebaseConfig = {
  apiKey: "AIzaSyAPa8kHSEk8SXjqjBfaRQ5zDPTv6yxBB0I",
  authDomain: "petrack-7f8d4.firebaseapp.com",
  projectId: "petrack-7f8d4",
  storageBucket: "petrack-7f8d4.appspot.com",
  messagingSenderId: "392588347137",
  appId: "1:392588347137:web:65ab15a1f7f48c92336660",
  measurementId: "G-Y6TF6TB2HJ"
};

@Component({
  selector: 'app-usuario',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  user: User | null = null;
  profile: { name: string; bio: string } = { name: '', bio: '' };
  isEditing = false;
  showLoginModal = false;

  private auth: any;
  private db: any;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  ngOnInit() {
    this.auth.onAuthStateChanged(async (user: User | null) => {
      this.user = user;
      if (user) {
        const docRef = doc(this.db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.profile = docSnap.data() as { name: string, bio: string };
        } else {
          this.profile = { name: user.displayName || '', bio: '' };
          await setDoc(docRef, this.profile);
        }
      }
    });
  }

  async handleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.showLoginModal = false } catch (error) {
      console.error("Error during login:", error);
    }
  }

  async handleLogout() {
    await this.auth.signOut();
    this.user = null;
    this.profile = { name: '', bio: '' };
  }

  async handleSave() {
    if (this.user) {
      const docRef = doc(this.db, "users", this.user.uid);
      await setDoc(docRef, this.profile, { merge: true });
      this.isEditing = false;
    }
  }
}