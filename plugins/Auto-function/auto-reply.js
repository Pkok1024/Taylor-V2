/**
 * This is an asynchronous function that runs before a message is processed.
 * It checks for certain conditions and sends automated replies based on those conditions.
 *
 * @param {Object} m - The message object that triggers the function.
 * @returns {boolean} - Returns true if the function completes without errors.
 */
export async function before(m) {
  // Destructure the necessary properties from the message object
  const {
    mtype, // The type of the message (text, image, etc.)
    text, // The text content of the message
    isBaileys, // Whether the message is from Baileys (the WhatsApp API library)
    sender // The JID (Jabber ID) of the sender
  } = m;

  // Extract the username from the sender's JID
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender;
  const name = who.split("@")[0];

  // Get the chat object from the global database
  const chat = global.db.data.chats[m.chat];

  // Get the banned status of the sender from the global database
  const {
    banned
  } = global.db.data.users[sender];

  // If the chat has auto-reply enabled and the message is not from Baileys
  if (chat.autoReply && !isBaileys) {
    // Check for specific message types and send automated replies
    if (mtype === 'groupInviteMessage' || text.startsWith('https://chat') || text.startsWith('Buka tautan ini')) {
      // Send a reply with a custom message and mention the sender
      this.reply(m.chat, `✨ *Undang Bot ke Grup* ✨\n💎 7 Hari / Rp 5,000\n💎 30 Hari / Rp 15,000`, m, {
        mentions: [sender]
      });

      // Send a reply to the sender with a custom message and mention them
      await this.reply(sender + '@s.whatsapp.net', `Ada yang mau nyulik nih :v \n\nDari: @${sender.split("@")[0]} \n\nPesan: ${text}`, m, {
        mentions: [sender]
      });
    }

    // Handle reaction messages and edited messages
    // ...

    // Define a messages object with predefined replies for specific message types
    const messages = {
      reactionMessage: reactCaption,
      paymentMessage: `💸 *Terdeteksi* @${name} Lagi Meminta Uang`,
      productMessage: `📦 *Terdeteksi* @${name} Lagi Promosi`,
      orderMessage: `🛒 *Terdeteksi* @${name} Lagi Meng Order`,
      pollCreationMessage: `📊 *Terdeteksi* @${name} Lagi Polling`,
      contactMessage: `📞 *Terdeteksi* @${name} Lagi Promosi Kontak`,
    };

    // Check if the message type is in the messages object and send the corresponding reply
    if (mtype in messages) {
      const caption = messages[mtype];
      const mentions = await this.parseMention(caption);
      await this.reply(m.chat, caption, m, {
        mentions
      });
    }

    // Check if the message text contains any trigger words and send a random reply
    const triggerWords = ['aktif', 'wey', 'we', 'hai', 'oi', 'oy', 'p', 'bot'];
    const lowerText = text.toLowerCase();
    if (triggerWords.some(word => lowerText === word)) {
      const apsih = ["Kenapa", "Ada apa", "Naon meng", "Iya, bot disini", "Luwak white coffee passwordnya", "Hmmm, kenapa", "Apasih", "Okey bot sudah aktif", "2, 3 tutup botol", "Bot aktif"];
      const caption = `🤖 *${apsih[Math.floor(Math.random() * apsih.length)]}* kak @${name} 🗿`;
      await this.reply(m.chat, caption, m, {
        mentions: [who]
      });
    }

    // Check if the message is a sticker or contains a specific emoji and react with the same emoji
    if (mtype === 'stickerMessage' || text.includes('🗿')) {
      this.sendMessage(m.chat, {
        react: {
          text: '🗿',
          key: m.key
        }
      });
    }
  }

  // Return true if the function completes without errors
  return true;
}
