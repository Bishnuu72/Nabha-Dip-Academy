import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  addDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  terminate
} from "firebase/firestore";

// Nabha Dip Academy Secondary English School Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBhGb7bbzAu-Xq9u6wHvL8829EOcZ9yrwk",
  authDomain: "ndases.firebaseapp.com",
  projectId: "ndases",
  storageBucket: "ndases.firebasestorage.app",
  messagingSenderId: "569939627268",
  appId: "1:569939627268:web:d8b60bb9adb286ea63d451",
  measurementId: "G-N182J0K9M3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper for promise timeout
const runWithTimeout = (promise, ms, errorMessage) => {
  let id;
  const timeout = new Promise((_, reject) => {
    id = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
  });
  return Promise.race([promise, timeout]).then((result) => {
    clearTimeout(id);
    return result;
  });
};

// Helper to sign up or sign in users and return their UID
const getOrCreateUser = async (email, password, name) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`Registered new demo user: ${name} (${email})`);
    return credential.user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      console.log(`Demo user exists, logged in: ${name} (${email})`);
      return credential.user.uid;
    } else if (err.code === 'auth/operation-not-allowed') {
      console.warn(`[WARNING] Firebase Auth Email/Password sign-in method is not enabled in your Firebase console.`);
      console.warn(`Please go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.`);
      return null;
    } else {
      console.error(`Error configuring Auth user ${email}:`, err.message);
      return null;
    }
  }
};

