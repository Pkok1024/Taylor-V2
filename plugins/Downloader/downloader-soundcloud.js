const CLIENT_ID = 'zZeR6I5DM5NMAYEhk7J9vveMqZzpCIym';
import soundcloud from 'soundcloud-downloader';
import fetch from 'node-fetch';
import util from 'util';
import { getBuffer } from '../lib/myFunc.js';

const handler = async (m, {
    conn,
    args,

