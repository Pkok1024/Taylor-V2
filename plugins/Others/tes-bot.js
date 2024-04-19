import os from 'os';
import {
    sizeFormatter
} from 'human-readable'
const format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    standard: 'KMGTPEZY'
});
const handler = async (m, {
    conn
}) => {
    try {
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const end = Date.now();
        const responseTime = (end - start) / 1000;

        const thumbnail = await conn.getFile("https://cdn-icons-png.flaticon.com/128/1533/1533913.png").catch(error => console.error("Error in getting thumbnail:", error));

        const osType = os.type();
        const osRelease = os.release();
        const osCPU = os.cpus()[0].model;
        const osMemory = os.totalmem();

        if (osType && osRelease && osCPU && osMemory) {
            const osInfo = `🖥️ *OS*: ${osType} ${osRelease}\n💻 *CPU*: ${osCPU}\n🧠 *Memory*: ${format(osMemory)}`;
            const responseMessage = `⏰ *Response Time*:
