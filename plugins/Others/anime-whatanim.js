// Import necessary modules and functions
import uploadImage from "../../lib/uploadImage.js";
import fetch from "node-fetch";
import * as fs from "fs";

// Define the handler function for the whatanime command
const handler = async (m, {
    conn,
    usedPrefix
}) => {

