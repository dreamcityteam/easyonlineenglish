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
import Privacy from '../../pages/Terms/Privacy';
import TermPayment from '../../pages/Terms/Payment';
import FinalUser from '../../pages/Terms/FinalUser';
import Agreement from '../../pages/Terms/Agreement';
import Conditions from '../../pages/Terms/Conditions';
import Service from '../../pages/Terms/Service';
import Plans from '../../pages/Plans/Index';
import Payment from '../../pages/Payment';

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
    <Route path="courses" element={<Courses />} />
    <Route path="course/:idCourse" element={<Course />} />
    <Route path="profile" element={<Profile />} />
    <Route path="libraries" element={<Library />} />
    <Route path="close" element={<CloseSection />} />
    <Route path="term-agreement" element={<Agreement />} />
    <Route path="term-user" element={<FinalUser />} />
    <Route path="term-payment" element={<TermPayment />} />
    <Route path="term-privacy" element={<Privacy />} />
    <Route path="term-conditions" element={<Conditions />} />
    <Route path="term-service" element={<Service />} />
    <Route path="payment/:paymentMethod" element={<Payment />} />
    <Route path="plan" element={<Plans />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterStudent;