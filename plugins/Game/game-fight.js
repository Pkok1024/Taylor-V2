// This function is the main handler for the fight command
let handler = async (m, {
    conn, // The bot's connection object
    usedPrefix, // The prefix used in the current message
    participants // An array of participants in the current group chat
}) => {
    // Set the user's level in the bot's internal data structure
    conn.level = global.db.data.users[m.sender]

    // Initialize the fight property in the bot's internal data structure
    conn.fight = conn.fight ? conn.fight : {}

    // Define a delay function using JavaScript's built-in setTimeout
    const delay = time => new Promise(res => setTimeout(res, time));

    // Check if the user is already in a fight
    if (typeof conn.fight[m.sender] != "undefined" && conn.fight[m.sender] == true) {
        // If so, send an error message
        return m.reply(`*Tidak bisa melakukan pertarungan lagi karena anda sedang bertarung bro.*`)
    }

    // Get an array of user IDs from the participants array
    let users = participants.map(u => u.id)

    // Randomly select a user to be the opponent
    var lawan
    lawan = users[Math.floor(users.length * Math.random())]

    // Make sure the opponent is a valid user and not the same as the current user
    while (typeof global.db.data.users[lawan] == "undefined" || lawan == m.sender) {
        lawan = users[Math.floor(users.length * Math.random())]
    }

    // Generate a random duration for the fight
    let lamaPertarungan = getRandom(5, 15)

    // Send a message indicating that the fight has started
    m.reply(`*Kamu* (level ${global.db.data.users[m.sender].level}) menantang *${conn.getName(lawan)}* (level ${global.db.data.users[lawan].level}) dan sedang dalam pertarungan sengit.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang.`)

    // Set the user's fight status to true
    conn.fight[m.sender] = true

    // Wait for the specified duration
    await delay(1000 * 60 * lamaPertarungan)

    // Define some arrays of random messages to be used later
    let alasanKalah = ['Noob', 'Cupu', 'Kurang hebat', 'Ampas kalahan', 'Gembel kalahan']
    let alasanMenang = ['Hebat', 'Pro', 'Master Game', 'Legenda game', 'Sangat Pro', 'Rajin Nge-push']

    // Initialize an array to keep track of the user's level-based advantages
    let kesempatan = []
    for (i = 0; i < global.db.data.users[m.sender].level; i++) kesempatan.push(m.sender)
    for (i = 0; i < global.db.data.users[lawan].level; i++) kesempatan.push(lawan)

    // Initialize variables to keep track of the user's and opponent's scores
    let pointPemain = 0
    let pointLawan = 0

    // Simulate 10 rounds of the fight
    for (i = 0; i < 10; i++) {
        // Randomly determine which user has the advantage in the current round
        unggul = getRandom(0, kesempatan.length - 1)
        if (kesempatan[unggul] == m.sender) pointPemain += 1
        else pointLawan += 1
    }

    // Determine the winner of the fight based on the scores
    if (pointPemain > pointLawan) {
        // If the user won, calculate their winnings and update their data
        let hadiah = (pointPemain - pointLawan) * 10000
        global.db.data.users[m.sender].money += hadiah
        global.db.data.users[m.sender].tiketcoin += 1

        // Send a message indicating that the user won the fight
        m.reply(`*${conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${conn.getName(lawan)}*\n\n*Kamu* (level ${global.db.data.users[m.sender].level}) MENANG melawan *${conn.getName(lawan)}* (level ${global.db.data.users[lawan].level}) karena kamu ${alasanMenang[getRandom(0,alasanMenang.length-1)]}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`)
    } else if (pointPemain < pointLawan) {
        // If the user lost, calculate their losses and update their data
        let denda = (pointLawan - pointPemain) * 100000
        global.db.data.users[m.sender].money -= denda
        global.db.data.users[m.sender].tiketcoin += 1

        // Send a message indicating that the user lost the fight
        m.reply
