// Import the necessary modules and dependencies
const flaaa = require('flaaa'); // Assuming 'flaaa' is a module that provides random images

// Define the handler function for the command
const handler = async (m, { conn, command }) => {
  // Get the user data from the global database
  let user = global.db.data.users[m.sender];

  // Get a random image using the 'flaaa' module
  let imgr = flaaa.getRandom();

  // Define the caption for the response message
  const caption = `
${htki} *B A N K  U S E R* ${htka}
${dmenub} 📛 *Name:* ${user.registered ? user.name : conn.getName(m.sender)}
${dmenub} 💳 *Atm:* ${user.atm > 0 ? 'Level ' + user.atm : '✖️'}
${dmenub} 🏛️ *Bank:* ${user.bank} 💲 / ${user.fullatm} 💲
${dmenub} 💹 *Money:* ${user.money} 💲
${dmenub} 🤖 *Robo:* ${user.robo > 0 ? 'Level ' + user.robo : '✖️'}
${dmenub} 🌟 *Status:* ${user.premiumTime > 0 ? 'Premium' : 'Free'}
${dmenub} 📑 *Registered:* ${user.registered ? 'Yes':'No'}
${dmenuf}
`.trim();

  // Send the file and caption to the chat
  await conn.sendFile(m.chat, imgr + command, "", caption, m);
}

// Set the help, tags, and command properties for the handler
handler.help = ['bank'];
handler.tags = ['rpg'];
handler.command = /^(bank(cek)?|cekbank)$/i;

// Set
