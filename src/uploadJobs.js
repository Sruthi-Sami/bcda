import jobs from "./jobs.json";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const uploadJobs = async () => {
    const jobsCollection = collection(db, "jobs");
    for (let job of jobs) {
        await addDoc(jobsCollection, job);
    }
    alert("Jobs uploaded!");
};