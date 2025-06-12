import { handleSurveyRecommendation } from "../controllers/survey.controller.js";

const surveyRoutes = [
  {
    method: "POST",
    path: "/survey",
    handler: handleSurveyRecommendation,
    options: {
      description: "Kirim survey aktifitas dan simpan hasil rekomendasi",
      tags: ["api"],
    },
  },
];

export default surveyRoutes;
