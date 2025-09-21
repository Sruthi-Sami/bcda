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
        <Container className="text-center mt-5">
            <h3>Choose your role</h3>
            <p>This will determine your dashboard view and access rights.</p>
            <Button className="m-2" onClick={() => chooseRole("recruiter")}>Recruiter</Button>
            <Button className="m-2" onClick={() => chooseRole("jobseeker")}>Job Seeker</Button>
        </Container>
    );
}