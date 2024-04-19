// Import required modules
import {
    cpus as _cpus, // Import cpus function from 'os' module and alias it as _cpus
    totalmem, // Import totalmem function from 'os' module
    freemem
} from 'os'
import util from 'util' // Import util module
import {
    performance
} from 'perf_hooks' // Import performance module from 'perf_hooks'
import {
    sizeFormatter
} from 'human-readable' // Import sizeFormatter function from 'human-readable' module
import {
    join
} from 'path' // Import join function from 'path' module
import {
    promises
} from 'fs' // Import promises object from 'fs' module
import moment from 'moment-timezone' // Import moment-timezone module

// Define some variables
const more = String.fromCharCode(8206) // Create a string containing the U+200B character (zero-width space)
const readMore = more.repeat(4001) // Create a string containing 4001 instances of the U+200B character
let format = sizeFormatter({ // Create a sizeFormatter object with some options
    std: 'JEDEC', // Use JEDEC standard for formatting
    decimalPlaces: 2, // Use 2 decimal places
    keepTrailingZeroes: false, // Don't keep trailing zeroes
    render: (literal, symbol) => `${literal} ${symbol}B`, // Use a custom function to render the output
})

// Define the handler function
let handler = async (m, { // Define the handler function with two parameters: m (the message object) and options (an object containing various options)
    conn, // The bot's connection object
    usedPrefix, // The prefix used to call the command
    __dirname, // The name of the directory containing the current file
    text, // The text of the message
    command // The name of the command
}) => {
    // Define some variables
    let date = moment.tz('Asia/Jakarta').format("dddd, Do MMMM, YYYY") // Get the current date and time in Jakarta time zone
    let time = moment.tz('Asia/Jakarta').format('HH:mm:ss') // Get the current time in Jakarta time zone
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {} // Read the package.json file and parse it as JSON
    let _uptime = process.uptime() * 1000 // Get the uptime of the process in milliseconds
    let uptime = clockString(_uptime) // Format the uptime using the clockString function
    let totalreg = Object.keys(global.db.data.users).length // Get the total number of registered users
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length // Get the number of registered users
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats) // Get an array of all chats
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) // Get an array of all groups
    const used = process.memoryUsage() // Get the memory usage of the process
    const cpus = _cpus().map(cpu => { // Get an array of all CPUs and map it to a new array
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0) // Calculate the total CPU time
        return cpu // Return the modified CPU object
    })
    const cpu = cpus.reduce((last, cpu, _, { // Reduce the array of CPUs to a single object
        length
    }) => {
        last.total += cpu.total // Add the total CPU time
        last.speed += cpu.speed / length // Calculate the average CPU speed
        last.times.user += cpu.times.user // Add the user CPU time
        last.times.nice += cpu.times.nice // Add the nice CPU time
        last.times.sys += cpu.times.sys // Add the system CPU time
        last.times.idle += cpu.times.idle // Add the idle CPU time
        last.times.irq += cpu.times.irq // Add the IRQ CPU time
        return last // Return the modified object
    }, { // Initialize the object with some properties
        speed: 0, // Initialize the speed property
        total: 0, // Initialize the total property
        times: { // Initialize the times object
            user: 0, // Initialize the user property
            nice: 0, // Initialize the nice property
            sys: 0, // Initialize the sys property
            idle: 0, // Initialize the idle property
            irq: 0 // Initialize the irq property
        }
    })
    let old = performance.now() // Get the current time in milliseconds
    let neww = performance.now() // Get the current time in milliseconds
    let speed = neww - old // Calculate the elapsed time

    // Define the capti variable
    let capti = `🤖 ɴᴀᴍᴇ: ${_package.name}
🧩 ᴠᴇʀsɪᴏɴ: ${_package.version}
📚 ʟɪʙʀᴀʀʏ: ${_package.description}

⏳ ᴜᴩᴛɪᴍᴇ
