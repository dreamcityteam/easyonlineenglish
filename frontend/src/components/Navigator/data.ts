import { Tab } from './type';

const studentPayment: Tab[] = [
  { path: '/', value: 'Inicio' },
  { path: '/contact', value: 'contacto' },
  { path: '/courses', value: 'cursos' },
  { path: '/libraries', value: 'librería' },
  { path: '/profile', value: 'perfil', showMobile: true },
  { path: '/plan', value: 'planes' },
  { path: '/close', value: 'cerrar sesión' },
];

const studentPendingPayment: Tab[] = [
  { path: '/', value: 'Inicio' },
  { path: '/contact', value: 'contacto' },
  { path: '/profile', value: 'perfil', showMobile: true },
  { path: '/plan', value: 'planes' },
  { path: '/close', value: 'cerrar sesión' },
]

const homepage: Tab[] = [
  { path: '/', value: 'inicio' },
  { path: '/courses', value: 'cursos' },
  { path: '/contact', value: 'contacto' },
  { path: '/login', value: 'iniciar sesión' },
  { path: '/plan', value: 'Planes' },
];

export { studentPendingPayment, studentPayment, homepage };
