import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserData {
  role?: 'super_admin' | 'moderator' | 'finance' | 'fraud' | 'vendor' | 'customer';
  companyName?: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc = () => {};

    // Écouteur en temps réel sur l'état de connexion via Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // L'utilisateur est connecté, on écoute ses permissions en temps réel
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          unsubDoc = onSnapshot(userDocRef, (docSnap) => {
             if (docSnap.exists()) {
               setUserData(docSnap.data() as UserData);
             } else {
               setUserData({ role: 'customer' });
             }
             setLoading(false);
          }, (error) => {
             console.error("Erreur onSnapshot utilisateur:", error);
             setUserData({ role: 'customer' });
             setLoading(false);
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
          setUserData(null);
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => { unsubscribe(); unsubDoc(); };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
