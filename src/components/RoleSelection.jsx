import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Container } from "react-bootstrap";

export default function RoleSelection({ users, setRole, setIsNewUser }) {
    if (!users) return null;

    const chooseRole = async (role) => {
        // Save role to Firestore
        await setDoc(doc(db, "users", users.uid), { email: users.email, role });
        setRole(role);         // Set the role
        setIsNewUser(false);   // Reset isNewUser to redirect immediately
    };

    return (
        <Container style={{ textAlign: "center", marginTop: "3rem", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
            <h3 style={{ marginBottom: "0.5rem", color: "#fff" }}>Choose your role</h3>
            <p style={{ marginBottom: "1.5rem", color: "#fff" }}>
                This will determine your dashboard view and access rights.
            </p>
            <Button
                style={{
                    backgroundColor: "#309689",
                    borderColor: "#309689",
                    color: "#fff",
                    fontWeight: 600,
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    margin: "0.5rem",
                }}
                onClick={() => chooseRole("recruiter")}
            >
                Recruiter
            </Button>
            <Button
                style={{
                    backgroundColor: "#e0e0e0",
                    borderColor: "#ccc",
                    color: "#333",
                    fontWeight: 600,
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    margin: "0.5rem",
                }}
                onClick={() => chooseRole("jobseeker")}
            >
                Job Seeker
            </Button>
        </Container>
    );
}
