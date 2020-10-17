## Status

~WIP

This package is a wrapper around KAS Console V1.0 API. It can be used to help with building your own integrations.

Package is not generally available yet.

If you would like to see it come alive, contact the repo author with a 'YES'!

## Example Usage

```js
const { KASApi } = require('kas-lock');

const kas = new KASApi({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
});

const run = async () => {
  await kas.remoteUnlock('SS00001');
  await kas.setClock('SS00001');
  await kas.addPassword('SS00001', '123456', { startDate: new Date(), endDate: new Date() });
};

run();
```

## Setup

- See kas.com.au
- See console.kas.com.au
- See https://apps.apple.com/au/app/kas-cloud-app/id1451573269
- See https://play.google.com/store/apps/details?id=au.com.kas.lock_app&hl=en_AU
- See https://support.kas.com.au/portal/en-gb/kb/articles/api-doc-console-kas#Change_Log
- See https://support.kas.com.au/portal/en-gb/kb/kas/mobile-app
