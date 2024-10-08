import React from 'react';
import Contact from '../../pages/Contact';
import Home from '../../pages/LandingPage';
import Login from '../../pages/SingOut/Login';
import Register from '../../pages/SingOut/Register';
import Course from '../../pages/Student/Course';
import Courses from '../../pages/Student/Courses';
import { Routes, Route } from 'react-router-dom';
import Page404 from '../../pages/Page404';
import ResetPassword from '../../pages/SingOut/ResetPassword';
import ResetPasswordAuth from '../../pages/SingOut/ResetPasswordAuth';
import Privacy from '../../pages/Terms/Privacy';
import FinalUser from '../../pages/Terms/FinalUser';
import Payment from '../../pages/Terms/Payment';
import Conditions from '../../pages/Terms/Conditions';
import ActiveAccount from '../../pages/SingOut/ActiveAccount';
import Tutorial from '../../pages/Tutorial';

const RouterHomePage: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/courses" element={<Courses isDemo />} />
    <Route path="/course/:idCourse" element={<Course isDemo />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/reset-password-auth/:token" element={<ResetPasswordAuth />} />
    <Route path="/term-user" element={<FinalUser />} />
    <Route path="/term-payment" element={<Payment />} />
    <Route path="/term-privacy" element={<Privacy />} />
    <Route path="/term-conditions" element={<Conditions />} />
    <Route path="/active-account/:token" element={<ActiveAccount />} />
    {/* <Route path="/tutorial" element={<Tutorial />} /> */}
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterHomePage;
