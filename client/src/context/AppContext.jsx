import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where,
  writeBatch 
} from 'firebase/firestore';

export const AppContext = createContext();

const SESSION_KEY = 'ndases-session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

const getSavedSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s.user || !s.role || Date.now() - s.time > SESSION_DURATION) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch (e) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const AppProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  const [activeRole, setActiveRole] = useState('guest');
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // --- Session helpers ---
  const saveSession = (user, role) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        user,
        role,
        time: Date.now()
      }));
    } catch (e) {}
  };

  const clearSession = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  };

  // Firestore Collection States (initially empty — no demo data)
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [deletedStudents, setDeletedStudents] = useState([]);
  const [batchCompletedStudents, setBatchCompletedStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [parents, setParents] = useState([]);
  const [schoolConfig, setSchoolConfig] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Mark as ready after first Firestore sync or fallback timeout
  useEffect(() => {
    if (isLiveBackend) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(timer);
  }, [isLiveBackend]);

  // --- SESSION RESTORE (must run before auth listener) ---
  useEffect(() => {
    const s = getSavedSession();
    if (s?.user && s?.role) {
      setCurrentUser(s.user);
      setActiveRole(s.role);
      // Fetch latest user data from Firestore so profileImage etc. are up-to-date
      const uid = s.user.uid || s.user.id;
      if (uid) {
        getDoc(doc(db, 'users', uid)).then(docSnap => {
          if (docSnap.exists()) {
            const fresh = docSnap.data();
            setCurrentUser(fresh);
            setActiveRole(fresh.role || s.role);
            saveSession(fresh, fresh.role || s.role);
          }
        }).catch(() => {});
      }
    }
    setSessionChecked(true);
  }, []);

  // --- 1. FIREBASE AUTH STATE LISTENER (REAL-TIME SNAPSHOT) ---
  useEffect(() => {
    let unsubUserSnap = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch details from Firestore users collection in real-time
        // Use consistent doc ID: admin_demo_uid for admin email, otherwise Firebase UID
        const userDocId = user.email === 'admin@gmail.com' ? 'admin_demo_uid' : user.uid;
        try {
          const userDocRef = doc(db, 'users', userDocId);
          unsubUserSnap = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setCurrentUser(userData);
              setActiveRole(userData.role);
              setIsLiveBackend(true);
            } else {
              const fallbackUser = {
                uid: userDocId,
                name: user.email.split('@')[0],
                email: user.email,
                role: user.email === 'admin@gmail.com' ? 'admin' : 'student'
              };
              setCurrentUser(fallbackUser);
              setActiveRole(fallbackUser.role);
            }
          }, (err) => {
            console.warn("User profile listener failed:", err.message);
          });
        } catch (e) {
          console.warn("Auth sync error with Firestore, using fallback local profile.");
          const fallbackUser = {
            uid: userDocId,
            name: user.email.split('@')[0],
            email: user.email,
            role: user.email === 'admin@gmail.com' ? 'admin' : 'student'
          };
          setCurrentUser(fallbackUser);
          setActiveRole(fallbackUser.role);
        }
      } else {
        if (unsubUserSnap) unsubUserSnap();
        // Don't clear currentUser if we have a saved session (custom login)
        if (!getSavedSession()) {
          setCurrentUser(null);
          setActiveRole('guest');
        }
        setSessionChecked(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubUserSnap) unsubUserSnap();
    };
  }, []);

  // --- 2. FIRESTORE REAL-TIME COLLECTION LISTENERS ---
  useEffect(() => {
    const handleErr = (colName) => (err) => {
      console.warn(`Firestore collection listener failed on '${colName}':`, err.message);
    };

    // Notices Listener (Sorted by date descending)
    const qNotices = query(collection(db, 'notices'), orderBy('date', 'desc'));
    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(items);
      setIsLiveBackend(true);
    }, handleErr('notices'));

    // Events Listener
    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(items);
      setIsLiveBackend(true);
    }, handleErr('events'));

    // Inquiries Listener
    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(items);
      setIsLiveBackend(true);
    }, handleErr('inquiries'));

    // Applications Listener
    const unsubApplications = onSnapshot(collection(db, 'applications'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(items);
      setIsLiveBackend(true);
    }, handleErr('applications'));

    // Students Listener (all students, filter client-side since `deleted`/`batchCompleted` may be missing)
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(items.filter(s => !s.deleted && !s.batchCompleted));
      setDeletedStudents(items.filter(s => s.deleted && !s.batchCompleted));
      setBatchCompletedStudents(items.filter(s => s.batchCompleted));
      setIsLiveBackend(true);
    }, handleErr('students'));

    // Teachers Listener
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachers(items);
      setIsLiveBackend(true);
    }, handleErr('teachers'));

        // Subjects Listener
        const unsubSubjects = onSnapshot(collection(db, 'subjects'), (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSubjects(items);
          setIsLiveBackend(true);
        }, handleErr('subjects'));

    // Attendance Log Listener (Flat documents mapping to studentRoll map)
    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      const mapped = {};
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        if (!mapped[data.rollNumber]) {
          mapped[data.rollNumber] = [];
        }
        mapped[data.rollNumber].push({ date: data.date, status: data.status });
      });
      setAttendance(mapped);
      setIsLiveBackend(true);
    }, handleErr('attendance'));

    // Results Listener
    const unsubResults = onSnapshot(collection(db, 'results'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(items);
      setIsLiveBackend(true);
    }, handleErr('results'));

    // Assignments Listener
    const unsubAssignments = onSnapshot(collection(db, 'assignments'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignments(items);
      setIsLiveBackend(true);
    }, handleErr('assignments'));

    // Submissions Listener
    const unsubSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(items);
      setIsLiveBackend(true);
    }, handleErr('submissions'));

    // Leave Applications Listener
    const unsubLeaves = onSnapshot(collection(db, 'leaveApplications'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaveApplications(items);
      setIsLiveBackend(true);
    }, handleErr('leaveApplications'));

    // Gallery Listener
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGallery(items);
      setIsLiveBackend(true);
    }, handleErr('gallery'));

    // Invoices Listener
    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvoices(items);
      setIsLiveBackend(true);
    }, handleErr('invoices'));

    // Users List Listener
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(items);
      setIsLiveBackend(true);
    }, handleErr('users'));

    // Parents Listener
    const unsubParents = onSnapshot(collection(db, 'parents'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParents(items);
      setIsLiveBackend(true);
    }, handleErr('parents'));

    // Announcements Listener (Sorted by date descending)
    const qAnnouncements = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(items);
      setIsLiveBackend(true);
    }, handleErr('announcements'));

    // Testimonials Listener
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(items);
      setIsLiveBackend(true);
    }, handleErr('testimonials'));

    // School Config Listener
    const unsubConfig = onSnapshot(doc(db, 'system', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setSchoolConfig(docSnap.data());
        setIsLiveBackend(true);
      }
    }, handleErr('systemConfig'));

    return () => {
      unsubNotices();
      unsubEvents();
      unsubInquiries();
      unsubApplications();
      unsubStudents();
      unsubTeachers();
      unsubSubjects();
      unsubAttendance();
      unsubResults();
      unsubAssignments();
      unsubSubmissions();
      unsubLeaves();
      unsubGallery();
      unsubInvoices();
      unsubUsers();
      unsubParents();
      unsubAnnouncements();
      unsubTestimonials();
      unsubConfig();
    };
  }, []);

  // --- 3a. SYNC CURRENT PARENT USER WITH FIRESTORE UPDATES ---
  useEffect(() => {
    if (activeRole !== 'parent') return;
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    const fresh = parents.find(p => p.id === uid);
    if (!fresh) return;
    const children = fresh.children || [];
    const oldChildren = currentUser?.children || [];
    if (JSON.stringify(children) === JSON.stringify(oldChildren)) return;
    const synced = {
      ...currentUser,
      name: fresh.name,
      email: fresh.email,
      phone: fresh.phone || '',
      children,
      childRoll: children.length > 0 ? children[0].rollNumber : '',
      childName: children.length > 0 ? children[0].name : ''
    };
    setCurrentUser(synced);
    saveSession(synced, 'parent');
  }, [parents, activeRole]);

  // --- 4. AUTO-SEED SEEDER SCRIPT ---
  useEffect(() => {
    const SEED_VERSION = 2;
    const autoSeed = async () => {
      try {
        const flagDocRef = doc(db, 'system', 'config');
        const flagDocSnap = await getDoc(flagDocRef);
        const isSeeded = flagDocSnap.exists() && (flagDocSnap.data().seeded || flagDocSnap.data().seededVersion);
        const existingVersion = flagDocSnap.exists() ? (flagDocSnap.data().seededVersion || 1) : 0;

        // Already seeded at current version — skip everything
        if (existingVersion >= SEED_VERSION) return;

        // Already seeded at v1 — only run the migration
        if (isSeeded && existingVersion < SEED_VERSION) {
          console.log("Upgrading seed to v2");

          const studentsCol = collection(db, 'students');
          const studentsSnap = await getDocs(studentsCol);

          // Dedup: delete duplicates by rollNumber, keep first
          const seenRoll = new Map();
          const deletes = [];
          studentsSnap.forEach(docSnap => {
            const data = docSnap.data();
            if (seenRoll.has(data.rollNumber)) {
              deletes.push(deleteDoc(docSnap.ref));
            } else {
              seenRoll.set(data.rollNumber, docSnap.ref);
            }
          });
          await Promise.all(deletes);

          // Update flag FIRST so reloads won't re-trigger migration
          await setDoc(flagDocRef, { seeded: true, seededVersion: SEED_VERSION }, { merge: true });

          // Migration v2: Add missing students
          const newStudents = [
            { name: 'Anjali Gurung', email: 'anjali@school.edu', stream: 'Montessori', grade: 'Montessori', rollNumber: '001', parentEmail: 'parent.anjali@example.com' },
            { name: 'Aarav Basnet', email: 'aarav@school.edu', stream: 'Montessori', grade: 'Montessori', rollNumber: '002', parentEmail: 'parent.aarav@example.com' },
            { name: 'Sita Poudel', email: 'sita@school.edu', stream: 'Pre-Primary', grade: 'Nursery', rollNumber: '101', parentEmail: 'parent.sita@example.com' },
            { name: 'Hari Adhikari', email: 'hari@school.edu', stream: 'Pre-Primary', grade: 'LKG', rollNumber: '201', parentEmail: 'parent.hari@example.com' },
            { name: 'Gita Shrestha', email: 'gita@school.edu', stream: 'Pre-Primary', grade: 'UKG', rollNumber: '301', parentEmail: 'parent.gita@example.com' },
            { name: 'Mohan Pandey', email: 'mohan@school.edu', stream: 'Primary', grade: 'Class 1', rollNumber: '101', parentEmail: 'parent.mohan@example.com' },
            { name: 'Sunita Rai', email: 'sunita@school.edu', stream: 'Primary', grade: 'Class 3', rollNumber: '301', parentEmail: 'parent.sunita@example.com' },
            { name: 'Rajesh Hamal', email: 'rajesh@school.edu', stream: 'Secondary', grade: 'Class 8', rollNumber: '801', parentEmail: 'parent.rajesh@example.com' },
            { name: 'Pooja Shrestha', email: 'pooja@school.edu', stream: 'Secondary', grade: 'Class 7', rollNumber: '701', parentEmail: 'parent.pooja@example.com' },
            { name: 'Binod Chaudhary', email: 'binod@school.edu', stream: 'Secondary', grade: 'Class 10', rollNumber: '1002', parentEmail: 'parent.binod@example.com' }
          ];
          for (const st of newStudents) {
            if (!seenRoll.has(st.rollNumber)) {
              await addDoc(studentsCol, st);
            }
          }
          console.log("Seed v2 migration complete.");
          return;
        }

        console.log("Empty Firestore database detected. Seeding Nabha Dip Academy default data...");

        // Seed System Flag
        await setDoc(flagDocRef, { seeded: true, seededVersion: SEED_VERSION });

        // Seed Notices
        const noticesCol = collection(db, 'notices');
        const initialNotices = [
          { title: 'Nabha Dip Academy Admissions 2083 Open', content: 'Admissions are officially open for academic session 2083 B.S. from Montessori and Nursery up to Class 10. Forms are available online.', date: '2026-06-20', category: 'academic', fileUrl: '#' },
          { title: 'Montessori Play Wing Expansion Ceremony', content: 'We are inaugurated a new play annex for our toddlers. All Montessori parents are welcome for a brief introductory coffee morning this Friday at 10 AM.', date: '2026-06-18', category: 'events', fileUrl: '#' },
          { title: 'Established 2066 B.S. Celebration Event', content: 'Marking our milestone of service, Nabha Dip Academy is organizing a clean campus green drive next Monday.', date: '2026-06-15', category: 'administrative', fileUrl: '#' }
        ];
        for (const notice of initialNotices) {
          await addDoc(noticesCol, notice);
        }

        // Seed Events
        const eventsCol = collection(db, 'events');
        const initialEvents = [
          { title: 'Annual Montessori Sports Gala', description: 'Fun sports events, obstacle courses and sack race for toddlers and nursery wings.', date: '2026-06-28', time: '10:00 AM - 1:00 PM', location: 'Junior Grounds', registeredCount: 22, maxSeats: 100, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80' },
          { title: 'Class 10 Science Model Fair', description: 'Secondary wing student exhibition covering green energy, hydraulics and robot designs.', date: '2026-07-05', time: '09:00 AM - 3:00 PM', location: 'NDA Auditorium', registeredCount: 45, maxSeats: 150, image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=500&q=80' }
        ];
        for (const ev of initialEvents) {
          await addDoc(eventsCol, ev);
        }

        // Seed Gallery
        const galleryCol = collection(db, 'gallery');
        const initialGallery = [
          { title: 'Montessori Block Activities', type: 'photo', category: 'annual', url: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=80', description: 'Toddlers learning with puzzle logs.' },
          { title: 'Class Room Activity', type: 'photo', category: 'campus', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80', description: 'Junior wing painting session.' }
        ];
        for (const gal of initialGallery) {
          await addDoc(galleryCol, gal);
        }

        // Seed Students
        const studentsCol = collection(db, 'students');
        const initialStudents = [
          { name: 'Rahul Sharma', email: 'student@school.edu', stream: 'Secondary', grade: 'Class 10', rollNumber: '1001', parentEmail: 'parent@school.edu' },
          { name: 'Nisha Karki', email: 'nisha@school.edu', stream: 'Secondary', grade: 'Class 9', rollNumber: '902', parentEmail: 'parent.nisha@example.com' },
          { name: 'Kabir Thapa', email: 'kabir@school.edu', stream: 'Primary', grade: 'Class 5', rollNumber: '503', parentEmail: 'parent.kabir@example.com' },
          { name: 'Anjali Gurung', email: 'anjali@school.edu', stream: 'Montessori', grade: 'Montessori', rollNumber: '001', parentEmail: 'parent.anjali@example.com' },
          { name: 'Aarav Basnet', email: 'aarav@school.edu', stream: 'Montessori', grade: 'Montessori', rollNumber: '002', parentEmail: 'parent.aarav@example.com' },
          { name: 'Sita Poudel', email: 'sita@school.edu', stream: 'Pre-Primary', grade: 'Nursery', rollNumber: '101', parentEmail: 'parent.sita@example.com' },
          { name: 'Hari Adhikari', email: 'hari@school.edu', stream: 'Pre-Primary', grade: 'LKG', rollNumber: '201', parentEmail: 'parent.hari@example.com' },
          { name: 'Gita Shrestha', email: 'gita@school.edu', stream: 'Pre-Primary', grade: 'UKG', rollNumber: '301', parentEmail: 'parent.gita@example.com' },
          { name: 'Mohan Pandey', email: 'mohan@school.edu', stream: 'Primary', grade: 'Class 1', rollNumber: '101', parentEmail: 'parent.mohan@example.com' },
          { name: 'Sunita Rai', email: 'sunita@school.edu', stream: 'Primary', grade: 'Class 3', rollNumber: '301', parentEmail: 'parent.sunita@example.com' },
          { name: 'Rajesh Hamal', email: 'rajesh@school.edu', stream: 'Secondary', grade: 'Class 8', rollNumber: '801', parentEmail: 'parent.rajesh@example.com' },
          { name: 'Pooja Shrestha', email: 'pooja@school.edu', stream: 'Secondary', grade: 'Class 7', rollNumber: '701', parentEmail: 'parent.pooja@example.com' },
          { name: 'Binod Chaudhary', email: 'binod@school.edu', stream: 'Secondary', grade: 'Class 10', rollNumber: '1002', parentEmail: 'parent.binod@example.com' }
        ];
        for (const st of initialStudents) {
          await addDoc(studentsCol, st);
        }

        // Seed Teachers
        const teachersCol = collection(db, 'teachers');
        const initialTeachers = [
          { name: 'Dr. Anand Verma', email: 'teacher@school.edu', streams: ['Secondary'], phone: '9841112233' },
          { name: 'Ms. Emily Blunt', email: 'emily@school.edu', streams: ['Secondary'], phone: '9851112233' }
        ];
        for (const tc of initialTeachers) {
          await addDoc(teachersCol, tc);
        }

        // Seed Subjects
        const subjectsCol = collection(db, 'subjects');
        const initialSubjects = [
          { id: 'PHY-10', name: 'Science X (Physics)', stream: 'Secondary', grade: 'Class 10', instructor: 'Dr. Anand Verma' },
          { id: 'ENG-10', name: 'English Literature X', stream: 'Secondary', grade: 'Class 10', instructor: 'Ms. Emily Blunt' },
          { id: 'MTH-10', name: 'Mathematics X', stream: 'Secondary', grade: 'Class 10', instructor: 'Dr. Anand Verma' }
        ];
        for (const cr of initialSubjects) {
          await setDoc(doc(subjectsCol, cr.id), cr);
        }

        // Seed Assignments
        const assCol = collection(db, 'assignments');
        const initialAssignments = [
          { title: 'Physics Speed Graph Analysis', description: 'Plot speed-time charts for the given data and calculate acceleration levels. Scan as PDF.', subjectName: 'Science X (Physics)', dueDate: '2026-06-30', teacherName: 'Dr. Anand Verma' }
        ];
        for (const ass of initialAssignments) {
          await addDoc(assCol, ass);
        }

        console.log("Firestore seeding finished successfully!");
      } catch (err) {
        console.error("Firestore database auto seeding failed:", err);
      }
    };

    autoSeed();
  }, []);

  // --- 4. FIREBASE CONNECTED MOCK AUTH PERSONA SWITCHER ---
  const switchSimulatedRole = async (roleId) => {
    if (roleId === 'guest') {
      try {
        await signOut(auth);
      } catch (e) {}
      setCurrentUser(null);
      setActiveRole('guest');
      return;
    }

    const demoUsers = {
      admin: { email: 'admin@gmail.com', password: 'admin123', name: 'Admin Root', details: { role: 'admin' } },
      teacher: { email: 'teacher@school.edu', password: 'teacher123', name: 'Dr. Anand Verma', details: { role: 'teacher', department: 'Science', phone: '9841112233' } },
      student: { email: 'student@school.edu', password: 'student123', name: 'Rahul Sharma', details: { role: 'student', stream: 'Secondary', grade: 'Class 10', rollNumber: '1001', parentEmail: 'parent@school.edu' } },
      parent: { email: 'parent@school.edu', password: 'parent123', name: 'Sunita Sharma', details: { role: 'parent', childName: 'Rahul Sharma', childRoll: '1001' } }
    };

    const targetUser = demoUsers[roleId];
    try {
      // Attempt Sign in
      await signInWithEmailAndPassword(auth, targetUser.email, targetUser.password);
      // The auth state listener will automatically load the user details from Firestore
    } catch (err) {
      console.warn(`Firebase Auth operation failed or disabled (code: ${err.code}). Falling back to simulated login...`);
      
      if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && err.code !== 'auth/operation-not-allowed') {
        try {
          const credential = await createUserWithEmailAndPassword(auth, targetUser.email, targetUser.password);
          const user = credential.user;
          // Use consistent admin_demo_uid for admin to avoid duplicate admin docs
          const docId = roleId === 'admin' ? 'admin_demo_uid' : user.uid;
          await setDoc(doc(db, 'users', docId), {
            uid: docId,
            name: targetUser.name,
            email: targetUser.email,
            ...targetUser.details
          });
          return;
        } catch (signupErr) {
          console.error("Failed to automatically sign up demo user:", signupErr);
        }
      }
      
      // Fallback: try dynamically created parents collection
      if (roleId === 'parent') {
        try {
          const q = query(collection(db, 'parents'), where('email', '==', targetUser.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const docData = snap.docs[0].data();
            const children = docData.children || [];
            const parentUser = {
              uid: snap.docs[0].id,
              name: docData.name,
              email: docData.email,
              phone: docData.phone || '',
              role: 'parent',
              children,
              childRoll: children.length > 0 ? children[0].rollNumber : '',
              childName: children.length > 0 ? children[0].name : ''
            };
            setCurrentUser(parentUser);
            setActiveRole('parent');
            return;
          }
        } catch (parentErr) {
          console.warn("Parents collection lookup failed:", parentErr.message);
        }
      }

      // Fallback: load the pre-seeded document with suffix "_demo_uid" directly from Firestore
      console.log(`Using pre-seeded Firestore fallback for role: ${roleId}`);
      try {
        const fallbackDocId = `${roleId}_demo_uid`;
        const userDocRef = doc(db, 'users', fallbackDocId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser(userDocSnap.data());
          setActiveRole(roleId);
        } else {
          const localUser = {
            uid: fallbackDocId,
            name: targetUser.name,
            email: targetUser.email,
            ...targetUser.details
          };
          setCurrentUser(localUser);
          setActiveRole(roleId);
        }
      } catch (fsErr) {
        console.error("Firestore read error on fallback user, using memory fallback:", fsErr);
        const localUser = {
          uid: `${roleId}_demo_uid`,
          name: targetUser.name,
          email: targetUser.email,
          ...targetUser.details
        };
        setCurrentUser(localUser);
        setActiveRole(roleId);
      }
    }
  };

  // --- 5. EMAIL + PASSWORD LOGIN ---
  const login = async (email, password) => {
    if (!email || !password) return { success: false, error: 'Email and password are required.' };

    // 1) Admin login — check stored password in Firestore first, fallback to admin123
    if (email.toLowerCase() === 'admin@gmail.com') {
      let storedPwd = 'admin123';
      try {
        const adminDoc = await getDoc(doc(db, 'users', 'admin_demo_uid'));
        if (adminDoc.exists() && adminDoc.data().password) {
          storedPwd = adminDoc.data().password;
        }
      } catch (e) {}
      if (password !== storedPwd) {
        return { success: false, error: 'Invalid password.' };
      }
      // Fetch latest admin data from Firestore (includes profileImage, welcomeMessage)
      let adminUser = {
        uid: 'admin_demo_uid',
        name: 'Admin Root',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      try {
        const adminDoc = await getDoc(doc(db, 'users', 'admin_demo_uid'));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          adminUser = { ...adminUser, ...data, uid: 'admin_demo_uid' };
        }
      } catch (e) {}
      setCurrentUser(adminUser);
      setActiveRole('admin');
      saveSession(adminUser, 'admin');
      return { success: true };
    }

    try {
      // Helper: match email+password in a given collection and return user + role
      const tryCollection = async (colName, role, extractUser) => {
        const q = query(collection(db, colName), where('email', '==', email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const docData = { id: snap.docs[0].id, ...snap.docs[0].data() };
        if (password !== (docData.password || '')) return { error: 'Invalid password.' };
        const user = extractUser ? extractUser(docData) : {
          uid: docData.id,
          name: docData.name || docData.email?.split('@')[0] || 'User',
          email: docData.email,
          role,
          ...docData
        };
        setCurrentUser(user);
        setActiveRole(role);
        saveSession(user, role);
        return { success: true };
      };

      // Check collections where students/teachers/parents are actually stored
      const checks = [
        tryCollection('users', null, null),
        tryCollection('students', 'student', (d) => ({
          uid: d.id, name: d.name, email: d.email, role: 'student',
          stream: d.stream, grade: d.grade, rollNumber: d.rollNumber,
          parentEmail: d.parentEmail, profileImage: d.profileImage, password: d.password
        })),
        tryCollection('teachers', 'teacher', (d) => ({
          uid: d.id, name: d.name, email: d.email, role: 'teacher',
          department: d.department, phone: d.phone, profileImage: d.profileImage, password: d.password
        })),
        tryCollection('parents', 'parent', (d) => {
          const children = d.children || [];
          return {
            uid: d.id, name: d.name, email: d.email, role: 'parent',
            phone: d.phone || '', password: d.password, children,
            childRoll: children.length > 0 ? children[0].rollNumber : '',
            childName: children.length > 0 ? children[0].name : ''
          };
        })
      ];

      const results = await Promise.all(checks);
      for (const r of results) {
        if (r === null) continue;
        return r; // { success: true } or { error: '...' }
      }

      return { success: false, error: 'No account found with this email.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    clearSession();
    setCurrentUser(null);
    setActiveRole('guest');
  };

  // Update School Logo
  const updateSchoolLogo = async (logoUrlOrBase64) => {
    await setDoc(doc(db, 'system', 'config'), {
      ...schoolConfig,
      schoolLogo: logoUrlOrBase64
    }, { merge: true });
    setSchoolConfig(prev => ({ ...prev, schoolLogo: logoUrlOrBase64 }));
  };

  // Update Hero Images
  const updateHeroImages = async (images) => {
    await setDoc(doc(db, 'system', 'config'), {
      ...schoolConfig,
      heroImages: images
    }, { merge: true });
    setSchoolConfig(prev => ({ ...prev, heroImages: images }));
  };

  // Update Principal Profile
  const updatePrincipalProfile = async (name, profileImage, welcomeMessage) => {
    const adminUid = 'admin_demo_uid';
    let existingPwd = 'admin123';
    try {
      const existing = await getDoc(doc(db, 'users', adminUid));
      if (existing.exists() && existing.data().password) {
        existingPwd = existing.data().password;
      }
    } catch (e) {}
    const updatedAdmin = {
      uid: adminUid,
      name,
      welcomeMessage,
      password: existingPwd,
      role: 'admin',
      email: currentUser?.email || 'admin@gmail.com'
    };
    if (profileImage) updatedAdmin.profileImage = profileImage;
    await setDoc(doc(db, 'users', adminUid), updatedAdmin, { merge: true });
    if (currentUser && currentUser.role === 'admin') {
      const updated = { ...currentUser, name, profileImage, welcomeMessage, role: 'admin' };
      setCurrentUser(updated);
      saveSession(updated, 'admin');
    }
  };

  // Change Admin Password
  const changeAdminPassword = async (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      return { success: false, error: 'Both current and new password are required.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    try {
      const adminUid = currentUser?.uid || 'admin_demo_uid';
      const adminDoc = await getDoc(doc(db, 'users', adminUid));
      let storedPwd = 'admin123';
      if (adminDoc.exists() && adminDoc.data().password) {
        storedPwd = adminDoc.data().password;
      }
      if (currentPassword !== storedPwd) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      await setDoc(doc(db, 'users', adminUid), {
        uid: adminUid,
        name: currentUser?.name || 'Admin Root',
        email: 'admin@gmail.com',
        role: 'admin',
        password: newPassword
      }, { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Change password failed:', err);
      return { success: false, error: 'Failed to change password.' };
    }
  };

  // Notice board CRUD
  const addNotice = async (noticeData) => {
    try {
      await addDoc(collection(db, 'notices'), {
        date: new Date().toISOString().split('T')[0],
        ...noticeData
      });
    } catch (err) {
      console.error("Firestore notice add failed:", err);
    }
  };

  const updateNotice = async (id, noticeData) => {
    try {
      await updateDoc(doc(db, 'notices', id), noticeData);
    } catch (err) {
      console.error("Firestore notice update failed:", err);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
    } catch (err) {
      console.error("Firestore notice delete failed:", err);
    }
  };

  // Inquiry submission
  const addInquiry = async (inquiryData) => {
    try {
      await addDoc(collection(db, 'inquiries'), {
        date: new Date().toISOString().split('T')[0],
        ...inquiryData
      });
    } catch (err) {
      console.error("Firestore inquiry add failed:", err);
    }
  };

  // Admissions Application Form submission
  const applyAdmission = async (formData) => {
    try {
      const ref = await addDoc(collection(db, 'applications'), {
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        ...formData
      });
      return ref.id;
    } catch (err) {
      console.error("Firestore application submission failed:", err);
      return null;
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status });
    } catch (err) {
      console.error("Firestore application status update failed:", err);
    }
  };

  const deleteApplication = async (appId) => {
    try {
      await deleteDoc(doc(db, 'applications', appId));
    } catch (err) {
      console.error("Firestore application delete failed:", err);
    }
  };

  // Event Registrations
  const registerForEvent = async (eventId, currentCount) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        registeredCount: (currentCount || 0) + 1
      });
    } catch (err) {
      console.error("Firestore event register update failed:", err);
    }
  };

  const createEvent = async (eventData) => {
    try {
      await addDoc(collection(db, 'events'), {
        registeredCount: 0,
        image: eventData.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80',
        ...eventData
      });
    } catch (err) {
      console.error("Firestore event creation failed:", err);
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      await updateDoc(doc(db, 'events', id), eventData);
    } catch (err) {
      console.error("Firestore event update failed:", err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (err) {
      console.error("Firestore event delete failed:", err);
    }
  };

  // Student Attendance logger
  const updateAttendance = async (rollNumber, date, status) => {
    try {
      // Document id format: rollNumber_date
      const docId = `${rollNumber}_${date}`;
      await setDoc(doc(db, 'attendance', docId), {
        rollNumber,
        date,
        status
      });
    } catch (err) {
      console.error("Firestore attendance set failed:", err);
    }
  };

  // Assignments Desk
  const addAssignment = async (assignmentData) => {
    try {
      await addDoc(collection(db, 'assignments'), {
        teacherName: currentUser?.name || 'Dr. Anand Verma',
        ...assignmentData
      });
    } catch (err) {
      console.error("Firestore assignment add failed:", err);
    }
  };

  const submitAssignment = async (subData) => {
    try {
      await addDoc(collection(db, 'submissions'), {
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        ...subData
      });
    } catch (err) {
      console.error("Firestore submission add failed:", err);
    }
  };

  const gradeSubmission = async (subId, score, feedback) => {
    try {
      await updateDoc(doc(db, 'submissions', subId), {
        score: Number(score),
        feedback,
        status: 'Graded'
      });
    } catch (err) {
      console.error("Firestore grade submission update failed:", err);
    }
  };

  // Enter Student Grades
  const enterMarks = async (rollNumber, examName, subjectMarks) => {
    try {
      const student = students.find(s => s.rollNumber === rollNumber);
      if (!student) return;

      const docId = `${rollNumber}_${examName.replace(/\s+/g, '_')}`;
      await setDoc(doc(db, 'results', docId), {
        studentId: student.id || 'S1001',
        studentName: student.name,
        rollNumber,
        examName,
        marks: subjectMarks
      });
    } catch (err) {
      console.error("Firestore marks entry failed:", err);
    }
  };

  // Parent Leave Submission
  const submitLeaveRequest = async (leaveData) => {
    try {
      await addDoc(collection(db, 'leaveApplications'), {
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        ...leaveData
      });
    } catch (err) {
      console.error("Firestore leave request submission failed:", err);
    }
  };

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      await updateDoc(doc(db, 'leaveApplications', leaveId), { status });
    } catch (err) {
      console.error("Firestore leave status update failed:", err);
    }
  };

  const deleteLeaveApplication = async (leaveId) => {
    try {
      await deleteDoc(doc(db, 'leaveApplications', leaveId));
    } catch (err) {
      console.error("Firestore leave application delete failed:", err);
    }
  };

  // Roster Management (Admin)
  const addStudent = async (studentData) => {
    try {
      await addDoc(collection(db, 'students'), {
        rollNumber: studentData.rollNumber || String(1100 + students.length),
        ...studentData
      });
    } catch (err) {
      console.error("Firestore student add failed:", err);
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      await updateDoc(doc(db, 'students', id), studentData);
    } catch (err) {
      console.error("Firestore student update failed:", err);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await updateDoc(doc(db, 'students', id), { deleted: true });
    } catch (err) {
      console.error("Firestore student soft-delete failed:", err);
    }
  };

  const restoreStudent = async (id) => {
    try {
      await updateDoc(doc(db, 'students', id), { deleted: false });
    } catch (err) {
      console.error("Firestore student restore failed:", err);
    }
  };

  const permanentlyDeleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (err) {
      console.error("Firestore permanent student delete failed:", err);
    }
  };

  const bulkDeleteStudents = async (ids) => {
    try {
      const writes = ids.map(id => updateDoc(doc(db, 'students', id), { deleted: true }));
      await Promise.all(writes);
    } catch (err) {
      console.error("Firestore bulk soft-delete failed:", err);
    }
  };

  const bulkRestoreStudents = async (ids) => {
    try {
      const writes = ids.map(id => updateDoc(doc(db, 'students', id), { deleted: false }));
      await Promise.all(writes);
    } catch (err) {
      console.error("Firestore bulk restore failed:", err);
    }
  };

  const bulkPermanentDeleteStudents = async (ids) => {
    try {
      const writes = ids.map(id => deleteDoc(doc(db, 'students', id)));
      await Promise.all(writes);
    } catch (err) {
      console.error("Firestore bulk permanent delete failed:", err);
    }
  };

  const markBatchCompleted = async (ids, batchName) => {
    try {
      const writes = ids.map(id => updateDoc(doc(db, 'students', id), {
        batchCompleted: { name: batchName, date: new Date().toISOString() }
      }));
      await Promise.all(writes);
    } catch (err) {
      console.error("Firestore batch complete mark failed:", err);
    }
  };

  const restoreFromBatch = async (id) => {
    try {
      await updateDoc(doc(db, 'students', id), { batchCompleted: {} });
    } catch (err) {
      console.error("Firestore restore from batch failed:", err);
    }
  };

  const renameBatch = async (studentIds, newName) => {
    try {
      const writes = studentIds.map(id => updateDoc(doc(db, 'students', id), {
        'batchCompleted.name': newName
      }));
      await Promise.all(writes);
    } catch (err) {
      console.error("Firestore rename batch failed:", err);
    }
  };

  const removeBatch = async (studentIds) => {
    try {
      const writes = studentIds.map(id => updateDoc(doc(db, 'students', id), {
        batchCompleted: {}
      }));
      await Promise.all(writes);
    } catch (err) {
      console.error("Firestore remove batch failed:", err);
    }
  };

  const addParent = async (parentData) => {
    try {
      await addDoc(collection(db, 'parents'), {
        ...parentData,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Firestore parent add failed:", err);
    }
  };

  const updateParent = async (id, parentData) => {
    try {
      await updateDoc(doc(db, 'parents', id), parentData);
    } catch (err) {
      console.error("Firestore parent update failed:", err);
    }
  };

  const deleteParent = async (id) => {
    try {
      await deleteDoc(doc(db, 'parents', id));
    } catch (err) {
      console.error("Firestore parent delete failed:", err);
    }
  };

  const addTeacher = async (teacherData) => {
    try {
      await addDoc(collection(db, 'teachers'), teacherData);
    } catch (err) {
      console.error("Firestore teacher add failed:", err);
    }
  };

  const updateTeacher = async (id, teacherData) => {
    try {
      await updateDoc(doc(db, 'teachers', id), teacherData);
    } catch (err) {
      console.error("Firestore teacher update failed:", err);
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await deleteDoc(doc(db, 'teachers', id));
    } catch (err) {
      console.error("Firestore teacher delete failed:", err);
    }
  };

  const addSubject = async (subjectData) => {
    try {
      await addDoc(collection(db, 'subjects'), subjectData);
    } catch (err) {
      console.error("Firestore subject add failed:", err);
    }
  };

  const updateSubject = async (id, subjectData) => {
    try {
      await updateDoc(doc(db, 'subjects', id), subjectData);
    } catch (err) {
      console.error("Firestore subject update failed:", err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
    } catch (err) {
      console.error("Firestore subject delete failed:", err);
    }
  };

  // Gallery CRUD
  const addGalleryItem = async (itemData) => {
    try {
      await addDoc(collection(db, 'gallery'), {
        type: 'photo',
        ...itemData
      });
    } catch (err) {
      console.error("Firestore gallery item add failed:", err);
    }
  };

  const updateGalleryItem = async (id, itemData) => {
    try {
      await updateDoc(doc(db, 'gallery', id), itemData);
    } catch (err) {
      console.error("Firestore gallery item update failed:", err);
    }
  };

  const deleteGalleryItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      console.error("Firestore gallery item delete failed:", err);
    }
  };

  // Announcements CRUD
  // Testimonials CRUD
  const addTestimonial = async (data) => {
    try {
      await addDoc(collection(db, 'testimonials'), { ...data, createdAt: Date.now() });
    } catch (err) {
      console.error("Firestore testimonial add failed:", err);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      console.error("Firestore testimonial delete failed:", err);
    }
  };

  const updateTestimonial = async (id, data) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), data);
    } catch (err) {
      console.error("Firestore testimonial update failed:", err);
    }
  };

  const addAnnouncement = async (data) => {
    try {
      await addDoc(collection(db, 'announcements'), {
        date: new Date().toISOString().split('T')[0],
        ...data
      });
    } catch (err) {
      console.error("Firestore announcement add failed:", err);
    }
  };

  const updateAnnouncement = async (id, data) => {
    try {
      await updateDoc(doc(db, 'announcements', id), data);
    } catch (err) {
      console.error("Firestore announcement update failed:", err);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.error("Firestore announcement delete failed:", err);
    }
  };

  // --- INVOICES CRUD ---
  const addInvoice = async (data) => {
    try {
      await addDoc(collection(db, 'invoices'), {
        createdAt: new Date().toISOString(),
        status: 'unpaid',
        paidAmount: 0,
        ...data
      });
    } catch (err) {
      console.error("Firestore invoice add failed:", err);
    }
  };

  const updateInvoice = async (id, data) => {
    try {
      await updateDoc(doc(db, 'invoices', id), data);
    } catch (err) {
      console.error("Firestore invoice update failed:", err);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
    } catch (err) {
      console.error("Firestore invoice delete failed:", err);
    }
  };

  const addInvoicesBulk = async (invoiceList) => {
    try {
      const batch = writeBatch(db);
      const colRef = collection(db, 'invoices');
      const now = new Date().toISOString();
      invoiceList.forEach(inv => {
        const ref = doc(colRef);
        batch.set(ref, { createdAt: now, status: 'unpaid', paidAmount: 0, ...inv });
      });
      await batch.commit();
    } catch (err) {
      console.error("Firestore bulk invoice add failed:", err);
    }
  };

  return (
    <AppContext.Provider value={{
      // View state
      ready,
      sessionChecked,
      activeRole,
      setActiveRole,
      currentUser,
      switchSimulatedRole,
      login,
      logout,
      isLiveBackend,

      // Collections
      notices,
      events,
      announcements,
      testimonials,
      inquiries,
      applications,
      students,
      deletedStudents,
      batchCompletedStudents,
      teachers,
      subjects,
      attendance,
      results,
      assignments,
      submissions,
      leaveApplications,
      gallery,
      usersList,
      parents,
      schoolConfig,
      invoices,

      // Writes
      addNotice,
      deleteNotice,
      addInquiry,
      applyAdmission,
      updateApplicationStatus,
      deleteApplication,
      registerForEvent,
      createEvent,
      updateAttendance,
      addAssignment,
      submitAssignment,
      gradeSubmission,
      enterMarks,
      submitLeaveRequest,
      updateLeaveStatus,
      deleteLeaveApplication,
      addStudent,
      deleteStudent,
      restoreStudent,
      permanentlyDeleteStudent,
      bulkDeleteStudents,
      bulkRestoreStudents,
      bulkPermanentDeleteStudents,
      markBatchCompleted,
      restoreFromBatch,
      renameBatch,
      removeBatch,
      addTeacher,
      deleteTeacher,
      addSubject,
      deleteSubject,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      updateSchoolLogo,
      updateHeroImages,
      updatePrincipalProfile,
      changeAdminPassword,
      deleteEvent,
      updateNotice,
      updateEvent,
      updateStudent,
      updateTeacher,
      updateSubject,
      addParent,
      updateParent,
      deleteParent,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addInvoicesBulk
    }}>
      {children}
    </AppContext.Provider>
  );
};
