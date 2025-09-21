import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function JobForm({ onSubmit }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        salary_from: "",
        salary_to: "",
        employment_type: "",
        application_deadline: "",
        qualifications: "",
        contact: "",
        job_category: "",
        is_remote_work: false,
        number_of_opening: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const jobData = {
            ...form,
            salary_from: Number(form.salary_from),
            salary_to: Number(form.salary_to),
            number_of_opening: Number(form.number_of_opening),
            is_remote_work: Boolean(form.is_remote_work),
            qualifications: form.qualifications.split(",").map(q => q.trim()),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        onSubmit(jobData);
        setForm({
            title: "",
            description: "",
            company: "",
            location: "",
            salary_from: "",
            salary_to: "",
            employment_type: "",
            application_deadline: "",
            qualifications: "",
            contact: "",
            job_category: "",
            is_remote_work: false,
            number_of_opening: "",
        });
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4">
            <Row>
                <Col><Form.Control name="title" placeholder="Title" value={form.title} onChange={handleChange} required /></Col>
                <Col><Form.Control name="company" placeholder="Company" value={form.company} onChange={handleChange} required /></Col>
            </Row>
            <Row className="mt-2">
                <Col><Form.Control name="location" placeholder="Location" value={form.location} onChange={handleChange} required /></Col>
                <Col><Form.Control name="job_category" placeholder="Job Category" value={form.job_category} onChange={handleChange} required /></Col>
            </Row>
            <Row className="mt-2">
                <Col><Form.Control name="salary_from" type="number" placeholder="Salary From" value={form.salary_from} onChange={handleChange} required /></Col>
                <Col><Form.Control name="salary_to" type="number" placeholder="Salary To" value={form.salary_to} onChange={handleChange} required /></Col>
            </Row>
            <Row className="mt-2">
                <Col><Form.Control name="employment_type" placeholder="Employment Type" value={form.employment_type} onChange={handleChange} required /></Col>
                <Col><Form.Control name="application_deadline" placeholder="Application Deadline" value={form.application_deadline} onChange={handleChange} required /></Col>
            </Row>
            <Row className="mt-2">
                <Col><Form.Control name="number_of_opening" type="number" placeholder="Number of Openings" value={form.number_of_opening} onChange={handleChange} required /></Col>
                <Col>
                    <Form.Check
                        type="checkbox"
                        label="Remote Work"
                        name="is_remote_work"
                        checked={form.is_remote_work}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Form.Group className="mt-2">
                <Form.Control as="textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mt-2">
                <Form.Control name="qualifications" placeholder='Qualifications (comma separated)' value={form.qualifications} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mt-2">
                <Form.Control name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" className="mt-3">Add Job</Button>
        </Form>
    );
}