/**
 * Copyright 2019 Artificial Solutions. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const bodyParser = require('body-parser')
const TIE = require('@artificialsolutions/tie-api-client');

const dotenv = require('dotenv');
dotenv.config();
const {
  TENEO_ENGINE_URL,
} = process.env;
if (!TENEO_ENGINE_URL) {
   throw new Error('Missing environment variable TENEO_ENGINE_URL!');
 }



const app = express();
app.use(bodyParser.urlencoded({
   extended: true
}))
app.use(bodyParser.json())


//Create Teneo API interface
const teneoApi = TIE.init(TENEO_ENGINE_URL);


// initialise session handler, to store mapping between Alexa and engine session id
const sessionHandler = SessionHandler();

// Builds a JSON formatted response for Alexa. Contains an output text and possibly, a flag to close the bot session within Alexa.
function buildAlexaResponse(outputText, shouldEndSession){

   var outputSpeechValue = {}
   if (!(typeof outputText == 'undefined' || !outputText || outputText.length === 0 || outputText === "" || !/[^\s]/.test(outputText) || /^\s*$/.test(outputText) || outputText.replace(/\s/g,"") === "")){
      //construct json if the outputText is a valid string
      outputSpeechValue = {
         type: 'SSML',
         text: outputText,
         ssml: '<speak>' + outputText + '</speak>'
      }
   }

   const alexaResponse = {
      version: '1.0',
      response: {
         shouldEndSession: shouldEndSession,
         outputSpeech: outputSpeechValue
      }
   }

   return alexaResponse
}



// Register a webhook handler with the connector
app.post('/', async function(req, res) {

      if (req.body.request.type == "SessionEndedRequest") {
         //Close Teneo's session within Alexa's conversation, and erase the session ID.
         sessionHandler.setSession(req.body.session.sessionId, "")
         res.send(buildAlexaResponse("",true)); //send true to end session 
      }

      var teneoResponseText = ""
      if (req.body.request.type == "LaunchRequest") {
         //Handle a launch request to our Teneo bot by saying "hello"
         teneoResponseText = await handleAlexaMessage("hello", "") //greeting
         res.send(buildAlexaResponse(teneoResponseText,false)) 
      }

      if (req.body.request.type == "IntentRequest") {
         const intentName = req.body.request.intent.name
         const alexaSessionID = req.body.session.sessionId

         if (intentName == "teneointent") {
            //Fetch the exact user input from the RawInput Slot
            const userInput = req.body.request.intent.slots.RawInput.value
            teneoResponseText = await handleAlexaMessage(userInput, alexaSessionID)

            console.log(`Teneo response:\n ${teneoResponseText}`)

            //Build a response to Rrlay Teneo's reply to Alexa
            res.send(buildAlexaResponse(teneoResponseText,false))
         }

         //React to intents that signal an end of session for a Teneo bot within Alexa
         if ((intentName == "AMAZON.CancelIntent") || (intentName == "AMAZON.StopIntent")) {
            //Say farewell to Teneo bot
            teneoResponseText = await handleAlexaMessage("bye", alexaSessionID)
            //Tell Alexa to close session with Teneo bot (end session parameter = true)
            res.send(buildAlexaResponse(teneoResponseText,true))
            //Wipe out Teneo session
            sessionHandler.setSession(req.body.session.sessionId, "")
         }
      }
});


async function handleAlexaMessage(alexaMessage, userID) {

   // check if there's an engine sessionid for this caller
   const teneoSessionId = sessionHandler.getSession(userID);

   // send input to engine using stored sessionid and retreive response
   const teneoResponse = await teneoApi.sendInput(teneoSessionId, {
      'text': alexaMessage,
      'channel':'amazon-alexa'
   });
   
   teneoTextReply = teneoResponse.output.text
   console.log(`teneoResponse: ${teneoTextReply}`)

   // store engine sessionid for this caller
   sessionHandler.setSession(userID, teneoResponse.sessionId);

   return teneoTextReply
}

const port = process.env.PORT || 3467;
app.listen(port, () => console.log(`Teneo-Alexa connector listening on port ${port}, ENDPOINT: ${TENEO_ENGINE_URL}`))

/***
 * SESSION HANDLER
 ***/
function SessionHandler() {

   // Map Alexa's SID to Teneo engine's session id. 
   // This code keeps the map in memory, which is ok for testing purposes
   // For production usage it is advised to make use of more resilient storage mechanisms like redis
   const sessionMap = new Map();

   return {
      getSession: (userId) => {
         if (sessionMap.size > 0) {
            return sessionMap.get(userId);
         } else {
            return "";
         }
      },
      setSession: (userId, sessionId) => {
         sessionMap.set(userId, sessionId)
      }
   };
}
