import fetch from 'node-fetch'
import axios from 'axios'
import fs from 'fs'
import {
    requestPaymentMessage,
    messageType,
    Mimetype,
    wm,
    cmenuf
} from '../lib/whatsapp.js'

let handler = async (m, {
    conn,
    usedPrefix,
    text,
    args,
    command
}) => {
    try {
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        let pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom())
        let name = await conn.getName(who)

        if (!args[0]) throw `Masukkan paramenter\n\nList:\nkanji\nwords\nreading\n`

        if (!['kanji', 'words', 'reading'].includes(args[0])) throw `Invalid parameter. Use 'kanji', 'words', or 'reading'.`

        if (!args[1]) throw `Masukkan teks atau kanji`

        let tes = args[1].replaceAll(' ', '').replaceAll('\n', '').split('')

        let pesan = `*Result :*`

        if (args[0] == 'kanji') {
            for (let x of tes) {
                let url = `https://kanjiapi.dev/v1/${args[0]}/${encodeURIComponent(x)}`
                let res = await fetch(url)
                if (!res.ok) throw `Invalid URL: ${url}`
                let json = await res.json()
                if (!json.kanji) throw `Invalid response format: ${url}`
                let {
                    kanji,
                    grade,
                    stroke_count,
                    meanings,
                    kun_readings,
                    on_readings,
                    name_readings,
                    jlpt,
                    unicode,
                    heisig_en
                } = json
                if (typeof grade != 'number') throw `Invalid grade value: ${grade}`
                if (typeof stroke_count != 'number') throw `Invalid stroke count value: ${stroke_count}`
                if (!Array.isArray(meanings)) throw `Invalid
