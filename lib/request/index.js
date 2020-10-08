const superagent = require('superagent');
const constants = require('../constants/');
const config = require('../config/');
var crypto = require('crypto');

/**
 * Encrypts data
 * @param {*} str 
 * @param {*} key 
 */
function encryptstring(str, key) {
    var cipher = crypto.createCipheriv('aes-256-cbc', key, 'TestingIV1234567'),
        encrypted = cipher.update(str, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

/**
 * Sends an event to the service.
 * @param event {object} the event that should be sent to the service.
 * @param eventType {string} the type of the event
 * @returns {*}
 */
const request = (event, eventType) => {
    const userConfig = config.get();
    
    let url = constants.connectivity.serviceURL;
    
    if (userConfig.endpoint) {
        url = userConfig.endpoint;
    }

    if (userConfig.localdb) {
        localdb = userConfig.localdb;
    }
   
    return superagent.post(url + '/logging/' + eventType)
        .retry(2)
        .send(encryptstring(JSON.stringify(event), userConfig.secret))
        .then(res => {
            arr = localdb.get('events').value();
            arr.forEach(element => {
                category = element.category;
                delete element['category'];
                superagent.post(url + '/logging/' + category)
                .retry(2)
                .send(encryptstring(JSON.stringify(element), userConfig.secret))
                .then(res => {
                    localdb.get('events')
                    .remove(element)
                    .write()
                })

            });
         })
         .catch(err => {
            event.category = eventType;
            localdb.get('events')
            .push(event)
            .write();
         });
};

module.exports = request;

