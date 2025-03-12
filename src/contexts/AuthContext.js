import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      createdAt: new Date().toISOString(),
      stats: {
        totalCompleted: 0,
        totalTime: 0,
        dailyStats: {},
      }
    });
    
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  // Transfer localStorage data to Firestore when user logs in
  async function migrateLocalData(userId) {
    try {
      // Check if user already has data in Firestore
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        console.log("User data already exists in Firestore");
        return;
      }
      
      // Get data from localStorage
      const localTasks = localStorage.getItem('tasks');
      const localStats = localStorage.getItem('stats');
      
      if (localTasks || localStats) {
        // Create user document with localStorage data
        await setDoc(userDocRef, {
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          stats: localStats ? JSON.parse(localStats) : {
            totalCompleted: 0,
            totalTime: 0,
            dailyStats: {},
          }
        });
        
        // If there are tasks, create them in Firestore
        if (localTasks) {
          const tasks = JSON.parse(localTasks);
          for (const task of tasks) {
            await setDoc(doc(db, "users", userId, "tasks", task.id.toString()), task);
          }
        }
        
        console.log("Local data migrated to Firestore");
      }
    } catch (error) {
      console.error("Error migrating local data:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        migrateLocalData(user.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}