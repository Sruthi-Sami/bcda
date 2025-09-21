import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import RecruiterDashboard from "./components/RecruiterDashboard";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import RoleSelection from "./components/RoleSelection";
import { Container, Button } from "react-bootstrap";

export default function App() {
  const [users, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Auto logout on browser/tab close (optional, extra safety)
  useEffect(() => {
    const handleUnload = () => auth.signOut();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRole(userSnap.data().role);
          setIsNewUser(false);
        } else {
          setIsNewUser(true); // New user must select role
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setRole(null);
        setIsNewUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Login / Sign up
  const handleGoogleLogin = async () => {
    // Session-only persistence
    await setPersistence(auth, browserSessionPersistence);

    const result = await signInWithPopup(auth, provider);
    const loggedUser = result.user;
    setUser(loggedUser);

    const userRef = doc(db, "users", loggedUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setIsNewUser(true); // Show role selection for new user
    } else {
      setRole(userSnap.data().role); // Existing user → dashboard
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <Container>
      {!users ? (
        <div className="text-center mt-5">
          <h2>Login with Google</h2>
          <Button className="m-2" onClick={handleGoogleLogin}>
            Login / Sign Up
          </Button>
        </div>
      ) : isNewUser ? (
        <RoleSelection
          users={users}
          setRole={setRole}
          setIsNewUser={setIsNewUser}
        />
      ) : (
        <>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
          <h1 className="text-center my-4">Job Portal</h1>
          {role === "recruiter" ? (
            <RecruiterDashboard users={users} />
          ) : (
            <JobSeekerDashboard users={users} />
          )}
        </>
      )}
    </Container>
  );
}