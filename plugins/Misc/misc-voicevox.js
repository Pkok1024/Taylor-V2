import {
    translate
} from '@vitalets/google-translate-api'
import fetch from 'node-fetch'

const defaultLang = 'ja'
const tld = 'cn'
const key = [
    "z-j740K-G86958S",
    "E96-39N92-3021i",
    "p_438_14M3y731P",
    "e1m_5-75427574p",
    "Y11_0_7-1_536-7",
    "X9F694A4Z278J5d",
    "v5y3b-8374f4467",
    "y4A5M8G566846_Y",
    "w3164-16562-7-8",
    "W6901_y9c1w8883",
    "y7c448852-39006",
]

let handler = async (m, {
    args,
    usedPrefix,
    text,
    command,
    quot,
}) => {


