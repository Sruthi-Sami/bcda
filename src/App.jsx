import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import RecruiterDashboard from "./components/RecruiterDashboard";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import RoleSelection from "./components/RoleSelection";
import { Container, Button } from "react-bootstrap";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setRole(userSnap.data().role);
        setUser(currentUser);
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async (selectedRole) => {
    const result = await signInWithPopup(auth, provider);
    const loggedUser = result.user;
    const userRef = doc(db, "users", loggedUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, { email: loggedUser.email, role: selectedRole });
      setRole(selectedRole);
    } else {
      setRole(userSnap.data().role);
    }
    setUser(loggedUser);
  };

  const handleLogout = () => signOut(auth);

  return (
    <Container>
      {!user ? (
        <div className="text-center mt-5">
          <h2>Login with Google</h2>
          <Button className="m-2" onClick={() => handleGoogleLogin("recruiter")}>Recruiter</Button>
          <Button className="m-2" onClick={() => handleGoogleLogin("jobseeker")}>Job Seeker</Button>
        </div>
      ) : !role ? (
        <RoleSelection user={user} setRole={setRole} />
      ) : (
        <>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
          <h1 className="text-center my-4">Job Portal</h1>
          {role === "recruiter" ? <RecruiterDashboard /> : <JobSeekerDashboard user={user} />}
        </>
      )}
    </Container>
  );
}
