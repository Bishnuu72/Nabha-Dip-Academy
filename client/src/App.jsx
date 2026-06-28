import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import ContactUs from './pages/ContactUs';
import Gallery from './pages/Gallery';
import LoginPage from './pages/LoginPage';

import AdminPortal from './portals/AdminPortal';
import AdminDashboard from './portals/admin/AdminDashboard';
import ManageStudents from './portals/admin/ManageStudents';
import ManageTeachers from './portals/admin/ManageTeachers';
import ManageParents from './portals/admin/ManageParents';
import ManageSubjects from './portals/admin/ManageSubjects';
import ManageNotices from './portals/admin/ManageNotices';
import ManageEvents from './portals/admin/ManageEvents';
import AdmissionsQueue from './portals/admin/AdmissionsQueue';
import DeletedStudents from './portals/admin/DeletedStudents';
import ManageInvoices from './portals/admin/ManageInvoices';
import BatchStudents from './portals/admin/BatchStudents';
import ManageGallery from './portals/admin/ManageGallery';
import LeaveApprovals from './portals/admin/LeaveApprovals';
import Announcements from './portals/admin/Announcements';
import Testimonials from './portals/admin/Testimonials';
import SchoolSettings from './portals/admin/SchoolSettings';

import StudentPortal from './portals/StudentPortal';
import StudentDashboard from './portals/student/StudentDashboard';
import StudentAttendance from './portals/student/StudentAttendance';
import StudentResults from './portals/student/StudentResults';
import StudentRoutine from './portals/student/StudentRoutine';
import StudentAssignments from './portals/student/StudentAssignments';

import TeacherPortal from './portals/TeacherPortal';
import TeacherDashboard from './portals/teacher/TeacherDashboard';
import MarkAttendance from './portals/teacher/MarkAttendance';
import EnterGrades from './portals/teacher/EnterGrades';
import AssignmentsDesk from './portals/teacher/AssignmentsDesk';
import PublishNotice from './portals/teacher/PublishNotice';

import ParentPortal from './portals/ParentPortal';
import ParentDashboard from './portals/parent/ParentDashboard';
import ChildAttendance from './portals/parent/ChildAttendance';
import AcademicProgress from './portals/parent/AcademicProgress';
import Invoices from './portals/parent/Invoices';
import ParentLeaveApplications from './portals/parent/LeaveApplications';

const ProtectedRoute = ({ children }) => {
  const { sessionChecked, currentUser } = useContext(AppContext);
  if (!sessionChecked) return <LoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const AppLayout = () => {
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');

  return (
    <>
      <Navigation />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/portal/admin" element={<ProtectedRoute><AdminPortal /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="parents" element={<ManageParents />} />
            <Route path="subjects" element={<ManageSubjects />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="admissions" element={<AdmissionsQueue />} />
            <Route path="deleted-students" element={<DeletedStudents />} />
            <Route path="invoices" element={<ManageInvoices />} />
            <Route path="batch-students" element={<BatchStudents />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="leaves" element={<LeaveApprovals />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="settings" element={<SchoolSettings />} />
          </Route>

          <Route path="/portal/student" element={<ProtectedRoute><StudentPortal /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="routine" element={<StudentRoutine />} />
            <Route path="assignments" element={<StudentAssignments />} />
          </Route>

          <Route path="/portal/teacher" element={<ProtectedRoute><TeacherPortal /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="marks" element={<EnterGrades />} />
            <Route path="assignments" element={<AssignmentsDesk />} />
            <Route path="notice" element={<PublishNotice />} />
          </Route>

          <Route path="/portal/parent" element={<ProtectedRoute><ParentPortal /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="attendance" element={<ChildAttendance />} />
            <Route path="grades" element={<AcademicProgress />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="leave" element={<ParentLeaveApplications />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isPortal && <Footer />}
    </>
  );
};

function App() {
  const { ready } = useContext(AppContext);
  if (!ready) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
