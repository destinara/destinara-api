import {
  getKuliners,
  getKulinersBySlug,
} from "../controllers/kuliner.controller.js";

export const kulinerRoutes = [
  {
    method: "GET",
    path: "/kuliners",
    handler: getKuliners,
  },
  {
    method: "GET",
    path: "/kuliners/{slug}",
    handler: getKulinersBySlug,
  },
];
