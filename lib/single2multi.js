import fs from 'fs'
import path from 'path'
import store from './store-multi.js'

/**
 * Import the Baileys library and destructure the BufferJSON object from it.
 * @type {import('@whiskeysockets/baileys').BufferJSON}
 */
var { BufferJSON } = (await import('@whiskeysockets/baileys')).default

/**
 * The single2multi function takes in three parameters:
 * 1. fileSingle: A string representing the file path of the single file auth state.
 * 2. folderMulti: A string representing the folder path to store the multi-file auth state.
 * 3. authState: An instance of the MultiFileAuthStateStore class.
 * @param {string} fileSingle
 * @param {string} folderMulti
 * @param {Awaited<ReturnType<import('./store').MultiFileAuthStateStore>>} authState
 */
export default async function single2multi(fileSingle, folderMulti, authState) {
    // Read the contents of the single file auth state and parse it as JSON.
    var authSingleResult = JSON.parse(await fs.promises.readFile(fileSingle, 'utf8'), BufferJSON.reviver)

    // Extract the credentials and keys from the parsed JSON.
    var authSingleCreds = authSingleResult.creds || {}
    var authSingleKeys = authSingleResult.keys || {}

    // Define a helper function to write data to a file.
    var writeData = (data, file) => {
        return fs.promises.writeFile(path.join(folderMulti, store.fixFileName(file)), JSON.stringify(data, store.JSONreplacer))
    }

    // Define a helper function to find the key by its value.
    var getKeyByValue = (obj, value) => {
        return Object.keys(obj).find(key => obj[key] === value)
    }

    // Map the keys from the single file auth state to the format expected by the multi-file auth state.
    var keys = Object.fromEntries(Object.entries(authSingleKeys).map((
