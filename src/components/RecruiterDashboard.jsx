import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import JobCard from "./JobCard";
import JobForm from "./JobForm";
import "./dash.css";
import { Form, Button } from "react-bootstrap";

export default function RecruiterDashboard({ users }) {
    if (!users) {
        return <div className="text-center mt-5">Please log in as a recruiter to view this page.</div>;
    }

    const [jobs, setJobs] = useState([]);
    const [showJobs, setShowJobs] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [editForm, setEditForm] = useState(null);

    const jobsCollection = collection(db, "jobs");

    const fetchJobs = async () => {
        const data = await getDocs(jobsCollection);
        setJobs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    useEffect(() => { fetchJobs(); }, []);

    // Add Job
    const addJob = async (job) => {
        await addDoc(jobsCollection, { ...job, recruiterId: users.uid });
        fetchJobs();
    };

    // Delete Job
    const deleteJobById = async (id) => {
        await deleteDoc(doc(db, "jobs", id));
        fetchJobs();
    };

    // Save edited job
    const saveEditJob = async (job) => {
        if (!job?.id) return;
        const updatedJob = {
            ...job,
            salary_from: Number(job.salary_from),
            salary_to: Number(job.salary_to),
            number_of_opening: Number(job.number_of_opening),
            is_remote_work: Boolean(job.is_remote_work),
            qualifications: job.qualifications.split(",").map(q => q.trim()),
            updated_at: new Date().toISOString(),
        };
        await updateDoc(doc(db, "jobs", job.id), updatedJob);
        setEditForm(null);
        fetchJobs();
    };

    const filteredJobs = jobs
        .filter(job => job.title?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "salary") return (b.salary_from || 0) - (a.salary_from || 0);
            if (sortBy === "deadline") return new Date(a.application_deadline) - new Date(b.application_deadline);
            return 0;
        });

    return (
        <div className="recruiter-dashboard">
            {/* Search & Sort */}
            <Form className="mb-3 d-flex search-form">
                <Form.Control
                    className="search-input"
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Form.Select className="ms-2 sort-select" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="salary">Salary</option>
                    <option value="deadline">Deadline</option>
                </Form.Select>
            </Form>

            {/* Job Form for Add / Edit */}
            <div className="job-form mb-4">
                <JobForm
                    onSubmit={editForm ? saveEditJob : addJob}
                    initialData={editForm}
                    onCancel={() => setEditForm(null)}
                />
            </div>

            {/* Toggle Job List */}
            <Button
                className="view-jobs-btn mb-4"
                onClick={() => setShowJobs(prev => !prev)}
            >
                {showJobs ? "Hide All Jobs" : "View All Jobs"}
            </Button>

            {/* Job Cards */}
            {showJobs && (
                <div className="recruiter-job-list">
                    {filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            deleteJob={job.recruiterId === users.uid ? deleteJobById : undefined}
                            editJob={job.recruiterId === users.uid ? () => setEditForm(job) : undefined}
                            isRecruiter={job.recruiterId === users.uid}
                        />
                    ))}

                </div>
            )}


        </div>
    );
}
