import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import RecruiterDashboard from "./components/RecruiterDashboard";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import RoleSelection from "./components/RoleSelection";
import { Container, Button } from "react-bootstrap";
import "./App.css"; // ✅ import CSS

export default function App() {
  const [users, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Auto logout on browser/tab close
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
          setIsNewUser(true);
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
    await setPersistence(auth, browserSessionPersistence);

    const result = await signInWithPopup(auth, provider);
    const loggedUser = result.user;
    setUser(loggedUser);

    const userRef = doc(db, "users", loggedUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setIsNewUser(true);
    } else {
      setRole(userSnap.data().role);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="navbar navbar-custom d-flex justify-content-between align-items-center">
        <span className="navbar-brand">Job Portal</span>

        <div className="d-flex align-items-center">
          {users && (
            <Button className="btn-logout me-3 colbtn" onClick={handleLogout}>
              Logout
            </Button>
          )}
          {/* ✅ Logo on top-right */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/10312/10312763.png"
            alt="Portal Logo"
            className="nav-logo"
          />
        </div>
      </nav>

      {/* ✅ Tagline */}
      <div className="tagline text-center mt-4">
        <h2>Find Your Dream Job Today!</h2>
      </div>


      {!users ? (
        <div className="text-center my-3">
          <Button className="login-btn" onClick={handleGoogleLogin}>
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
          <h1 className="text-center my-4">Welcome ...</h1>
          {role === "recruiter" ? (
            <RecruiterDashboard users={users} />
          ) : (
            <JobSeekerDashboard users={users} />
          )}
        </>
      )}


      {/* ✅ Footer */}
      <footer className="footer">
        <div className="company-logos">
          <div className="company">
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" />
            <span>Google</span>
          </div>
          <div className="company">
            <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Microsoft" />
            <span>Microsoft</span>
          </div>
          <div className="company">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174872.png" alt="Spotify" />
            <span>Spotify</span>
          </div>
          <div className="company">
            <img src="https://cdn-icons-png.flaticon.com/512/179/179309.png" alt="Apple" />
            <span>Apple</span>
          </div>
        </div>
      </footer>
    </>
  );
}
