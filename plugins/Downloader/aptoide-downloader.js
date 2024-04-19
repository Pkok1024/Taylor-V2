import axios from "axios";
import {
    Mimetype
} from "@adiwajshing/baileys";

let handler = async (m, {
    conn,
    text,
    command,
    usedPrefix
}) => {
    let packageName = text.toLowerCase();
    let regex = /^[a-z]\w*(\.[a-z]\w*)+$/;

    if (!regex.test(packageName)) {
        return conn.sendMessage(m.chat, {
            text: `Input package name in the format: com.example.app\n\nExample: ${usedPrefix}aptoidedl com.example.app`,
            footer: wm
        }, {
            quoted: m
        });
    }

    try {
        let aptoResponse = await axios.get(`https://m.aptoide.com/api/7/app/market/browse?name=${packageName}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
            }
        });

        if (aptoResponse.data.length === 0) {
            return conn.sendMessage(m.chat, {
                text: 'No package found with the given name.',
                footer: wm
            }, {
                quoted: m
            });
        }

        let {
            apk_file,
            icon,
            title,
            last_updated,
