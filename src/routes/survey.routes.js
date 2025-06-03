import { getRekomendasiDestinasi } from '../controllers/survey.controller'

const rekomendasiRoutes = [
{
method: 'GET',
path: '/rekomendasi/{userId}',
handler: getRekomendasiDestinasi,
},
]

export default rekomendasiRoutes
