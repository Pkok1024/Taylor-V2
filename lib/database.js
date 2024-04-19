import {
    resolve,
    dirname
} from 'path'
import fs from 'fs').promises

class Database {
    /**
     * Create new Database
     * @param {String} filepath Path to specified json database
     * @param  {...any} args JSON.stringify arguments
     */
    constructor(filepath, ...args) {
        this.file = resolve(filepath)
        this.logger = console

        this._load()

        this._jsonargs = args
        this._state = false
        this._queue = []
        this._interval = setInterval(async () => {
            if (!this._state && this._queue && this._queue[0]) {
                this._state = true
                try {
                    await this[this._queue.shift()]()
                } catch (error) {
                    this.logger.error(error)
                }
                this._state = false
            }
        }, 1000)

    }

    get data() {
        return this._data
    }

    set data(value) {
        this._data = value
        this.save()
    }

    /**
     * Queue Load
     */
    load() {
        this._queue.push('_load')
    }

    /**
     * Queue Save
     */
    save() {
        this._queue.push('_save')
    }

    async _load() {
        try {
            const stats = await fs.promises.stat(this.file)
            if (stats.isFile()) {
                const
