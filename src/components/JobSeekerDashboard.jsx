import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import JobCard from "./JobCard";
import { uploadJobs } from "../uploadJobs";
import JobDetailModal from "./JobDetailModal";
import { Form } from "react-bootstrap";

export default function JobSeekerDashboard({ users }) {
    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const jobsCollection = collection(db, "jobs");
    const appsCollection = collection(db, "applications");

    const fetchJobs = async () => {
        const data = await getDocs(jobsCollection);
        setJobs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    useEffect(() => { fetchJobs(); }, []);

    const applyJob = async (jobId) => {
        await addDoc(appsCollection, { jobId, userId: users.uid, appliedAt: new Date().toISOString() });
        alert("Applied successfully!");
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
            <Form className="mb-3 d-flex">
                <Form.Control placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Form.Select className="ms-2" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="salary">Salary</option>
                    <option value="deadline">Deadline</option>
                </Form.Select>
            </Form>

            {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} applyJob={applyJob} viewDetails={viewDetails} />
            ))}

            <JobDetailModal show={showModal} handleClose={() => setShowModal(false)} job={selectedJob} />
        </div>
    );
}