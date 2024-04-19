import fetch from "node-fetch";
import crypto from "crypto";

// Handler function for the wordle command
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    // Extract the text from the arguments or quoted message
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else {
        throw "Input Teks"
    }

    // Reply to the user with a loading message
    await m.reply(wait)

    try {
        // Call the gptWordle function with the extracted text
        let res = await gptWordle(text)
        // Reply to the user with the response message
        await m.reply(res.message.content)
    } catch (e) {
        // If there is an error, reply with an error message
        await m.reply(eror)
    }
}
handler.help = ["wordle"]
handler.tags = ["gpt"];
handler.command = /^(wordle)$/i

// Export the handler function to be used as a command
export default handler

/* New Line */

// Function to generate a random IP address
const generateRandomIP = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

// Function to generate a random user agent string
const generateRandomUserAgent = () => {
    // Define arrays of Android versions, device models, and build versions
    const androidVersions = ['4.0.3', '4.1.1', '4.2.2', '4.3', '4.4', '5.0.2', '5.1', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0'];
    const deviceModels = ['M2004J19C', 'S2020X3', 'Xiaomi4S', 'RedmiNote9', 'SamsungS21', 'GooglePixel5'];
    const buildVersions = ['RP1A.200720.011', 'RP1A.210505.003', 'RP1A.210812.016', 'QKQ1.200114.002', 'RQ2A.210505.003'];

    // Select a random device model and build version
    const selectedModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
    const selectedBuild = buildVersions[Math.floor(Math.random() * buildVersions.length)];

    // Generate a random Chrome version
    const chromeVersion = `Chrome/${Math.floor(Math.random() * 80) + 1}.${Math.floor(Math.random() * 999) + 1}.${Math.floor(Math.random() * 9999) + 1}`;

    // Construct the user agent string
    const userAgent = `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;

    // Return the generated user agent string
    return userAgent;
};

// Function to fetch a response from the Wordle GPT API
const gptWordle = async (prompt) => {
    try {
        // Define the data to be sent in the API request
        const data = {
            user: crypto.randomBytes(8).toString('hex'),
            messages: [{
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: "Kamu adalah asisten AI yang siap membantu segala hal!"
                }
            ],
            subscriber: {
                originalAppUserId: `$RCAnonymousID:${crypto.randomBytes(16).toString('hex')}`,
                requestDate: new Date().toISOString(),
                firstSeen: new Date().toISOString(),
            }
        };

        // Send a POST request to the Wordle GPT API
        const response = await fetch("https://wewordle.org/gptapi/v1/web/turbo", {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'pragma': 'no-cache',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                "user-agent": generateRandomUserAgent(),
                "x-forwarded-for": generate
