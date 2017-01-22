'use strict';
//var APP_ID = undefined;
var request = require('request');
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

var dataTable = [];
var rowLabels = [];
var colLabels = [];

var languageString = {
    "en-US": {
        "translation": {
            "LABS": ["Titration Lab", "Thermodynamics Lab", "Poop Lab"],
            "DIRECTIONS" : tables["DIRECTIONS"],
            "MATERIALS" : tables["MATERIALS"],
            "LAB_NAME" : "Chemistry Lab", // Be sure to change this for your skill.
            "NEW_LAB_MESSAGE": "Welcome to %s. ",
            "START_UNHANDLED": "Sounds good. Starting ",
            "WELCOME_MESSAGE": "This lab has %s steps. Request lab materials to get started.",
            "NUM_STEPS": "9",
            "STOP_MESSAGE": "Would you like to continue the lab?",
            "CANCEL_MESSAGE": "Ok, let\'s resume later.",
            //"SYNOPSIS": "This is the first chemistry lab. In this lab we will be getting so so wet for papa d. mmmmmmmmmm so wet for papa d. Look at how drenched I am from papa d.",
            "SYNOPSIS": "Today, you will discover the miracles of poop.",
            "MATERIALS_MESSAGE": ["I will list the materials now. ", "Here is your first material. ", "Ready or Not. Here I come. ", " I\'ll list your materials. ",
                                    "Material and Materialism is bad. But ok. ", "Ok. First get "],
            "NEXT_MATERIAL": ["Say next material once ready. ", "Request your next material whenever you are ready. ", "When you\'re ready, ask for next item.",
                                "No rush. Let me know when you want the next item. ", "Tell me when you want your next material", "Got it? Request next item when you want."],
            "LAST_MATERIAL": "Those are all of the materials.",
            "START_SYNOPSIS": ["Once upon a time. Nevermind. ", "Summarizing now. ", "Okay. Here goes. ", "Here is your synopsis. ", "Listen up. ", "Prepare to be enlightened. "],
            "START_DIRECTIONS": ["Okay. Let's begin. ", "Sure. I\'ll give you the first step. ", "Here is the first step. ", "Here we go. ", "Lab begins now. "],
            "TAIL_DIRECTIONS": [" Once ready, say , next step, when you are ready to move on. Say , repeat, to repeat the current instruction.", " The next step is available for you. If you need instructions again, request a repeat.", " If you need that repeated, tell me. If not, request the next step when ready."],
            "REPEAT": [" Okay. Here it is again. ", " Listen carefully. ", " Okay, but don't forget this time. ", " Here you go. ", " Here. Again just for you. "],
            "CREATE TABLE": ["Sounds good. "],
            "COL_BEG": [" To start labeling the columns, say the words: column name. and then the name that you want.", " To begin column labeling, declare the words: column name, and then your desired name",
                        " Say the words: column name. Followed by the name you want for your column to begin the lableling."],
            "COL_END": [". The columns are all labeled.", ". We are done with the columns,", ". That's the last of the columns.", ". I've got all of the columns now."],
            "COL_ROW": [" To move onto rows, give us your first row label preceded by the words: row name.",
                        " Rows can be labeled by saying the words: row name. Followed by your row name.",
                        " Onto the rows. When ready, say: row name, followed by your desired result."],
            "ROW_END": [". We have labeled all of the rows.", " . The rows are done.", ". That's the last of the rows. ", ". All the rows are labled now."],
            "RECORD": [" Value Recorded.", " Got it.", " Got that down.", " Table updated.", " Data is in."],
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
var APP_ID = 'amzn1.ask.skill.5505c16f-a981-47e5-99c8-4357f92b342e';

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var step = 0;
var start = true;
var startDir = true;
var directionStep = 0;
var numCols = 0;
var numRows = 0;
var indCol = 0;
var indRow = 0;

var handlers = {
    'ListLabs': function() {
        var output = 'Here are your labs: ';
        const labs = this.t('LABS');
        for (var i = 0; i < labs.length; i++) {
            output += labs[i] + ', ';
        }
        this.emit(':tell', output);
    },
    'ListMaterials': function() {
        this.emit('GetMaterials');
    },
    'SelectLab': function() {
        var labName = this.event.request.intent.slots.LabName.value;
        var output = "Sounds good. Starting " + labName + ".";
        output += this.t['SYNOPSIS'] + '.';
        var moreOutput = " Say ,list materials, to get a list of the materials";
        output += moreOutput;
        this.emit(':tell', output);
        //this.emit('GetSynopsis');
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
        var speechOutput = 'That was all of the lab materials. Say ,begin instructions, when you are ready to start the lab';
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
        var speechOutput = 'Congratulations on completing the lab! It was a pleasure collabing with you.';
        this.emit(':tell', speechOutput);
    },
    'RepeatStep': function() {
        const stepArr = this.t('DIRECTIONS');
        var r = Math.floor(Math.random() * this.t('REPEAT').length);
        var tl = Math.floor(Math.random() * this.t('TAIL_DIRECTIONS').length);
        var speechOutput = this.t('REPEAT')[r] + stepArr[directionStep] + this.t('TAIL_DIRECTIONS')[tl];
        this.emit(':tell', speechOutput);
        
    },
    'CreateTable': function() {
        var x = Math.floor(Math.random() * 9)+1;
        var y = Math.floor(Math.random() * 9)+1;
        numCols = 0;
        numRows = 0;
        indCol = 0;
        indRow = 0;
        dataTable = [];
        rowLabels = [];
        colLabels = [];

        var speechOutput = "Give us the dimensions of your table. For example: " + x + " by " + y + ". Or "+ x + " columns by " + y +" rows.";
        this.emit(':tell', speechOutput);
        
    },
    'SetDimensions': function() {
        numCols = parseInt(this.event.request.intent.slots.Columns.value);
        numRows = parseInt(this.event.request.intent.slots.Rows.value);
        var speechOutput = "We have " + numCols + " columns and " + numRows + " rows.";
        var x = Math.floor(Math.random() * this.t('COL_BEG').length);
        speechOutput += this.t('COL_BEG')[x];
        this.emit(':tell', speechOutput);
        for (var i = 0; i < numRows; i++){
            var lst = [];
            for (var j = 0; j <= numCols; j++){
                lst.push(0);
            }
            dataTable.push(lst);
        }
    },
    'SetColumnNames': function() {
        if (indCol == numCols-1) {
            var name1 = this.event.request.intent.slots.ColName.value;
            colLabels.push(name1);
            var x = Math.floor(Math.random() * this.t('COL_END').length);
            var y = Math.floor(Math.random() * this.t('COL_ROW').length);
            this.emit(":tell", colLabels + this.t('COL_END')[x] + this.t('COL_ROW')[y]);
        } else {
            var name = this.event.request.intent.slots.ColName.value;
            colLabels.push(name);
            indCol += 1;
            this.emit(':tell', colLabels + ". These are the labels so far. Specify next column following the words: column name");
        }
    },
    'SetRowNames': function() {
        if (indRow == numRows-1) {
            var name1 = this.event.request.intent.slots.RowName.value;
            rowLabels.push(name1);
            dataTable[indRow][0] = name1;
            var x = Math.floor(Math.random() * this.t('ROW_END').length);
            this.emit(":tell", rowLabels + this.t('ROW_END')[x]);
        } else {
            var name = this.event.request.intent.slots.RowName.value;
            rowLabels.push(name);
            dataTable[indRow][0] = name;
            indRow += 1;
            this.emit(':tell', rowLabels + ". These are the labels so far. Specify next row following the words: row name");
        }
    },
    'RecordData': function() {
        var col = this.event.request.intent.slots.ColName.value;
        var row = this.event.request.intent.slots.RowName.value;
        var data = parseInt(this.event.request.intent.slots.Data.value);
        
        var coli = colLabels.indexOf(col);
        var rowi = rowLabels.indexOf(row);
        var index = rowi*numCols;
        index += coli;

        var x = Math.floor(Math.random() * this.t('RECORD').length);
        dataTable[rowi][coli+1] = data;
        this.emit(':tell', this.t('RECORD')[x]+ " "+ dataTable);
        
    },
    'SaveData': function() {
        var jsonTbl = tableToJSON();
        request({
            url: 'http://ec2-54-153-116-5.us-west-1.compute.amazonaws.com:5000/test',
            method: "POST",
            json: true, 
            body: jsonTbl
        }, function (error, response, body) {
        console.log(response);
        });
        var response = 'Your table has been saved! A link to the data has been sent to you. Congratulations on completing the lab! It was a pleasure collabing with you.';
        this.emit(':tell', response);
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
function tableToJSON() {
    var jsonObj = {
        "num_rows": numRows,
        "num_cols:": numCols,
        "row_names": rowLabels,
        "col_names": colLabels,
        "data": dataTable,
    }
    return jsonObj;
}
