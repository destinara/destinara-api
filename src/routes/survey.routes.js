import { CreateSurvey } from "../controllers/survey.controller.js";

const surveyRoutes = [
  {
    method: "POST",
    path: "/survey",
    handler: CreateSurvey,
  },
];

export default surveyRoutes;
