import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";

export default function JobSeekerDashboard({ users }) {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState("");

    const jobsCollection = collection(db, "jobs");
    const appsCollection = collection(db, "applications");

    const jobsPerPage = 30;

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
        .filter(job => job.title?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "salary") return (b.salary_from || 0) - (a.salary_from || 0);
            if (sortBy === "deadline") return new Date(a.application_deadline) - new Date(b.application_deadline);
            return 0;
        });

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

    const goFirst = () => setCurrentPage(1);
    const goPrev = () => setCurrentPage(p => Math.max(p - 1, 1));
    const goNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const goLast = () => setCurrentPage(totalPages);

    const handleJumpPage = () => {
        const pageNum = Number(jumpPage);
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
        setJumpPage("");
    };

    return (
        <div>
            <Form className="mb-3 d-flex">
                <Form.Control
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Form.Select className="ms-2" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="salary">Salary</option>
                    <option value="deadline">Deadline</option>
                </Form.Select>
            </Form>

            <Row className="mb-3">
                {currentJobs.map((job) => (
                    <Col md={6} key={job.id} className="mb-3">
                        <JobCard job={job} applyJob={applyJob} viewDetails={viewDetails} />
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
                <Button variant="secondary" className="me-2 mb-2" onClick={goFirst} disabled={currentPage === 1}>
                    &larr; First
                </Button>
                <Button variant="secondary" className="me-2 mb-2" onClick={goPrev} disabled={currentPage === 1}>
                    &larr; Prev
                </Button>
                <span className="mx-2 mb-2">Page {currentPage} of {totalPages}</span>
                <Button variant="secondary" className="ms-2 mb-2" onClick={goNext} disabled={currentPage === totalPages}>
                    Next &rarr;
                </Button>
                <Button variant="secondary" className="ms-2 mb-2" onClick={goLast} disabled={currentPage === totalPages}>
                    Last &rarr;
                </Button>


                {/* Jump to page input */}
                <InputGroup className="ms-2 mb-2" style={{ width: "120px" }}>
                    <Form.Control
                        placeholder="Go to page"
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        type="number"
                        min="1"
                        max={totalPages}
                    />
                    <Button variant="primary" onClick={handleJumpPage}>Go</Button>
                </InputGroup>
            </div>

            <JobDetailModal show={showModal} handleClose={() => setShowModal(false)} job={selectedJob} />
        </div>
    );
}