import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CloseSection from '../../pages/Student/CloseSection';
import Page404 from '../../pages/Page404';
import Courses from '../../pages/Student/Courses';
import Course from '../../pages/Student/Course';


/*
 In the future, we're going to use these lines of code to implement code splitting.

  const Profile: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/Student/Profile'))
  );
  );
*/

const Admin: React.FC = () => (
  <Routes>
    <Route path="close" element={<CloseSection />} />
    <Route path="courses" element={<Courses />} />
    <Route path="course/:idCourse" element={<Course />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default Admin;