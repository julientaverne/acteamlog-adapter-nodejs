npmrc acteamit
npm publish --access public

# NodeJS Adapter
The NodeJS adapter tracks errors in your NodeJS application and reports them to the ACTEEM LOG service. Precise details help you tracking down and fixing the root cause.

## Usage
Install the adapter with ```npm i @acteam-it/log-adapter-nodejs --save```
```node
const acteamlog = require('@acteam-it/log-adapter-nodejs');**
```

## Configuration
Require the adapter at the top of your server and pass the configuration to the **init** function. The following options are available.

### Ticket
The ticket is the only mandatory information. Each service has an unique ticket and all events sent with this ticket will be attached to the corresponding service.

acteamlog.init({
  endpoint: 'http://localhost:1590',
  sendAnalytics: true,
  ticket: '5BD98E1E607B1EEB0CBF92374DEA9A52835DF2ADD3910F7250',
  dbfile: 'db.json'
});