const superagent = require('superagent');
const constants = require('../constants/');
const config = require('../config/');

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
        .send(event)
        .set('Content-Type', 'application/json')
        .then(res => {
            // res.body, res.headers, res.status
            arr = localdb.get('events').value();
            arr.forEach(element => {
                console.log(">>>>>>>>",element);
                superagent.post(url + '/logging/' + 'error')
                .retry(2)
                .send(element)
                .set('Content-Type', 'application/json')
                .then(res => {
                    /*
                    localdb.get('events')
                    .remove({ id: element.id })
                    .write()
                    */
                })

            });
         })
         .catch(err => {
            // err.message, err.response
            //event.category = eventType;
            //event.id = event.message+'_'+event.timestamp;
            localdb.get('events')
            .push(event)
            .write();
         });
};

module.exports = request;

