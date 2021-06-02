# google_support_28003345

Demo application to verify suspicious behaviour of the google cloud PubSub Node.js Client.


## How to start

1. Change the `PUBSUB_TOPIC` in the `index.ts` to match the one from your GCP project
1. Make sure your default account is allowed to publish PubSub messages or provide some credentials in the `PubSub` constructor in `index.ts`
1. Build and run the app via `npm run demo`