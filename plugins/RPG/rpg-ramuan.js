const pets = [
  { name: 'rubah', maxLevel: 5 },
  { name: 'kuda', maxLevel: 5 },
  { name: 'serigala', maxLevel: 15 },
  { name: 'naga', maxLevel: 20 },
  { name: 'kyubi', maxLevel: 20 },
  { name: 'centaur', maxLevel: 20 },
  { name: 'phonix', maxLevel: 15 },
  { name: 'griffin', maxLevel: 15 },
  { name: 'kucing', maxLevel: 5 },
  { name: 'hero', maxLevel: 100 },
]

const feedPet = async (m, pet, animateLevelUp = true) => {
  const user = global.db.data.users[m.sender]
  const petData = user[pet.name]
  const petMaxLevel = pets.find(p => p.name === pet.name).maxLevel
  const feedInterval = 600000
  const feedMessage = `Berhasil memberi ramuan pet ${pet.name}`
  const feedAgainMessage = `Pet kamu sudah meminum ramuan, coba beberapa ${clockString(feedInterval)} lagi`
  const feedPetMessage = `Waktunya memberi ramuan pet ${pet.name}`
  const feedPetTimeout = time => setTimeout(() => conn.reply(m.chat, feedPetMessage, m), time)
  const levelUpMessage = animateLevelUp ? `*Selamat Pet ${pet.name} kamu naik level*` : ''
  const levelUp = () => {
    user[pet.name] += 1
    user.anak[pet.name] -= (pet.level * 1000)
    conn.reply(m.chat, levelUpMessage, m)
  }

  if (!petData) return m.reply(`*Kamu belum memiliki Pet ${pet.name}*`)
  if (petData.level === petMaxLevel) return m.reply(`*Pet kamu dah lvl max*`)

  const lastFeed = user[`ramuan${pet.name}last`]
  const timeSinceLastFeed = new Date() - lastFeed
  const timeToFeed = feedInterval - timeSinceLastFeed

  if (timeSinceLastFeed < feedInterval) return m.reply(feedAgainMessage)

  if (user.ramuan <= 0) return m.reply(`Ramuan pet kamu tidak cukup`)

  user.ramuan -= 1
  user.anak[pet.name] += 200
  user[`ramuan${pet.name}last`] = new Date() * 1
  conn.reply(m.chat, feedMessage, m)

  if (petData.level > 0) {
    const threshold = (petData.level * 1000) - 1
    if (user.anak[pet.name] > threshold) {
      levelUp()
    }
  }

  feedPetTimeout(timeToFeed)
}

const handler = async (m, { conn, usedPrefix }) => {
  const type = (m.text.toLowerCase() || '').trim().slice(7)
  const pet = pets.find(p => p.name === type)

  if (!pet) return conn.reply(m.chat, `${usedPrefix}ramuan [hero | kucing | rubah | kuda | naga | centaur | phonix | serigala]\nContoh penggunaan: *${usedPrefix}ramuan kucing*`, m)

  await feedPet(m, pet, false)
}

handler.help = ['ramuan [pet type]']
handler.tags = ['rpg']
handler.command = /^(ramuan)$/i
handler.limit = true
handler.group = true

export default handler

function clockString(ms) {
  // ...
}
