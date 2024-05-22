import { Tab } from './type';

const student: Tab[] = [
  { path: '/', value: 'Inicio' },
  { path: '/contact', value: 'contacto' },
  { path: '/courses', value: 'cursos' },
  { path: '/libraries', value: 'librería' },
  { path: '/profile', value: 'perfil' },
  { path: '/close', value: 'cerrar sesión' },
];

const homepage: Tab[] = [
  { path: '/', value: 'inicio' },
  { path: '/courses', value: 'cursos' },
  { path: '/contact', value: 'contacto' },
  { path: '/login', value: 'iniciar sesión' },
  { path: '/register', value: 'inscribirse' },
];

export { student, homepage };
