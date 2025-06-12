import { getKuliners } from "../controllers/kuliner.controller.js";

export default [
  {
    method: "GET",
    path: "/kuliners",
    handler: getKuliners,
  },
];
