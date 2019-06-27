# Alexa example connector for Teneo
This node.js example connector makes a Teneo bot available on Amazon Alexa as a Skill. This guide will take you through the steps of deploying the connector to respond to events sent by Teneo.

## Prerequisites
### Amazon Developer account
Create an Amazon Developer Account [here](https://developer.amazon.com/alexa).

### Teneo Engine
Your bot needs to be published and you need to know the engine URL.

## Setup instructions
### Setup an Alexa Skill
1. Go to the [Amazon Developer Console](https://developer.amazon.com/alexa/console/ask) and create a new skill:
	* Click `Create Skill`
	* Select a `Custom` Skill type
	* Give you skill a name
	* Click `Create Skill` again
	* Next, select the `Start from scratch` template.
2. From the left menu, open the `JSON Editor` section, paste the JSON below. 
	!!! In the example JSON below we will call our bot 'Studio bot'. If you want to use a different name to invoke your bot, make sure you update the `invocationName` and the sample sentences for the `AMAZON.StopIntent`. You can do this after you have pasted the JSON below into the Amazon JSON Editor.

    ```
    {
        "interactionModel": {
            "languageModel": {
                "invocationName": "studio bot",
                "intents": [
                    {
                        "name": "AMAZON.FallbackIntent",
                        "samples": []
                    },
                    {
                        "name": "AMAZON.CancelIntent",
                        "samples": []
                    },
                    {
                        "name": "AMAZON.HelpIntent",
                        "samples": []
                    },
                    {
                        "name": "AMAZON.StopIntent",
                        "samples": [
                            "close studio bot",
                            "dismiss studio bot",
                            "shut down studio bot",
                            "goodbye studio bot",
                            "bye studio bot"
                        ]
                    },
                    {
                        "name": "teneointent",
                        "slots": [
                            {
                                "name": "RawInput",
                                "type": "LIST_OF_COMMANDS"
                            }
                        ],
                        "samples": [
                            "{RawInput}"
                        ]
                    },
                    {
                        "name": "AMAZON.NavigateHomeIntent",
                        "samples": []
                    }
                ],
                "types": [
                    {
                        "name": "LIST_OF_COMMANDS",
                        "values": [
                            {
                                "name": {
                                    "value": "Hello"
                                }
                            },
                            {
                                "name": {
                                    "value": "What is your name"
                                }
                            },
                            {
                                "name": {
                                    "value": "Where are you"
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
    ```
    This JSON represents the Interaction Model of this Alexa skill, and defines:  
    * The invocation name of our bot, which is used to redirects the conversation away from Alexa to your Teneo bot when the user says something like "Alexa, launch Studio bot".
    * The phrases that trigger the StopIntent, which dismisses your bot, and steers the conversation back to Alexa.
    * The way in which the user input is captured, to be later relayed to your Teneo bot.
 
3. Click `Save Model`, and then `Build Model` to build and update Alexa's Interaction model.

### Run the connector
Before continuing setting up things on Alexa's Developer Console side, get the connector code running locally:

1. Download or clone the connector source code:
    ```
    git clone https://github.com/artificialsolutions/tie-api-example-alexa.git
    ```
2. Install dependencies by running the following command in the folder where you stored the source:
    ```
    npm install
    ``` 
3. Create a `.env` file in the folder where you stored the source, and add values for HTTP_API_TOKEN:
    ```
    TENEO_ENGINE_URL=<your_engine_url>
    ```
4. Start the connector in Console:
    ```
    node server.js
    ```
    
Next, we need to make the connector available via https. We'll use [ngrok](https://ngrok.com) for this.

1. Start ngrok. The connector runs on port 8080 by default, so we need to start ngrok like this:
    ```
    ngrok http 8080
    ```
2. Running the command above will display a public https URL. Copy it, we will use it as a `Service Endpoint URL` in the next steps ahead.


### Add the endpoint URL to your skill.
1. Go back to the [Developer Console](https://developer.amazon.com/alexa/console/ask).
2. Click `Endpoint` from the left menu.
3. Select a `HTTPS` service endpoint type, and paste the public URL from ngrok obtained earlier in the `Default Region` field. 
4. From the `Select SSL certificate type` dropdown, select `My developement endpoint is a sub-domain ... that has a wildcard certificate from a certificate authority`.
5. Click on Save endpoints.

That's it! You're now ready to talk to your Alexa bot.

### Start talking to your bot
1. In the top menu, click Test to begin chatting to the bot. At first, the conversation takes place with Alexa. To begin talking with your Teneo bot, say something like "_Alexa, launch studio bot_". Your Teneo bot should then greet you, and take over the conversation. 
2. To end a conversation with your bot and go back to talking to Alexa, say something like "_Goodbye studio bot_". You will now be talking to Alexa again.

