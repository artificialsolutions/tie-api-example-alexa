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
	* Give you skill a name
	* Select a language from the dropdown
	* Leave model as Custom or select another if appropiate
	* Leave as Alexa-hosted
	* Click `Create Skill` at the upper right of page
	* Leave template as Hello World Skill, click Continue with Template at upper right of page – this will take a minute or so.
	* Click Interaction Model in the left menu.
	
2. Click Interaction Model in left menu then select the `JSON Editor` section, paste the JSON below. 
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
 
3. Click `Save Model` and then `Build Model` at the top of the page to build and update Alexa's Interaction model.  This will take about a minute. 

### Run the connector
Before continuing setting up things on Alexa's Developer Console side, get the connector code running using one of the two available ways described ahead:

The first way is by [running the connector on Heroku](#running-the-connector-on-heroku). This is the easiest to get the connector running for non-developers since it does not require you to run node.js or download or modify any code.

The second way is to [run the connector locally](#running-the-connector-locally) or to deploy it on a server of your choice. This preferred if you're familiar with node.js development and want to have a closer look at the code and plan to enhance or modify it.

#### Running the connector on Heroku
Click the button below to deploy the connector to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg?classes=heroku)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/tie-api-example-alexa/)

In the 'Config Vars' section, add the following:
* **TENEO_ENGINE_URL:** The engine url of your bot

When deployment completes, click 'View App' to visualize the URL of the newly created app in a new browser tab. This tab will not work by itself, so just copy its URL and we will use it as a `Service Endpoint URL` in the next steps ahead.

#### Running the connector locally
If you want to run the connector locally, follow the steps below. If you have already followed the instructions above to deploy the connector on Heroku, you can skip this section and continuing setup on [Alexa Developer Console](#add-the-endpoint-url-to-your-skill).
1. Download or clone the connector source code:
    ```
    git clone https://github.com/artificialsolutions/tie-api-example-alexa.git
    ```
2. Install dependencies by running the following command in the folder where you stored the source:
    ```
    npm install
    ``` 
3. Create a `.env` file in the folder where you stored the source, and add the Teneo engine url:
    ```
    TENEO_ENGINE_URL=<your_engine_url>
    ```
4. Start the connector in Console:
    ```
    node server.js
    ```
    
Next, we need to make the connector available via https. We'll use [ngrok](https://ngrok.com) for this.

1. Start ngrok. The connector runs on port 3467 by default, so we need to start ngrok like this:
    ```
    ngrok http 3467
    ```
2. Running the command above will display a public https URL. Copy it, we will use it as a `Service Endpoint URL` in the next steps ahead.


### Add the endpoint URL to your skill
1. Go back to the [Developer Console](https://developer.amazon.com/alexa/console/ask) and select your skill.
2. Click `Endpoint` from the left menu.
3. Select a `HTTPS` service endpoint type, and paste the public URL from ngrok obtained earlier in the `Default Region` field. Make sure this URL does not end in a slash character '/'.
4. From the `Select SSL certificate type` dropdown, select `My developement endpoint is a sub-domain ... that has a wildcard certificate from a certificate authority`.
5. Click on Save endpoints.
6. Click on the Left Side menu > JSON Editor > Build Model to update the changes.

That's it! You're now ready to talk to your Alexa bot.

### Start talking to your bot
1. In the top menu, click Test to begin chatting to the bot. At first, the conversation takes place with Alexa. To begin talking with your Teneo bot, say something like "_Alexa, launch studio bot_". Your Teneo bot should then greet you, and take over the conversation. 
2. To end a conversation with your bot and go back to talking to Alexa, say something like "_Goodbye studio bot_". You will now be talking to Alexa again.

## Engine input parameters
The following input parameters are included in requests to Engine.

### channel
In addition to the input entered by the user, requests to the Teneo Engine also contain an input paramter 'channel' with value 'amazon-alexa'. This allows you to change the behavior of your bot, depending on the channel used. For information on how to retrieve the value of an input parameter in Teneo Studio, see [Store input parameters](https://www.teneo.ai/studio/scripting/how-to/store-input-parameters) on the Teneo Developers website.

