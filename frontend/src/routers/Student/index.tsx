import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '../../pages/Student/Profile';
import Courses from '../../pages/Student/Courses';
import Course from '../../pages/Student/Course';
import Library from '../../pages/Student/Library';
import CloseSection from '../../pages/Student/CloseSection';
import Home from '../../pages/HomePage/Home';
import Contact from '../../pages/HomePage/Contact';
import Page404 from '../../pages/Page404';

/*
 In the future, we're going to use these lines of code to implement code splitting.

  const Profile: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/Student/Profile'))
  );
  const Courses: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/Student/Courses'))
  );
  const Course: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/Student/Course'))
  );
*/

const RouterStudent: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="contact" element={<Contact />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/course/:idCourse" element={<Course />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/libraries" element={<Library />} />
    <Route path="/close" element={<CloseSection />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterStudent;