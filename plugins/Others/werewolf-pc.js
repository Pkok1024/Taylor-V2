import {
    sesi as getSesi,
    playerOnGame,
    dataPlayer,
    getPlayerById2,
    killWerewolf,
    dreamySeer,
    sorcerer,
    protectGuardian
} from '../../lib/werewolf.js';

// The handler function is responsible for processing the command
const handler = async (m, {
    conn,
    args
}) => {
    // Extract the sender and ww (werewolf) objects from the message and the connection
    const {
        sender
    } = m;
    conn.werewolf = conn.werewolf || {};
    const ww = conn.werewolf || {};

    // Get the value and target arguments from the user input
    const value = args[0];
    const target = args[1];

    // Check if the user is in a game session
    if (!playerOnGame(sender, ww))
        return m.reply("Kamu tidak dalam sesi game");

    // Check if the user has already used their skill this game night
    if (dataPlayer(sender, ww).status)
        return m.reply("Skill telah digunakan, skill hanya bisa digunakan sekali setiap malam");

    // Check if the user is dead in the game
    if (dataPlayer(sender, ww).isdead)
        return m.reply("Kamu sudah mati");

    // Validate the target input
    if (!target || target.length < 1) return m.reply("Masukkan nomor player");
    if (isNaN(target)) return m.reply("Gunakan hanya nomor");

    // Get the player object by their ID
    let byId = getPlayerById2(sender, parseInt(target), ww);

    // Check if the target player is dead
    if (byId.db.isdead) return m.reply("Player sudah mati");

    // Check if the user is trying to use a skill on themselves
    if (byId.db.id === sender)
        return m.reply("Tidak bisa menggunakan skill untuk diri sendiri");

    // Check if the target player exists
    if (byId === false) return m.reply("Player tidak terdaftar");

    // Perform different actions based on the user input
    if (value === "kill" && dataPlayer(sender, ww).role === "werewolf") {
        if (byId.db.role === "sorcerer")
            return m.reply("Tidak bisa menggunakan skill untuk teman");

        // Kill the target player
        m.reply("Berhasil membunuh player " + parseInt(target)).then(() => {
            dataPlayer(sender, ww).status = true;
            killWerewolf(sender, parseInt(target), ww);
        });
    } else if (value === "dreamy" && dataPlayer(sender, ww).role === "seer") {
        let dreamy = dreamySeer(m.sender, parseInt(target), ww);

        // Reveal the target player's role
        m.reply(`Berhasil membuka identitas player ${target} adalah ${dreamy}`).then(() => {
            dataPlayer(sender, ww).status = true;
        });
    } else if (value === "deff" && dataPlayer(sender, ww).role === "guardian") {
        m.reply(`Berhasil melindungi player ${target}`).then(() => {
            protectGuardian(m.sender, parseInt(target), ww);
            dataPlayer(sender, ww).status = true;
        });
    } else if (value === "sorcerer" && dataPlayer(sender, ww).role === "sorcerer") {
        let sorker = sorcerer(getSesi(m.sender), target);

        // Reveal the target player's role
        m.reply(`Berhasil membuka identitas player ${target} adalah ${sorker}`).then(() => {
            dataPlayer(sender, ww).status = true;
        });
