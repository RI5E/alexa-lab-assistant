"use strict";
var APP_ID = undefined;

var tables = {"DIRECTIONS" : [
        "Step 0.",
        "Step 1.",
        "Step 2.",
        "Step 3.",
        "Step 4."
    ],
    "MATERIALS" : [
        "Scale",
        "Chemical",
        "Pipet",
        "Barometer",
        "Gloves",
        "Goggles"]
};

var languageString = {
    "en-US": {
        "translation": {
            "DIRECTIONS" : tables["DIRECTIONS"],
            "MATERIALS" : tables["MATERIALS"],
            "LAB_NAME" : "Chemistry Lab", // Be sure to change this for your skill.
            "NEW_LAB_MESSAGE": "Welcome to %s. ",
            "START_UNHANDLED": "Say start to start the Lab.",
            "WELCOME_MESSAGE": "This lab has %s steps. Request lab materials to get started.",
            "NUM_STEPS": "9",
            "STOP_MESSAGE": "Would you like to continue the lab?",
            "CANCEL_MESSAGE": "Ok, let\'s resume later.",
            "SYNOPSIS": "This is the first chemistry lab. In this lab we will be getting so so wet for papa d. mmmmmmmmmm so wet for papa d. Look at how drenched I am from papa d.",
            "MATERIALS_MESSAGE": ["I will list the materials now. ", "Here is your first material. ", "Ready or Not. Here I come. ", " I\'ll list your materials. ",
                                    "Material and Materialism is bad. But ok. ", "Ok. First get "],
            "NEXT_MATERIAL": ["Say next material once ready. ", "Request your next material whenever you are ready. ", "When you\'re ready, ask for next item.",
                                "No rush. Let me know when you want the next item. ", "Tell me when you want your next material", "Got it? Request next item when you want."],
            "LAST_MATERIAL": "Those are all of the materials.",
            "START_SYNOPSIS": ["Once upon a time. Nevermind. ", "Summarizing now. ", "Okay. Here goes. ", "Here is your synopsis. ", "Listen up. ", "Prepare to be enlightened. "],
            "START_DIRECTIONS": ["Okay. Let's begin. ", "Sure. I\'ll give you the first step. ", "Here is the first step", "Here we go. ", "Lab begins now. "],
            "TAIL_DIRECTIONS": [" Once ready, request the next step or ask for repeat.", " The next step is available for you. If you need instructions again, request a repeat.", " If you need that repeated, tell me. If not, request the next step when ready."],
            
            "HELP_MESSAGE": "I will ask you %s multiple choice questions. Respond with the number of the answer. " +
            "For example, say one, two, three, or four. To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last question, say, repeat. ",
            "ASK_MESSAGE_START": "Would you like to start playing?",
            "HELP_REPROMPT": "To give an answer to a question, respond with the number of the answer. ",
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!",
            "TRIVIA_UNHANDLED": "Try saying a number between 1 and %s",
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct answer is %s: %s. ",
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "Question %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s questions correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "Your score is %s. "

        }
    }
};

var Alexa = require("alexa-sdk");
var APP_ID = undefined;

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var step = 0;
var start = true;
var startDir = true;
var directionStep = 0;
var handlers = {
    'ListMaterials': function() {
        this.emit('GetMaterials');
    },
    'GetMaterials': function() {
        const matArr = this.t('MATERIALS');
        var indSt = Math.floor(Math.random() * this.t('MATERIALS_MESSAGE').length);
        var speechOutput = start ? this.t('MATERIALS_MESSAGE')[indSt] + (matArr[step] + ". "): (matArr[step] + ". ");
        var last = (step == matArr.length-1);
        var indMat = Math.floor(Math.random() * this.t('NEXT_MATERIAL').length);
        speechOutput = last ? speechOutput + this.t('LAST_MATERIAL') : speechOutput + this.t('NEXT_MATERIAL')[indMat];
        this.emit(':tell', speechOutput);
    },
    'NextMaterial': function() {
        start = false;
        const len = this.t('MATERIALS').length-1;
        if (step == len){
            this.emit('LastMaterial');
        } else {
            step += 1;
            this.emit('GetMaterials');
        }
    },
    'LastMaterial': function() {
        var speechOutput = 'That was all of the lab materials.';
        this.emit(':tell', speechOutput);
    },
    'GetSynopsis': function() {
        var indSt = Math.floor(Math.random() * this.t('START_SYNOPSIS').length);
        var speechOutput = this.t('SYNOPSIS');
        speechOutput = this.t('START_SYNOPSIS')[indSt] + speechOutput;
        this.emit(':tell', speechOutput);
    },
    'GetDirections': function() {
        this.emit('GetDir');
    },
    'GetDir': function() {
        const stepArr = this.t('DIRECTIONS');
        var s = Math.floor(Math.random() * this.t('START_DIRECTIONS').length);
        var tl = Math.floor(Math.random() * this.t('TAIL_DIRECTIONS').length);
        var last = (directionStep == stepArr.length);
        var speechOutput = startDir ? this.t('START_DIRECTIONS')[s] + stepArr[directionStep] : stepArr[directionStep];
        speechOutput = last ? speechOutput + " That was the last of the directions." : speechOutput + this.t('TAIL_DIRECTIONS')[tl];
        this.emit(':tell', speechOutput);
    },
    'NextStep': function() {
        startDir = false;
        const len = this.t('DIRECTIONS').length -1;
        if (directionStep == len){
            this.emit('LastDirection');
        } else {
            directionStep += 1;
            this.emit('GetDir');
        }
    },
    'LastDirection': function() {
        var speechOutput = 'That is the last of the steps';
        this.emit(':tell', speechOutput);
    },
    
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },

};
