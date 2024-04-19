import fetch from 'node-fetch';
import fs from 'fs';
import * as moment from 'moment';

const {
    v4: uuidv4
} = require('uuid');

const usersFile = './users.json';
let users = loadUsers();

function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveUsers() {
    fs.writeFileSync(usersFile, JSON.stringify(users));
}

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    DevMode
}) => {
    try {
        let user = users.find(u => u.id === m.sender);
        if (!user) {
            user = {
                id: m.sender,
                lastBansos: 0,
                money: 0,
            };
            users.push(user);
            saveUsers();
        }

        const Aku = Math.floor(Math.random() * 101);
        const Kamu = Math.floor(Math.random() * 81); // Menantang 😏
        const A = Aku;
        const K = Kamu;
        const kb = 'https://telegra.ph/file/afcf9a7f4e713591080b5.jpg';
        const mb = 'https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg';
        const timeDiff = moment.duration(moment(new Date()).diff(moment(user.lastBansos)));
        const timers = `${timeDiff.days()} Hari, ${timeDiff.hours()} Jam, ${timeDiff.minutes()} Menit, ${timeDiff.seconds()} Detik`;

        if (timeDiff.asMilliseconds() > 300000) {
            if (A > K) {
                await conn.sendFile(m.chat, kb, 'b.jpg', `*Kamu Tertangkap!* Korupsi dana bansos 🕴️💰, Denda *3 Juta* rupiah 💵`, m);
                user.money -= 3000000;
                user.lastBansos = new Date();
            } else if (A < K) {
                user.money += 3000000;
                await conn.sendFile(m.chat, mb, 'b.jpg', `*Berhasil Korupsi!* Dana bansos 🕴️💰, Dapatkan *3 Juta* rupiah 💵`, m);
                user.lastBansos = new Date();
            } else {
                await conn.reply(m.chat, `*Maaf!* Kamu tidak berhasil melakukan korupsi bansos dan kamu tidak akan masuk penjara karena kamu *melarikan diri* 🏃`, m);
                user.lastBansos = new Date();
            }
        } else {
            await conn.reply(m.chat, `*Sudah Melakukan Korupsi!* 💰\nHarus menunggu selama agar bisa korupsi bansos kembali\n▸ 🕓 ${timers}`, m);
        }
        saveUsers();
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `Terjadi kesalahan`, m);
    }
};

handler.help = ['
