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
import Conversation from '../../pages/Student/Conversation';

const RouterStudent: React.FC<{ isPayment: boolean; }> = ({ isPayment }) => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/contact" element={<Contact />} />
    {isPayment && (
      <>
        {/* <Route path="/conversation" element={<Conversation />} /> */}
        <Route path="/library" element={<Library />} />
      </>
    )}
    <Route path="/courses" element={<Courses isDemo={!isPayment} />} />
    <Route path="/course/:idCourse" element={<Course isDemo={!isPayment} />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/close" element={<CloseSection />} />
    <Route path="/term-user" element={<FinalUser />} />
    <Route path="/term-payment" element={<TermPayment />} />
    <Route path="/term-privacy" element={<Privacy />} />
    <Route path="/term-conditions" element={<Conditions />} />
    <Route path="/payment/:paymentMethod" element={<Payment />} />
    <Route path="/plan" element={<Plans />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterStudent;