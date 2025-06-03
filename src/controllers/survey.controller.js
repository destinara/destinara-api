import prisma from '../prisma/client.js'

export const getRekomendasiDestinasi = async (request, h) => {
const { userId } = request.params

// Ambil preferensi kategori user
const survey = await prisma.rekomendasi_destinasi.findFirst({
where: { user_id: parseInt(userId) },
orderBy: { created_at: 'desc' },
})

if (!survey) {
return h.response({ message: 'Data preferensi tidak ditemukan' }).code(404)
}

// Pecah string kategori menjadi array
const kategoriList = survey.list_kategori.split(',').map(k => k.trim())

// Ambil destinasi yang termasuk dalam kategori
const destinasi = await prisma.destinations.findMany({
where: {
kategori: {
in: kategoriList,
},
},
orderBy: { rating: 'desc' },
})

return h.response({
message: 'Rekomendasi destinasi ditemukan',
data: destinasi,
}).code(200)
}