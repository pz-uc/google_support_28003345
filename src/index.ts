import {PubSub} from '@google-cloud/pubsub';
import data from './data';

// FIXME: The name of YOUR topic
const PUBSUB_TOPIC = 'YOUR_TOPIC';


export const consentUpdatedEventHandler = async () => {
    let templateId: string = 'HkocEodjb7';
    let version: string = '52.10.27';

    try {
        const pubSub = new PubSub(
            // FIXME: Add your own credentials here!
        );

        const autoUpdateTopic = pubSub.topic(PUBSUB_TOPIC, {batching: {
            maxBytes: 5000000, // 5,000,000 ~> 5MB
            maxMessages: 250,
            maxMilliseconds: 100
        }});

        console.log(`Start Publishing ${data.length} messages...`);
        let start = new Date().getTime();
        const publishPromises: Promise<unknown>[] = [];
        for (const setting of data) {
            publishPromises.push(
                autoUpdateTopic
                    .publishMessage({json: {
                        templateId,
                        version,
                        settingsId: setting.settingsId
                    }})
            );
        }

        const results = await Promise.allSettled(publishPromises);
        let end = new Date().getTime();
        console.log(`All messages were published... took ${(end-start)/1000} seconds...`);
        results.forEach((result)=>{
            if(result.status === 'rejected') {
                console.error(`Error while publishing '${PUBSUB_TOPIC}': ${result.reason}`);
            }
        });

        // From official Docs:
        // "Immediately sends all remaining queued data. This is mostly useful if you are planning to call close()
        // on the PubSub object that holds the server connections."
        await autoUpdateTopic.flush();

        console.log(`Created ${publishPromises.length} PubSub Events for template ${templateId} ${version}  `);
    } catch (err) {
        console.error('Error with updating setting:', err);
    }
    return false;
};

consentUpdatedEventHandler();