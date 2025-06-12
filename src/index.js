import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import surveyRoutes from "./routes/survey.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import kulinerRoutes from "./routes/kuliner.routes.js";

dotenv.config();
console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 2000,
    host: "localhost",
    routes: {
      cors: { origin: ["*"] },
    },
  });

  // Register all routes
  server.route([
    ...authRoutes,
    ...surveyRoutes,
    ...destinationRoutes,
    ...kulinerRoutes,
  ]);

  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
