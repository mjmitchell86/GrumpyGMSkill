'use strict';
var Alexa = require('alexa-sdk');
var aws = require('aws-sdk');

var APP_ID = "amzn1.ask.skill.4dd1982c-e83f-42e4-a082-4ebdb76618b7"; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Grumpy GM';

//Will be moving this into DynamoDB in the future
var Taunts = [
    "You’re tearing me apart, {name}.",
    "You know nothing, {name}.",
    "I would ask how old you are, but I know you can't count that high.",
	"Charisma was OBVIOUSLY {name}’s dump stat.",
	"I don't want to.",
	"{name} looks like they ran a 40 meter sprint in a 30 meter room!",
	"You’re tearing me apart, {name}.",
	"Someday you'll go far, {name}. I hope you'll stay there.",
	"No one will blame you for giving up. In fact, quitting at this point is a perfectly reasonable response.",
	"Is it true when you were born the doctor turned around and slapped your mother?",
	"{name}? Well, I've met sharper loaves of bread.",
	"No.",
	"You know nothing, {name}.",
	"{name} is about as effective as a cat-flap in an elephant house.",
	"For {name}, the only winning move is not to play.",
	"{name}, make like a tree, and get out of here.",
	"I don't want to.",
	"You are a sad strange little man, and you have my pity.",
	"All Your Base Are Belong To Me.",
	"I can't do that, Dave.",
	"Rocks Fall. Everyone Dies. Good.",
	"You mad, bro?",
	"Well, the jerk store called. They're running out of {name}.",
	"What? I can't hear you over the sound of how awesome I am.",
	"Thank you for helping us help you help us all.",
	"We are throwing a party in honor of your tremendous success, <name>.",
	"What are the stats on that shirt, {name}? Plus 10 to Uselessness?",
	"Cry some more… Ha ha ha.",
	"{name}, you stuck up, half-witted, scruffy-looking… Nerf herder!",
	"Cake and grief counseling will be available at the conclusion of the game.",
	"{name}, your mother was a hamster and your father smelt of elderberries."
];

var VictimName = "bob";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'GetNewTauntIntent': function () {
    	VictimName = this.event.request.intent.slots.victim.value;
    	
        this.emit('GetTaunt');
    },
    'GetTaunt': function () {       
        //Select random taunt.
        var tauntIndex = Math.floor(Math.random() * Taunts.length);
        var randomTaunt = Taunts[tauntIndex];
        var xuTaunt = randomTaunt.replace("{name}", VictimName);

        // Create speech output
        var speechOutput = xuTaunt;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, xuTaunt);
    },
    'RollDiceIntent': function () {
        var sides = this.event.request.intent.slots.sides.value;
        if (!sides){
            sides = 6
        }

        var diceRoll = 1 + Math.floor(Math.random() * sides);
        var speechOutput = "Your dice roll is " + diceRoll;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
       },
    'CoinFlipIntent': function () {      
        var coin = "";
        var coinFlipNum = 1 + Math.floor(Math.random() * 2);
        if(coinFlipNum === 1){
            coin = "heads"
        } else {
            coin = "tails"
        }        
        var speechOutput = "The coin has landed on " + coin;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
       },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say please taunt insert name here.";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};