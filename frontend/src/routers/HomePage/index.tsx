import React from 'react';
import Contact from '../../pages/Contact';
import Home from '../../pages/LandingPage';
import Login from '../../pages/SingOut/Login';
import Register from '../../pages/SingOut/Register';
import Course from '../../pages/Student/Course';
import Library from '../../pages/Student/Library';
import Courses from '../../pages/Student/Courses';
import { Routes, Route } from 'react-router-dom';
import Page404 from '../../pages/Page404';
import ResetPassword from '../../pages/SingOut/ResetPassword';
import ResetPasswordAuth from '../../pages/SingOut/ResetPasswordAuth';
import Privacy from '../../pages/Terms/Privacy';
import Agreement from '../../pages/Terms/Agreement';
import FinalUser from '../../pages/Terms/FinalUser';
import Payment from '../../pages/Terms/Payment';
import Conditions from '../../pages/Terms/Conditions';
import Service from '../../pages/Terms/Service';
import Plans from '../../pages/Plans/Index';

/*
 In the future, we're going to use these lines of code to implement code splitting.

  const Contact: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/HomePage/Contact'))
  );
  const Home: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/HomePage/Home'))
  );
  const Login: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/HomePage/Login'))
  );
  const Navigator: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../components/Navigator'))
  );
  const Register: React.LazyExoticComponent<React.FC<{}>> = (
    React.lazy(() => import('../../pages/HomePage/Register'))
  );
*/

const RouterHomePage: React.FC = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="contact" element={<Contact />} />
    <Route path="login" element={<Login />} />
    <Route path="register/:paymentMethod" element={<Register />} />
    <Route path="courses" element={<Courses isDemo />} />
    <Route path="course/:idCourse" element={<Course isDemo />} />
    <Route path="libraries" element={<Library />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="reset-password-auth/:token" element={<ResetPasswordAuth />} />
    <Route path="term-agreement" element={<Agreement />} />
    <Route path="term-user" element={<FinalUser />} />
    <Route path="term-payment" element={<Payment />} />
    <Route path="term-privacy" element={<Privacy />} />
    <Route path="term-conditions" element={<Conditions />} />
    <Route path="term-service" element={<Service />} />
    <Route path="plan" element={<Plans />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RouterHomePage;
