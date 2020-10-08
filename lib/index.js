const eventListeners = require('./eventListeners/');
const interceptors = require('./interceptors/');
const middlewares = require('./middlewares');
const constants = require('./constants/');
const config = require('./config/');
const broker = require('./broker');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

/**
 * Initializes the adapter with the user provided configuration.
 * @param conf {object} provided configuration
 */
const init = (conf) => {
    const isValid = config.set(conf);
    
    if (isValid) {
        eventListeners.enableAll();
        interceptors.enableAll();

        if (conf.dbfile) {
            const adapter = new FileSync(conf.dbfile);
            const db = low(adapter);
            conf.localdb = db;
            db.defaults({ events: [] }).write();
            config.set(conf);
        }
        
        if (!conf.secret){
            conf.secret="NFd6N3v1nbL47FK0xpZjxZ7NY4fYpNYd";
        }

    } else {
        console.error(constants.colors.red + 'The provided ACTEAM LOG configuration is invalid.' + constants.colors.reset);
    }
};

const emitError = (error, onTheFlyBadges = {}) => {
    if (!error || !(error instanceof Error)) {
        console.error('[ACTEAM LOG] the provided error must be an instance of Error');
        return;
    }
    
    if (typeof onTheFlyBadges !== 'object' || Array.isArray(onTheFlyBadges)) {
        console.error('[ACTEAM LOG] on the fly badges must be an object');
        return;
    }
    
    if (Object.keys(onTheFlyBadges || {}).some(b => typeof onTheFlyBadges[b] !== 'string')) {
        console.error('[ACTEAM LOG] on the fly badges need to be an object of strings');
        return;
    }
    
    broker.error(error, onTheFlyBadges);
};

module.exports = { init, errorHandler: middlewares.errorHandler, emitError };