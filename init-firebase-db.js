import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "groupfreemanltd.firebaseapp.com",
  projectId: "groupfreemanltd",
  storageBucket: "groupfreemanltd.firebasestorage.app",
  messagingSenderId: "1039716180912",
  appId: "1:1039716180912:web:33ae82e563c34a24962c75",
  measurementId: "G-XDNFTVEJ9F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Récupération sécurisée depuis le fichier .env
const email = process.env.VITE_FIREBASE_ADMIN_EMAIL || process.env.REACT_APP_FIREBASE_ADMIN_EMAIL || "admin@freeman-ltd.com";
const password = process.env.VITE_FIREBASE_ADMIN_PASSWORD || process.env.REACT_APP_FIREBASE_ADMIN_PASSWORD;

async function run() {
  if (!password) {
    console.error("❌ Erreur : Le mot de passe administrateur n'est pas défini.");
    console.error("Veuillez ajouter 'VITE_FIREBASE_ADMIN_PASSWORD=VotreMotDePasse' dans votre fichier .env");
    process.exit(1);
  }

  try {
    console.log(`Tentative de connexion avec ${email}...`);
    let user;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      console.log(`Connecté avec succès. UID: ${user.uid}`);
    } catch (loginErr) {
      if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
        console.log(`Création du compte pour ${email}...`);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        console.log(`Compte créé avec succès dans Auth. UID: ${user.uid}`);
      } else {
        throw loginErr;
      }
    }
    
    console.log("Enregistrement du rôle 'super_admin' dans Firestore...");
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: "Admin Freeman",
      role: "super_admin",
      status: "active",
      createdAt: new Date().toISOString(),
      walletBalance: 0
    }, { merge: true });
    
    console.log("✅ Promotion réussie ! Le compte est maintenant Super Administrateur.");
    console.log("Accès : http://localhost:5173/freemancms/admin");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors de l'initialisation :", err.message);
    process.exit(1);
  }
}

run();