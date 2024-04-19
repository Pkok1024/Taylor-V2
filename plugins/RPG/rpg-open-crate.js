// Define the handler function that processes incoming messages
const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  // Define the default response message
  let bruh = `${usedPrefix}open <crate name> < 1 | 10 | 100 | 1000 >\n\nExample: *${usedPrefix}open common 10*\n\nList of crates:\n*pet*\n*boxs*\n*cupon*\n*common*\n*uncommon*\n*mythic*\n*gardenboxs*`

  // Parse the arguments and check for valid crate type and count
  const _lmao = args[0]
  const Lmao = `Only supports 1, 10, 100, 1000\nExample: *${usedPrefix}open ${args > 2 ? _lmao : pickRandom(['common', 'uncommon', 'mythic', 'legendary'])} 10*`
  const type = (args[0] || '').toLowerCase()
  const jumlah = (args[1] || '').toLowerCase()

  // Perform different actions based on the crate type and count
  switch (type) {
    case 'common':
      // Handle common crate
      break
    case 'uncommon':
      // Handle uncommon crate
      break
    case 'mythic':
      // Handle mythic crate
      break
    case 'boxs':
      // Handle boxs crate
      break
    case 'gardenboxs':
      // Handle gardenboxs crate
      break
    case 'cupon':
      // Handle cupon crate
      break
    case 'pet':
      // Handle pet crate
      break
    default:
      // Return error message for invalid crate type
      return conn.reply(m.chat, Lmao, m)
  }
}

// Define the help, tags, and command properties for the handler function
handler.help = ['opencrate'].map(v => v + ' [crate] [count]')
handler.tags = ['rpg']
handler.command = /^(opencrate)$/i

// Define the pickRandom and clockString utility functions
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
}
