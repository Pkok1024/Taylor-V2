const maxUsers = 50;

let handler = async (m, {
    usedPrefix,
    command,
    text,
    args
}) => {
    if (!args || !['add', 'remove'].includes(args[0].toLowerCase())) throw `
*Usage:* ${usedPrefix + command} <add|remove> nomor,nomor,...,nomor
*Example:*
${usedPrefix + command} add 6281111111111,12345678901,0
${usedPrefix + command} remove 62811111111
