import {
  getDestinationBySlug,
  getDestinationsByTipe,
} from "../controllers/destination.controller.js";

const destinationRoutes = [
  {
    method: "GET",
    path: "/destinations",
    handler: getDestinationsByTipe,
  },
  {
    method: "GET",
    path: "/destinations/{slug}",
    handler: getDestinationBySlug,
  },
];

export default destinationRoutes;
