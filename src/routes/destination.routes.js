import { getDestinationsByTipe } from "../controllers/destination.controller.js";

const destinationRoutes = [
  {
    method: "GET",
    path: "/destinations/by-tipe",
    handler: getDestinationsByTipe,
  },
];

export default destinationRoutes;
