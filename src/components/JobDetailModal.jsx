import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function JobDetailModal({ show, handleClose, job }) {
    if (!job) return null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{job.title} - {job.company}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary_from} - {job.salary_to}</p>
                <p><strong>Type:</strong> {job.employment_type}</p>
                <p><strong>Deadline:</strong> {job.application_deadline}</p>
                <p><strong>Qualifications:</strong>{" "}{Array.isArray(job.qualifications) ? job.qualifications.join(", ") : job.qualifications || "N/A"}</p>
                <p><strong>Description:</strong> {job.description}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}