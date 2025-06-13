import { handleSurveyRecommendation } from "../controllers/survey.controller.js";

const surveyRoutes = [
  {
    method: "POST",
    path: "/survey",
    handler: handleSurveyRecommendation,
  },
];

export default surveyRoutes;
