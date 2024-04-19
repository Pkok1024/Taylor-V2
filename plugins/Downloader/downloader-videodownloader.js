import cheerio from 'cheerio';
import {
    fetch
} from 'undici';

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const msg = `Input link atau reply link yang ingin di download!\n\n*Contoh:*\n${usedPrefix + command} link`;
    let text;

    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw msg;

