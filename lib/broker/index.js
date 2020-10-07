const constants = require('../constants/');
const capturedLogs = require('../logs/');
const snippets = require('../snippets/');
const request = require('../request/');
const metrics = require('../metrics');
const config = require('../config/');
const utils = require('../utils/');

/**
 * Registers and sends an error.
 * @param message {string} error message
 * @param stack {string} stacktrace of the error
 * @param constructor {object} constructor of the error object
 * @param onTheFlyBadges {object} dynamically added badges if the error was emitted manually
 */
const error = async ({ message, stack, constructor }, onTheFlyBadges = {}) => {
    try {
        if (!stack || !config.isSetup()) {
            return;
        }
        
        message = message.length >= 1000 ? message.slice(0, 995) + '...' : message;
        stack = stack.length >= 15000 ? stack.slice(0, 14995) + '...' : stack;
        
        const ticket = config.get().ticket;
        const badges = config.get().badges;
        const logs = capturedLogs.get();
        const machineMetrics = metrics.load();
        const { path, line } = utils.extractStacktrace(stack);
        const snippet = snippets.getSnippet(path, line);
        const timestamp = utils.timestamp.generateUTCInSeconds();
        
        const event = {
            ticket,
            message,
            badges: { ...badges, ...onTheFlyBadges },
            stacktrace: stack,
            adapter: constants.adapter,
            type: (constructor && constructor.name) || 'error',
            metrics: machineMetrics,
            logs,
            snippet,
            path,
            line,
            timestamp
        };
        
        await request(event, 'error');
        
    } catch (error) {
        console.error(constants.colors.red + 'Failed to register Acteam Log event with error:\n\n' + error + constants.colors.reset);
    }
};

module.exports = { error };