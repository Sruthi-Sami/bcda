import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal";
import { Form, Button, InputGroup } from "react-bootstrap";

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const jobsCollection = collection(db, "jobs");

    const fetchJobs = async () => {
        const data = await getDocs(jobsCollection);
        setJobs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    useEffect(() => { fetchJobs(); }, []);

    const addJob = async () => {
        if (!title) return;
        await addDoc(jobsCollection, { title });
        setTitle("");
        fetchJobs();
    };

    const deleteJobById = async (id) => {
        await deleteDoc(doc(db, "jobs", id));
        fetchJobs();
    };

    const viewDetails = (job) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    const filteredJobs = jobs
        .filter(job => job.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "salary") return b.salary_from - a.salary_from;
            if (sortBy === "deadline") return new Date(a.application_deadline) - new Date(b.application_deadline);
            return 0;
        });

    return (
        <div>
            <InputGroup className="mb-3">
                <Form.Control placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Form.Select onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="salary">Salary</option>
                    <option value="deadline">Deadline</option>
                </Form.Select>
            </InputGroup>

            <Form className="mb-3 d-flex">
                <Form.Control placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Button className="ms-2" onClick={addJob}>Add Job</Button>
            </Form>

            {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} deleteJob={deleteJobById} isRecruiter viewDetails={viewDetails} />
            ))}

            <JobDetailModal show={showModal} handleClose={() => setShowModal(false)} job={selectedJob} />
        </div>
    );
}
