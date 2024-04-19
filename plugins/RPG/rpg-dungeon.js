const {
    List,
    Map
} = require('immutable')

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text,
    args,
    isOwner,
    isAdmin,
    isBotAdmin
}) => {
    // Validate command usage
    if (!text) throw `${usedPrefix}${command} needs room name`

    // Get user data
    let user = global.db.data.users[m.sender]

    // Check if user has sword, armor, and enough health
    let SWORD = user.sword < 1
    let ARMOR = user.armor < 1
    let HEALTH = user.health < 90

    // Check if user can enter dungeon
    if (SWORD || ARMOR || HEALTH) {
        let lmao = item(user.sword * 1, user.armor * 1, user.health * 1, usedPrefix)
        let message = lmao + "\n\n";

        if (SWORD) message += `${usedPrefix}craft sword - Craft Sword\n`;
        if (ARMOR) message += `${usedPrefix}shop buy armor - Beli Armor\n`;
        if (HEALTH) message += `${usedPrefix}heal - Healing\n`;

        message += "\n";

        return conn.sendMessage(m.chat, {
            text: message
        }, {
            quoted: m
        });
    }

    // Get dungeon data
    global.dungeon = global.dungeon || {}
    let dungeonId = `dungeon${new Date().getTime()}`
    let room = global.dungeon[dungeonId]

    // Check if user is already in a dungeon
    if (Object.values(global.dungeon).find(room => room.id.startsWith('dungeon') && [room.game.player1, room.game.player2, room.game.player3, room.game.player4].includes(m.sender))) return m.reply('Kamu masih di dalam Dungeon') // nek iseh neng njero dungeon

    // Check if user can enter dungeon
    let timing = (new Date - (user.lastDungeon * 1)) * 1
    if (timing < 600000) return m.reply(`Silahkan tunggu ${clockString(600000 - timing)} untuk bisa ke Dungeon`) // Cooldown

    // Create new dungeon or get existing one
    if (!room) {
        room = {
            id: dungeonId,
            player1: m.chat,
            player2: '',
            player3: '',
            player4: '',
            state: 'WAITING',
            game: {
                player1: m.sender,
                player2: '',
                player3: '',
                player4: '',
            },
            price: {
                money: (Math.floor(Math.random() * 501)) * 1,
                exp: (Math.floor(Math.random() * 701)) * 1,
                sampah: (Math.floor(Math.random() * 201)) * 1,
                potion: (Math.floor(Math.random() * 2)) * 1,
                diamond: (pickRandom([0, 0, 0, 0, 1, 0, 0])) * 1,
                iron: (Math.floor(Math.random() * 2)) * 1,
                kayu: (Math.floor(Math.random() * 3)) * 1,
                batu: (Math.floor(Math.random() * 2)) * 1,
                string: (Math.floor(Math.random() * 2)) * 1,
                common: (pickRandom([0, 0, 0, 1, 0, 0])) * 1,
                uncommon: (pickRandom([0, 0, 0, 1, 0, 0, 0])) * 1,
                mythic: (pickRandom([0, 0, 0, 1, 0, 0, 0, 0, 0])) * 1,
                legendary: (pickRandom([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0])) * 1,
                pet: (pickRandom([0, 0, 0, 1, 0, 0, 0, 0, 0, 0])) * 1,
                makananPet: (pickRandom([0, 0, 0, 1, 0, 0, 0, 0])) * 1,
            },
            less: {
                healt: (Math.floor(Math.random() * 101)) * 1,
                sword: (Math.floor(Math.random() * 50)) * 1,
            }
        }
    }

    // Add user to dungeon
    if (!room.game.player2) {
        room.game.player2 = m.sender
        room.player2 = m.chat
    } else if (!room.game.player3) {
        room.game.player3 = m.sender
        room.player3 = m.chat
    } else if (!room.game.player4) {
        room.game.player4 = m.sender
        room.player4 = m.chat
        room.state = 'PLAYING'
    } else {
        throw 'Dungeon is full'
    }

    // Send waiting message
    let cmdText = "\nCommand: " + (text ? `*${usedPrefix}${command} ${text}*` :
