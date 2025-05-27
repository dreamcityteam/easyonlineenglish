import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CloseSection from '../../pages/Student/CloseSection';
import Page404 from '../../pages/Page404';
import Courses from '../../pages/Student/Courses';
import Course from '../../pages/Student/Course';
import UploadFile from '../../pages/UploadFile';
import Library from '../../pages/Student/Library';
import EditWords from '../../pages/Admin/EditWords';

const Admin: React.FC = (): JSX.Element => (
  <Routes>
    <Route path="/" element={<Courses />} />
    <Route path="/close" element={<CloseSection />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/course/:idCourse" element={<Course />} />
    <Route path="/upload" element={<UploadFile />} />
    <Route path="/library" element={<Library />} />
    <Route path="/edit-words" element={<EditWords />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default Admin;
