import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Container } from "react-bootstrap";

export default function RoleSelection({ user, setRole }) {
    const chooseRole = async (role) => {
        await setDoc(doc(db, "users", user.uid), { email: user.email, role });
        setRole(role);
    };

    return (
        <Container className="text-center mt-5">
            <h3>Choose your role:</h3>
            <Button className="m-2" onClick={() => chooseRole("recruiter")}>Recruiter</Button>
            <Button className="m-2" onClick={() => chooseRole("jobseeker")}>Job Seeker</Button>
        </Container>
    );
}
