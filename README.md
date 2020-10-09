npmrc acteamit
npm publish --access public

# NodeJS Adapter
The NodeJS adapter tracks errors in your NodeJS application and reports them to the ACTEAMLOG service. Precise details help you tracking down and fixing the root cause.

## Usage
Install the adapter with ```npm i @acteam-it/log-adapter-nodejs --save```
```node
const acteamlog = require('@acteam-it/log-adapter-nodejs');**
```

## Configuration
Require the adapter at the top of your server and pass the configuration to the **init** function. The following options are available.

### Ticket
The ticket is the only mandatory information. Each service has an unique ticket and all events sent with this ticket will be attached to the corresponding service.
```node
const acteamlog = require('@acteam-it/log-adapter-nodejs');

acteamlog.init({ ticket: '5BD98E1E607Z1EEB0CBF02374DEA9B5A835DF2ADD3910F7250'});
```

### Badges
Badges contain individual information that will be attached to the reported error. A badge must be of type string. The key of the badge can have up to 100 characters while the value can have up to 200 characters. If these limits are exceeded, the event will not be processed.
```node 
acteamlog.init({
    ticket: '5BD98E1E607Z1EEB0CBF02374DEA9B5A835DF2ADD3910F7250',
    badges: {
        cluster: 'EU',
        serverId: process.env.SERVER_ID
    }
});
```

### Endpoint
Set the ```endpoint``` property to connect to your individual ACTEAMLOG instance at a given address. Please notice that the ```endpoint``` property will be preferred to the ```instance``` property.
```node
acteamlog.init({
  acteamlog: 'http://url:port',
  ticket: '5BD98E1E607Z1EEB0CBF02374DEA9B5A835DF2ADD3910F7250'
});
```

## Verifying setup
To test if everything works you can just try to execute an undefined function like so.
```node
acteamlog.init({
  instance: 'demo',
  ticket: '5BD98E1E607Z1EEB0CBF02374DEA9B5A835DF2ADD3910F7250'
});

test();
```

## Middleware
If you are using Express, you can also add the ACTEAMLOG middleware at the end of your routes.
```node
app.use(acteamlog.errorHandler);
```
The middleware will send all errors to ACTEAMLOG before passing them to the next middleware.

## Emit errors manually
You can also emit errors manually by passing an error instance to the ```emitError``` method. This is handy for building your own error handling logic.
```node
try {
    const result = 10 * number;
} catch (error) {
    acteamlog.emitError(error);
}
```
### On the fly badges
You can also add dynamic badges to a specific error if you want to provide additional information. This can be useful if you, for example, want to identify the user, who is affected by the error.
```node
try {
    const result = 10 * number;
} catch (error) {
    acteamlog.emitError(error, { user: req.user.id });
}
```
