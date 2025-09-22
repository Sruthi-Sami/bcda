# JobList

A modern job portal web application built with React and Firebase.  
Recruiters can post, edit, and manage jobs. Job seekers can search, filter, and apply for jobs.

---

## Features

- *Google Authentication* for secure login
- *Role selection*: Choose Recruiter or Job Seeker on first login
- *Recruiter Dashboard*:  
  - Add, edit, and delete your own jobs  
  - View all jobs (collapsible)
- *Job Seeker Dashboard*:  
  - Search and filter jobs  
  - Paginated job listings  
  - Apply to jobs
- *Responsive UI* with React Bootstrap
- *Firestore* for real-time job and user data

---

## Getting Started

### 1. Clone the repository

bash
git clone https://github.com/yourusername/joblist.git
cd joblist


### 2. Install dependencies

bash
npm install


### 3. Firebase Setup

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable *Authentication* (Google Sign-In)
- Enable *Firestore Database*
- In your project, copy your Firebase config and update src/firebase.js:

js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);


### 4. Run the app

bash
npm run dev


Visit [http://localhost:5173](http://localhost:5173) (or the port Vite shows).

---

## Project Structure


src/
  App.jsx
  firebase.js
  components/
    JobCard.jsx
    JobCard.css
    JobDetailModal.jsx
    JobForm.jsx
    JobSeekerDashboard.jsx
    JobSeekerDashboard.css
    RecruiterDashboard.jsx
    RecruiterDashboard.css
    RoleSelection.jsx
  jobs.json
  ...
public/
  vite.svg


---

## Customization

- *Styling:*  
  Edit App.css, JobSeekerDashboard.css, and RecruiterDashboard.css for custom look and feel.
- *Job Data:*  
  Update jobs.json and use uploadJobs.js to seed Firestore if needed.
- *Role Logic:*  
  Role is stored in Firestore under users collection and determines dashboard access.

---
