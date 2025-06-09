import {
  RegisterHandler,
  LoginHandler,
  LogoutHandler,
} from "../controllers/auth.controller.js";

const root_path = "/auth";

const authRoutes = [
  {
    method: "POST",
    path: `${root_path}/register`,
    handler: RegisterHandler,
  },
  {
    method: "POST",
    path: `${root_path}/login`,
    handler: LoginHandler,
  },
  {
    method: "POST",
    path: `${root_path}/logout`,
    handler: LogoutHandler,
  },
];

export default authRoutes;