// Helper to clear collections to avoid duplicate documents
const clearCollection = async (collectionName) => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared collection: ${collectionName}`);
  } catch (err) {
    console.warn(`Warning clearing collection ${collectionName}:`, err.message);
  }
};

const runSeeder = async () => {
  console.log("=================================================");
  console.log("Nabhadip Academy Secondary English School Seeder ");
  console.log("=================================================");
  
  try {
    // Connection pre-check
    console.log("Checking Cloud Firestore connectivity...");
    try {
      await runWithTimeout(
        setDoc(doc(db, "system", "config_test"), { test: true }),
        4500,
        "Cloud Firestore write timed out. The Cloud Firestore API is either disabled or the database has not been created yet in the Firebase Console."
      );
      console.log("Cloud Firestore connection verified.");
    } catch (err) {
      console.error("\n=================================================");
      console.error("CRITICAL: Cloud Firestore is not accessible.");
      console.error("Reason:", err.message);
      console.error("\nTo resolve this and sync live database values:");
      console.error("1. Open the Firebase Console: https://console.firebase.google.com/");
      console.error("2. Go to 'Firestore Database' and click 'Create database'.");
      console.error("3. Set security rules to 'test mode' (or configure appropriate rules) and click enable.");
      console.error("4. Go to 'Authentication' > 'Sign-in method' and enable 'Email/Password' provider.");
      console.error("5. Re-run this script: npm run seed");
      console.error("\nNote: The front panel UI will run perfectly with our offline mock fallback data until then.");
      console.error("=================================================\n");
      
      try {
        await terminate(db);
      } catch (e) {}
      process.exit(1);
    }

    // 1. Create/Retrieve Demo Accounts
    console.log("\nConfiguring Firebase Auth & Firestore profiles...");
    
    // Admin Account
    const adminUid = await getOrCreateUser("admin@gmail.com", "admin123", "System Root Admin");
    if (adminUid) {
      await setDoc(doc(db, "users", adminUid), {
        uid: adminUid,
        name: "System Root Admin",
        email: "admin@gmail.com",
        role: "admin"
      });
    }
    // Set fallback document
    await setDoc(doc(db, "users", "admin_demo_uid"), {
      uid: "admin_demo_uid",
      name: "System Root Admin",
      email: "admin@gmail.com",
      role: "admin"
    });
    
    // Teacher Account
    const teacherUid = await getOrCreateUser("teacher@school.edu", "teacher123", "Dr. Anand Verma");
    if (teacherUid) {
      await setDoc(doc(db, "users", teacherUid), {
        uid: teacherUid,
        name: "Dr. Anand Verma",
        email: "teacher@school.edu",
        role: "teacher",
        department: "Science",
        phone: "9841112233"
      });
    }
    // Set fallback document
    await setDoc(doc(db, "users", "teacher_demo_uid"), {
      uid: "teacher_demo_uid",
      name: "Dr. Anand Verma",
      email: "teacher@school.edu",
      role: "teacher",
      department: "Science",
      phone: "9841112233"
    });
    
    // Student Account
    const studentUid = await getOrCreateUser("student@school.edu", "student123", "Rahul Sharma");
    if (studentUid) {
      await setDoc(doc(db, "users", studentUid), {
        uid: studentUid,
        name: "Rahul Sharma",
        email: "student@school.edu",
        role: "student",
        stream: "Secondary",
        grade: "Class 10",
        rollNumber: "1001",
        parentEmail: "parent@school.edu",
        id: "S1001"
      });
    }
    // Set fallback document
    await setDoc(doc(db, "users", "student_demo_uid"), {
      uid: "student_demo_uid",
      name: "Rahul Sharma",
      email: "student@school.edu",
      role: "student",
      stream: "Secondary",
      grade: "Class 10",
      rollNumber: "1001",
      parentEmail: "parent@school.edu",
      id: "S1001"
    });
    
    // Parent Account
    const parentUid = await getOrCreateUser("parent@school.edu", "parent123", "Sunita Sharma");
    if (parentUid) {
      await setDoc(doc(db, "users", parentUid), {
        uid: parentUid,
        name: "Sunita Sharma",
        email: "parent@school.edu",
        role: "parent",
        childName: "Rahul Sharma",
        childRoll: "1001"
      });
    }
    // Set fallback document
    await setDoc(doc(db, "users", "parent_demo_uid"), {
      uid: "parent_demo_uid",
      name: "Sunita Sharma",
      email: "parent@school.edu",
      role: "parent",
      childName: "Rahul Sharma",
      childRoll: "1001"
    });

    // Try signing out
    try {
      await signOut(auth);
    } catch (e) {}
    console.log("Auth profiles setup complete.");

    // 2. Clear Existing Collections
    console.log("\nClearing old database records...");
    const collectionsToClear = [
      "notices", "events", "gallery", "students", "teachers", 
      "courses", "attendance", "results", "assignments", 
      "submissions", "leaveApplications", "applications", "inquiries"
    ];
    for (const col of collectionsToClear) {
      await clearCollection(col);
    }

    // 3. Seed Collections
    console.log("\nSeeding new school datasets...");

    // 3a. Notices
    const noticesCol = collection(db, "notices");
    const notices = [
      {
        title: "First Term Examination Schedule 2083",
        content: "First Term examinations for Class 1 to Class 10 will begin on July 10, 2026. The exam routine and details have been dispatched to all student and parent portals. Montessori/Nursery classes will have regular evaluations.",
        category: "academic",
        date: "2026-06-22",
        fileUrl: "#"
      },
      {
        title: "Admissions Open for Academic Session 2083 B.S.",
        content: "Admissions are officially open at Nabha Dip Academy Secondary English School for Academic Session 2083 B.S. from Montessori and Nursery up to Class 10. Digital forms are available now.",
        category: "academic",
        date: "2026-06-20",
        fileUrl: "#"
      },
      {
        title: "Montessori Play Wing Expansion Ceremony",
        content: "We have completed the extension of our dedicated Montessori building with an indoor toddler play arena. All primary division parents are welcome to check it out this Friday at 10:00 AM.",
        category: "events",
        date: "2026-06-18",
        fileUrl: "#"
      },
      {
        title: "NDA Green Campus Campaign - Established 2066 B.S.",
        content: "Commemorating 17 years since Nabha Dip Academy was established in 2066 B.S., we are organizing a plantation and cleanliness drive on Monday. Students are advised to bring safety gloves.",
        category: "administrative",
        date: "2026-06-15",
        fileUrl: "#"
      },
      {
        title: "Monsoon School Holidays Announcement",
        content: "Please note that Nabha Dip Academy will remain closed for monsoon vacation from July 15 to July 25. Regular operations resume from July 26. Stay safe during the monsoon rains.",
        category: "administrative",
        date: "2026-06-10",
        fileUrl: "#"
      }
    ];
    for (const notice of notices) {
      await addDoc(noticesCol, notice);
    }
    console.log(`Added ${notices.length} notices.`);

    // 3b. Events
    const eventsCol = collection(db, "events");
    const events = [
      {
        title: "Annual Montessori Sports Gala",
        description: "Fun athletic routines, interactive obstacle courses, and balloon popping races for Montessori, Nursery, LKG, and UKG wings.",
        date: "2026-06-28",
        time: "10:00 AM - 01:00 PM",
        location: "NDA Junior Grounds",
        registeredCount: 38,
        maxSeats: 100,
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80"
      },
      {
        title: "Class 10 Science Model Fair",
        description: "Exhibitions by Class 9 and Class 10 students demonstrating renewable energy models, robotics, and water treatment designs.",
        date: "2026-07-05",
        time: "09:00 AM - 03:00 PM",
        location: "NDA Main Auditorium",
        registeredCount: 64,
        maxSeats: 150,
        image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=500&q=80"
      },
      {
        title: "Inter-School Football Championship",
        description: "NDA Senior Football Team squares off against Bright Future High School in the district tournament qualifier match.",
        date: "2026-07-12",
        time: "02:00 PM - 05:00 PM",
        location: "NDA Main Turf",
        registeredCount: 112,
        maxSeats: 250,
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80"
      }
    ];
    for (const ev of events) {
      await addDoc(eventsCol, ev);
    }
    console.log(`Added ${events.length} events.`);

    // 3c. Gallery
    const galleryCol = collection(db, "gallery");
    const gallery = [
      {
        title: "Montessori Activity Session",
        type: "photo",
        category: "campus",
        url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=80",
        description: "Toddler students learning and solving block puzzles."
      },
      {
        title: "Class Room Group Work",
        type: "photo",
        category: "campus",
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
        description: "Primary school division working on team arts and crafts projects."
      },
      {
        title: "Annual Sports Champion Ceremony",
        type: "photo",
        category: "sports",
        url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80",
        description: " NDA High School division students celebrating and lifting the inter-house shield."
      },
      {
        title: "New ICT Computer Lab Setup",
        type: "photo",
        category: "campus",
        url: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80",
        description: "Students checking out the newly updated Class 6-10 computer programming lab."
      }
    ];
    for (const item of gallery) {
      await addDoc(galleryCol, item);
    }
    console.log(`Added ${gallery.length} gallery items.`);

    // 3d. Students
    const studentsCol = collection(db, "students");
    const students = [
      {
        id: "S1001",
        name: "Rahul Sharma",
        email: "student@school.edu",
        stream: "Secondary",
        grade: "Class 10",
        rollNumber: "1001",
        parentEmail: "parent@school.edu"
      },
      {
        id: "S902",
        name: "Nisha Karki",
        email: "nisha@school.edu",
        stream: "Secondary",
        grade: "Class 9",
        rollNumber: "902",
        parentEmail: "parent.nisha@example.com"
      },
      {
        id: "S503",
        name: "Kabir Thapa",
        email: "kabir@school.edu",
        stream: "Primary",
        grade: "Class 5",
        rollNumber: "503",
        parentEmail: "parent.kabir@example.com"
      },
      {
        id: "S204",
        name: "Aayush Yadav",
        email: "aayush@school.edu",
        stream: "Primary",
        grade: "Class 2",
        rollNumber: "204",
        parentEmail: "parent.aayush@example.com"
      },
      {
        id: "S105",
        name: "Maya Tamang",
        email: "maya@school.edu",
        stream: "Pre-Primary",
        grade: "UKG",
        rollNumber: "105",
        parentEmail: "parent.maya@example.com"
      }
    ];
    for (const student of students) {
      // Use document id matching student.id to make updates easy
      await setDoc(doc(studentsCol, student.id), student);
    }
    console.log(`Added ${students.length} students to roster.`);

    // 3e. Teachers
    const teachersCol = collection(db, "teachers");
    const teachers = [
      {
        id: "T101",
        name: "Dr. Anand Verma",
        email: "teacher@school.edu",
        department: "Science",
        phone: "9841112233"
      },
      {
        id: "T102",
        name: "Ms. Emily Blunt",
        email: "emily@school.edu",
        department: "Humanities",
        phone: "9851112233"
      },
      {
        id: "T103",
        name: "Mr. Rajesh Yadav",
        email: "rajesh@school.edu",
        department: "Mathematics",
        phone: "9861112233"
      },
      {
        id: "T104",
        name: "Mrs. Geeta Bhatta",
        email: "geeta@school.edu",
        department: "Language",
        phone: "9871112233"
      }
    ];
    for (const teacher of teachers) {
      await setDoc(doc(teachersCol, teacher.id), teacher);
    }
    console.log(`Added ${teachers.length} teachers to roster.`);

    // 3f. Courses
    const coursesCol = collection(db, "courses");
    const courses = [
      {
        id: "PHY-10",
        name: "Science X (Physics)",
        stream: "Secondary",
        grade: "Class 10",
        instructor: "Dr. Anand Verma"
      },
      {
        id: "MTH-10",
        name: "Mathematics X",
        stream: "Secondary",
        grade: "Class 10",
        instructor: "Mr. Rajesh Yadav"
      },
      {
        id: "ENG-10",
        name: "English Literature X",
        stream: "Secondary",
        grade: "Class 10",
        instructor: "Ms. Emily Blunt"
      },
      {
        id: "NEP-10",
        name: "Nepali X",
        stream: "Secondary",
        grade: "Class 10",
        instructor: "Mrs. Geeta Bhatta"
      },
      {
        id: "SCI-5",
        name: "Science V",
        stream: "Primary",
        grade: "Class 5",
        instructor: "Dr. Anand Verma"
      },
      {
        id: "MTH-2",
        name: "Mathematics II",
        stream: "Primary",
        grade: "Class 2",
        instructor: "Mr. Rajesh Yadav"
      }
    ];
    for (const course of courses) {
      await setDoc(doc(coursesCol, course.id), course);
    }
    console.log(`Added ${courses.length} courses to curriculum.`);

    // 3g. Attendance
    const attendanceCol = collection(db, "attendance");
    const attendanceLogs = [
      { rollNumber: "1001", date: "2026-06-18", status: "Present" },
      { rollNumber: "1001", date: "2026-06-19", status: "Present" },
      { rollNumber: "1001", date: "2026-06-20", status: "Present" },
      { rollNumber: "1001", date: "2026-06-21", status: "Absent" },
      { rollNumber: "1001", date: "2026-06-22", status: "Present" },
      { rollNumber: "1001", date: "2026-06-23", status: "Present" },
      { rollNumber: "902", date: "2026-06-23", status: "Present" },
      { rollNumber: "503", date: "2026-06-23", status: "Present" },
      { rollNumber: "204", date: "2026-06-23", status: "Present" }
    ];
    for (const log of attendanceLogs) {
      const docId = `${log.rollNumber}_${log.date}`;
      await setDoc(doc(attendanceCol, docId), log);
    }
    console.log(`Added ${attendanceLogs.length} attendance logs.`);

    // 3h. Results
    const resultsCol = collection(db, "results");
    const results = [
      {
        studentId: "S1001",
        studentName: "Rahul Sharma",
        rollNumber: "1001",
        examName: "First Term Exams",
        marks: {
          Science: 92,
          Mathematics: 95,
          English: 84,
          Nepali: 78,
          "Social Studies": 86
        }
      },
      {
        studentId: "S902",
        studentName: "Nisha Karki",
        rollNumber: "902",
        examName: "First Term Exams",
        marks: {
          Science: 85,
          Mathematics: 88,
          English: 90,
          Nepali: 82,
          "Social Studies": 80
        }
      }
    ];
    for (const res of results) {
      const docId = `${res.rollNumber}_${res.examName.replace(/\s+/g, '_')}`;
      await setDoc(doc(resultsCol, docId), res);
    }
    console.log(`Added ${results.length} exam results.`);

    // 3i. Assignments & Submissions
    const assignmentsCol = collection(db, "assignments");
    const submissionsCol = collection(db, "submissions");

    const assign1 = {
      title: "Physics Speed Graph Analysis",
      description: "Plot speed-time charts for the given data and calculate acceleration levels. Scan as PDF.",
      courseName: "Science X (Physics)",
      dueDate: "2026-06-30",
      teacherName: "Dr. Anand Verma"
    };
    const assign2 = {
      title: "Mathematics Algebra Practice Sheets",
      description: "Solve all problems on linear equations in Section 4.3 of the textbook. Show all workings.",
      courseName: "Mathematics X",
      dueDate: "2026-07-02",
      teacherName: "Mr. Rajesh Yadav"
    };

    const ass1Ref = await addDoc(assignmentsCol, assign1);
    const ass2Ref = await addDoc(assignmentsCol, assign2);
    console.log("Added assignments.");

    const submissions = [
      {
        assignmentId: ass1Ref.id,
        studentId: "S1001",
        studentName: "Rahul Sharma",
        fileName: "physics_speed_graph_rahul.pdf",
        submissionDate: "2026-06-22",
        status: "Graded",
        score: 92,
        feedback: "Excellent plotting of graph coordinates. Try to make vector arrows cleaner next time."
      },
      {
        assignmentId: ass1Ref.id,
        studentId: "S902",
        studentName: "Nisha Karki",
        fileName: "physics_lab_nisha.pdf",
        submissionDate: "2026-06-23",
        status: "Submitted"
      }
    ];
    for (const sub of submissions) {
      await addDoc(submissionsCol, sub);
    }
    console.log(`Added ${submissions.length} assignment submissions.`);

    // 3j. Leave Applications
    const leaveCol = collection(db, "leaveApplications");
    const leaves = [
      {
        studentId: "S1001",
        studentName: "Rahul Sharma",
        parentName: "Sunita Sharma",
        parentEmail: "parent@school.edu",
        reason: "Family wedding ceremony in Pokhara.",
        startDate: "2026-06-25",
        endDate: "2026-06-27",
        status: "approved",
        date: "2026-06-22"
      }
    ];
    for (const leave of leaves) {
      await addDoc(leaveCol, leave);
    }
    console.log(`Added ${leaves.length} leave requests.`);

    // 3k. Admissions Applications
    const applicationsCol = collection(db, "applications");
    const applications = [
      {
        studentName: "Rohan Adhikari",
        email: "rohan@example.com",
        stream: "Secondary",
        grade: "Class 10",
        gpa: "3.85",
        parentEmail: "parent.rohan@example.com",
        date: "2026-06-21",
        status: "pending"
      },
      {
        studentName: "Kriti Bhattarai",
        email: "kriti@example.com",
        stream: "Primary",
        grade: "Class 4",
        gpa: "3.70",
        parentEmail: "parent.kriti@example.com",
        date: "2026-06-22",
        status: "approved"
      }
    ];
    for (const app of applications) {
      await addDoc(applicationsCol, app);
    }
    console.log(`Added ${applications.length} admission applications.`);

    // 3l. Contact Inquiries
    const inquiriesCol = collection(db, "inquiries");
    const inquiries = [
      {
        name: "Hari Prasad",
        email: "hari@example.com",
        subject: "Montessori Fee Structure Query",
        message: "Could you send over the details regarding nursery/Montessori admissions fees and meal plans? Thank you.",
        date: "2026-06-22"
      }
    ];
    for (const inquiry of inquiries) {
      await addDoc(inquiriesCol, inquiry);
    }
    console.log(`Added ${inquiries.length} contact inquiries.`);

    // 4. Update System Seed Config Flag
    console.log("\nUpdating seeding flag in Firestore...");
    await setDoc(doc(db, "system", "config"), { seeded: true });
    
    console.log("\n=================================================");
    console.log("Firebase Seeding Operations Completed Successfully!");
    console.log("=================================================");
    
  } catch (err) {
    console.error("\nFirestore seeding failed with fatal error:", err);
    process.exit(1);
  }
};

runSeeder();
