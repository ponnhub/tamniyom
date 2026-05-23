const saCredentials = require('../tamniyombot65-eafd4-3001b99b196d.json')
const {
    Translate
} = require('@google-cloud/translate').v2;
const axios = require('axios');
const { assets } = require('../data/config/config');


class GoogleServices {

    constructor(user) {
        this.user = user
    }

    translate(text, {
            to, onlytext,
            textPayload
        }) {

        console.log(this.user);

        let self = this
        return new Promise(async function (resolve, reject) {
                // Creates a client
            const googleTranslate = new Translate({
                projectId: saCredentials.project_id, //eg my-project-0o0o0o0o'
                keyFilename: 'tamniyombot65-eafd4-3001b99b196d.json' //eg my-project-0fwewexyz.json
            });

            // Translates the text into the target language. "text" can be a string for
            // translating a single piece of text, or an array of strings for translating
            // multiple texts.

            var target = to || 'th';

            let detections;

            if (!to) await googleTranslate.detect(text).then(async (array) => {
                detections = Array.isArray(array) ? array : [array];
                // console.log('Detections:');

                Promise.all(detections.map(async (detection) => {
                    // console.log(`${detection.input} => ${detection.language}`);
                    // target = detection.language;
                    console.log(`target: ${target}`);
                    switch (detection.language) {
                        case 'th':
                            target = to || 'en';
                            break
                        default:
                            break;
                    }
                }));
                

            });

            let translations;
                googleTranslate.translate(text, target).then(async (array) => {
                    translations = Array.isArray(array) ? array : [array];
                    // console.log('Translations:');
                    // var translatedText = '';

                    Promise.all(translations.map(async (translation, i) => {
                        // console.log(`${text[i]} => (${target}) ${translation}`);
                        // t += `${text[i]} => (${target}) ${translation}`;
                        // translatedText += `${translation}`;
                    }));

                    if (onlytext) return resolve(translations[0])
                    const payload = {
                        type: 'text',
                        text: translations[0],
                        sender: {}
                    };

                    if (target) {
                        let lineProfile = self.user;
                        payload.sender = lineProfile ? {
                            name: lineProfile.displayName,
                            iconUrl: assets.flags_url[target]
                        } :
                        {
                            name: agent.name,
                            iconUrl: assets.flags_url[target]
                        }

                        if (textPayload) return resolve(payload) // OR with audio
                        await axios.post("https://sppsim.rtaf.mi.th/utilities/", {
                            text: translations[0],
                            target: target,
                            user: 'flexit'
                        }).then(function (response) {
                            let [url, duration] = response.data
                            let payloads = [payload]
                            // console.log(payloads);
                            if (url && duration) {
                                let audioPayload = {
                                    type: 'audio',
                                    originalContentUrl: url,
                                    duration: (1000 * duration).toFixed(0),
                                    sender: payload.sender
                                }
                                //   resolve(audioPayload)
                                payloads.push(audioPayload)

                            }
                            // console.log(payloads);
                            resolve(payloads);
                        })

                    } else {
                        resolve([]);
                    }
                }).catch(e => {
                    console.error(e)
                    reject(e)
                });

        })
    }

}
module.exports = GoogleServices