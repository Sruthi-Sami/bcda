import React from "react";
import { Card, Button } from "react-bootstrap";


export default function JobCard({ job, deleteJob, editJob, applyJob, isRecruiter, viewDetails }) {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{job.title} - {job.company}</Card.Title>
                <Card.Text>
                    <strong>Location:</strong> {job.location} <br />
                    <strong>Type:</strong> {job.employment_type} <br />
                    <strong>Category:</strong> {job.job_category} <br />
                    <strong>Remote:</strong> {job.is_remote_work ? "Yes" : "No"} <br />
                    <strong>Openings:</strong> {job.number_of_opening} <br />
                    <strong>Salary:</strong> {job.salary_from} - {job.salary_to} <br />
                    <strong>Deadline:</strong> {job.application_deadline} <br />
                    <strong>Contact:</strong> {job.contact} <br />
                    <strong>Qualifications:</strong> {Array.isArray(job.qualifications) ? job.qualifications.join(", ") : job.qualifications} <br />
                    <strong>Description:</strong> {job.description} <br />
                    <strong>Created:</strong> {job.created_at} <br />
                    <strong>Updated:</strong> {job.updated_at} <br />
                </Card.Text>
                <Button variant="info" className="me-2" onClick={() => viewDetails(job)}>View Details</Button>
                {deleteJob && <Button variant="danger" className="me-2" onClick={() => deleteJob(job.id)}>Delete</Button>}
                {editJob && <Button variant="warning" onClick={() => editJob(job)}>Edit</Button>}
                {applyJob && <Button variant="success" onClick={() => applyJob(job.id)}>Apply</Button>}
            </Card.Body>
        </Card>
    );
}