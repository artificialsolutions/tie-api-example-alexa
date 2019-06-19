# tie-api-example-alexa
This node.js example connector makes a Teneo bot available on Alexa as a Skill. The connector acts as middleware between Alexa and Teneo. This guide will take you through the steps of deploying the connector to respond to events sent by Teneo. 

## Prerequisites

### Amazon Developer account
Create an Amazon Developer Account [here](https://developer.amazon.com/alexa)

### Teneo Engine
Your bot needs to be published and you need to know the engine URL.

## Setup instructions
### Setup an Alexa Skill
1. Go to the [Developer Console](https://developer.amazon.com/alexa/console/ask), and click `Create Skill`. Select a "Custom" Skill type, give it a name, and click Create Skill. Next, select a `Start from scratch` template.

2. From the left pane menu, open the `JSON Editor` section, paste the JSON below. This JSON represents the Interaction Model of this Alexa skill. In this case it defines:
   * The invocation name of our Bot, a phrase that redirects the conversation away from Alexa, to your Teneo bot.
   * The phrases that trigger the StopIntent, which dismiss bot, and steers the conversation back to Alexa
   * The capture of raw user input that is later relayed to your Teneo bot.
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
3. Click Save Model, and then Create Model to build and activate the Alexa-User Interaction model.
