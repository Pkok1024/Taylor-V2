const {
    List,
    Split,
    parseMs,
    formatDistance
} = require('klawesome')

let handler = async (m, {
    conn
}) => {
    let stats = Object.entries(global.db.data.stats).map(([key, val]) => {
        let name = Array.isArray(plugins[key]?.help) ? plugins[key]?.help?.join('\n• ') : plugins[key]?.help || key
        if (/exec/.test(name)) return
        return {
            name,
            ...val
        }
    })
    stats = stats.sort((a, b) => b.total - a.total)
    let txt = List(stats.slice(0, 10), ({
        name,
        total,
        last
    }, idx) => {
        if (name.includes('-') && name.endsWith('.js')) name = name.split('-')[1].replace('.js', '')
        return Split`
${htki} ${idx + 1} ${htka}
*${htjava} C M D ${htjava}*
${name}

*${htjava} H I T ${htjava}*
${total}

*${htjava} T I M E ${htjava}*
${formatDistance(last, Date.now())} yang lalu
`
    })
    conn.reply(m.chat, txt, m)
}
handler.help = ['dashboard']
handler.tags = ['info']
handler.command = /^^d(as(hbo(ard?|r)|bo(ard?|r))|b)$/i

module.exports = handler

module.exports.parseMs = parseMs
module.exports.getTime = (ms) => formatDistance(ms, Date.now())


npm install klawesome
