import { RegisterHandler, LoginHandler, LogoutHandler } from '../controllers/auth.controller.js';

const authRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: RegisterHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: LoginHandler,
  },
  {
    method: 'POST',
    path: '/logout',
    handler: LogoutHandler,
  },
];

export default authRoutes;
