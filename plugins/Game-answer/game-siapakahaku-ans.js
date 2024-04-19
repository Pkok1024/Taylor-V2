import similarity from 'similarity'
const similarityThreshold = 0.72

export async function before(m) {
  let chatId = m.chat
  if (
    !m.quoted ||
    !m.quoted.fromMe ||
    !m.quoted.isBaileys ||
    !m.text ||
    !/Ketik.*hsi/i.test(m.quoted.text) ||
    /.*hsi/i.test(m.text)
  )
    return !0

  this.currentGame = this.currentGame ? this.currentGame : {}
  if (!(chatId in this.currentGame))
    return this.reply(chatId, 'Soal itu telah berakhir', m)

  if (m.quoted.id == this.currentGame[chatId][0].id) {
    const isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
    if (isSurrender) {
      clearTimeout(this.currentGame[chatId][3])
      delete this.currentGame[chatId]
      return this.reply(chatId, '*Yah Menyerah :( !*', m)
    }

    let gameData
    try {
      gameData = JSON.parse(JSON.stringify(this.currentGame[chatId][1]))
    } catch (error) {
      console.error('Error parsing game data:', error)
      return this.reply(chatId, 'Terjadi kesalahan, silakan coba lagi.', m)
    }

    if (m.text.toLowerCase() === gameData.answer.toLowerCase().trim()) {
      this.users.exp[m.sender] += this.currentGame[chatId][2]
      this.reply(chatId, `✅ *Benar!*\n+${this.currentGame[chatId][2]} XP`, m)
      clearTimeout(this.currentGame[chatId][3])
      delete this.currentGame[chatId]
    } else if (similarity(m.text.toLowerCase(), gameData.answer.toLowerCase().
