import { spawn } from 'child_process'
import { join } from 'path'

const __dirname = (global.__dirname || (() => {
  const callerFile = (new Error()).stack.match(/(\w+\.js):\d+:\d+/)[1];
  return join(__dirname, '..', callerFile.split('/').slice(0, -1).join('/'));
})())(import.meta.url);

/**
 * Levelup image
 * @param {String} teks 
 * @param {Number} level 
 * @returns {Promise<Buffer>}
 */
export async function levelup(teks, level) {
  if (level < 1 || !Number.isInteger(level)) {
    throw new Error('Invalid level parameter');
  }

  const font = join(__dirname, '../src/font');
  const fontLevel = join(font, './level_c.otf');
  const fontTexts = join(font, './texts.otf');
  const xtsx = join(__dirname, '../src/lvlup_template.jpg');
  let anotations = '+1385+260';

  if (level > 2) anotations = '+1370+260';
  if (level > 10) anotations = '+1330+260';
  if (level > 50) anotations = '+1310+260';
  if (level > 100) anotations = '+1260+260';

  const [spawnprocess, ...spawnargs] = (global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : [])
    .concat(['convert', xtsx, '-font', fontTexts, '-fill', '#0F3E6A', '-size', '1024x784', '-pointsize', '68', '-interline-spacing', '-7.5'])
    .concat(`-annotate ${'+153+200} ${teks}`)
    .concat(['-font', fontLevel, '-fill', '#0A2A48', '-size', '1024x784', '-pointsize', '140', '-interline-spacing', '-1.2'])
    .concat(`-annotate ${anotations} ${level}`)
    .concat(['-append', 'jpg:-']);

  return new Promise((resolve, reject) => {
    if (!(global.support.convert || global.support.magick || global.support.gm)) {
      return reject('Not Support!');
    }

    const bufs = [];
    const subprocess = spawn(spawnprocess, spawnargs, { encoding: 'buffer' });

    subprocess.on('error', reject);
   
