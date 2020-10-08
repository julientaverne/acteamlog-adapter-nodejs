const superagent = require('superagent');
const constants = require('../constants/');
const config = require('../config/');
var CryptoJS = require("crypto-js");

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

    
    //CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
    
    
    return superagent.post(url + '/logging/' + eventType)
        .retry(2)
        .send(CryptoJS.AES.encrypt(JSON.stringify(event), userConfig.secret).toString())
        //.set('Content-Type', 'application/json')
        .then(res => {
            // res.body, res.headers, res.status
            arr = localdb.get('events').value();
            arr.forEach(element => {
                category = element.category;
                delete element['category'];
                superagent.post(url + '/logging/' + category)
                .retry(2)
                .send(CryptoJS.AES.encrypt(JSON.stringify(element), userConfig.secret).toString())
                //.set('Content-Type', 'application/json')
                .then(res => {
                    localdb.get('events')
                    .remove(element)
                    .write()
                })

            });
         })
         .catch(err => {
            // err.message, err.response
            event.category = eventType;
            localdb.get('events')
            .push(event)
            .write();
         });
};

module.exports = request;

