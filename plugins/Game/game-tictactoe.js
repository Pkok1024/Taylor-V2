import TicTacToe from '../../lib/tictactoe.js'

// The handler function is the main function that will be executed when the command is called
const handler = async (m, { conn, usedPrefix, command, text }) => {
    // Initialize the game object if it doesn't exist
    conn.game = conn.game ? conn.game : {}

    // Check if the user is already in a game
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
        throw 'Kamu masih didalam game'
    }

    // Find a room that is in the 'WAITING' state and either has no name or has a name that matches the given text
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))

    // If a room is found
    if (room) {
        // Set the 'o' property of the room to the current chat and set the 'playerO' property of the game to the user's ID
        room.o = m.chat
        room.game.playerO = m.sender

        // Set the state of the room to 'PLAYING'
        room.state = 'PLAYING'

        // Render the game board and replace the numbers with the corresponding symbols
        let arr = room.game.render().map(v => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
            } [v]
        })

        // Create a string that displays the game board and the current turn
        let str = `
Room ID: ${room.id}
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
Menunggu @${room.game.currentTurn.split('@')[0]}
Ketik *nyerah* untuk nyerah
`.trim()

        // Reply to the user who initiated the game with the game board and the current turn
        await conn.reply(room.x, str, m, {
            mentions: await conn.parseMention(str)
        })

        // Reply to the other user with the game board and the current turn
        await conn.reply(room.o, str, m, {
            mentions: await conn.parseMention(str)
        })
    } else {
        // If no room is found, create a new room
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        }

        // If a custom room name is given, set it as the name of the room
        if (text) room.name = text

        // Reply to the user who initiated the game that they are waiting for a partner
        let str = 'Menunggu partner' + (text ? ` mengetik command dibawah ini
${usedPrefix}${command} ${text}` : '')
        await conn.reply(room.x, str, m, {
            mentions: await conn.parseM
