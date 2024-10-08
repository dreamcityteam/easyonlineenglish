import { Tab } from './type';

const studentPayment: Tab[] = [
  { path: '/', value: 'Inicio' },
  { path: '/contact', value: 'Contacto' },
  { path: '/courses', value: 'Cursos' },
  { path: '/plan', value: 'Plan' },
  { path: '/library', value: 'Librería' },
  { path: '/profile', value: 'Perfil', showMobile: true },
  // { path: '/conversation', value: 'Conversaciones' },
  { path: '/close', value: 'Cerrar sesión' },
];

const studentPendingPayment: Tab[] = [
  { path: '/', value: 'Inicio' },
  { path: '/contact', value: 'Contacto' },
  { path: '/courses', value: 'Cursos' },
  { path: '/plan', value: 'Plan' },
  { path: '/profile', value: 'Perfil', showMobile: true },
  { path: '/close', value: 'Cerrar sesión' },
];

const homepage: Tab[] = [
  { path: '/', value: 'Inicio' },
  { path: '/courses', value: 'Cursos' },
  { path: '/contact', value: 'Contacto' },
  { path: '/register', value: 'Crea tu cuenta' },
  { path: '/login', value: 'Iniciar sesión' },
  // { path: '/tutorial', value: 'Tutorial' },
];

const admin: Tab[] = [
  { path: '/courses', value: 'Courses' },
  // { path: '/upload', value: 'upload' },
  { path: '/conversation', value: 'Conversaciones' },
  { path: '/library', value: 'Librería' },
  { path: '/close', value: 'Cerrar sesión' },
];

export { studentPendingPayment, studentPayment, homepage, admin };
