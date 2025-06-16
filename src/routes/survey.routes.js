import {
  handleSurveyRecommendation,
  getRekomendasiByUserId,
} from "../controllers/survey.controller.js";

const surveyRoutes = [
  {
    method: "POST",
    path: "/survey",
    handler: handleSurveyRecommendation,
  },
  {
    method: "GET",
    path: "/rekomendasi",
    handler: getRekomendasiByUserId,
  },
];

export default surveyRoutes;
