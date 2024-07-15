import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '../../pages/Student/Profile';
import Courses from '../../pages/Student/Courses';
import Course from '../../pages/Student/Course';
import Library from '../../pages/Student/Library';
import CloseSection from '../../pages/Student/CloseSection';
import Home from '../../pages/LandingPage';
import Contact from '../../pages/Contact';
import Page404 from '../../pages/Page404';
import Privacy from '../../pages/Terms/Privacy';
import TermPayment from '../../pages/Terms/Payment';
import FinalUser from '../../pages/Terms/FinalUser';
import Conditions from '../../pages/Terms/Conditions';
import Plans from '../../pages/Plans/Index';
import Payment from '../../pages/Payment';
import { User } from '../../global/state/type';
import { isFree, isStudent } from '../../tools/function';

const RouterStudent: React.FC<{ user: User | null; }> = ({ user }) => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="contact" element={<Contact />} />
    {
      user && (isStudent(user) && user.payment.isPayment) || isFree(user)
      ? (
        <>
          <Route path="courses" element={<Courses />} />
          <Route path="course/:idCourse" element={<Course />} />
        </>
      )
      : null
    }
    <Route path="profile" element={<Profile />} />
    <Route path="libraries" element={<Library />} />
    <Route path="close" element={<CloseSection />} />
    <Route path="term-user" element={<FinalUser />} />
    <Route path="term-payment" element={<TermPayment />} />
    <Route path="term-privacy" element={<Privacy />} />
    <Route path="term-conditions" element={<Conditions />} />
    <Route path="payment/:paymentMethod" element={<Payment />} />
    <Route path="plan" element={<Plans />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterStudent;