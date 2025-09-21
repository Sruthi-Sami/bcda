import React from "react";
import { Card, Button } from "react-bootstrap";

export default function JobCard({ job, deleteJob, applyJob, isRecruiter, viewDetails }) {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{job.title} - {job.company}</Card.Title>
                <Card.Text>
                    <strong>Location:</strong> {job.location} <br />
                    <strong>Type:</strong> {job.employment_type} <br />
                    <strong>Deadline:</strong> {job.application_deadline}
                </Card.Text>
                <Button variant="info" className="me-2" onClick={() => viewDetails(job)}>View Details</Button>
                {isRecruiter && <Button variant="danger" onClick={() => deleteJob(job.id)}>Delete</Button>}
                {applyJob && <Button variant="success" onClick={() => applyJob(job.id)}>Apply</Button>}
            </Card.Body>
        </Card>
    );
}
