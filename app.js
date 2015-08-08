/**
 * "Ask My Wife" Skill.
 */
'use strict';

var Skill = require('./lib/skill');

/**
 * Sets the phone number for your wife.
 */
function setPhoneNumberInSession(intent, session, callback) {
	var cardTitle = intent.name;
	var phoneNumberSlot = intent.slots.PhoneNumber;
	var repromptText = '';
	var sessionAttributes = {};
	var shouldEndSession = false;
	var speechOutput = '';

	if (phoneNumberSlot) {
		sessionAttributes = {
			PhoneNumber: phoneNumberSlot.value,
		};
		speechOutput = 'I now know your wife\'s phone number is ' + phoneNumberSlot.value +
				'. You may now say "Ask My Wife what\'s for dinner?".';
		repromptText = 'You may now say "Ask My Wife what\'s for dinner?".';
	} else {
		speechOutput = 'I\'m not sure what your Wife\'s phone number is.';
		repromptText = speechOutput +
			' You can tell me by saying "My Wife\'s Phone number is';
	}

	callback(sessionAttributes,
			Skill.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function askMyWifeQuestion(intent, session, callback) {
	var phoneNumber;
	var repromptText = null;
	var sessionAttributes = {};
	var shouldEndSession = false;
	var speechOutput = '';

	if(session.attributes) {
		phoneNumber = session.attributes.PhoneNumber;
	}

	if(phoneNumber) {
		speechOutput = 'Texting your wife at: ' + phoneNumber;
		shouldEndSession = true;
	} else {
		speechOutput = 'I\'m not sure what your Wife\'s Phone number is.' +
			' You can tell me by saying "My Wife\'s Phone number is';
	}

	// Setting repromptText to null signifies that we do not want to reprompt the user.
	// If the user does not respond or says something that is not understood, the session
	// will end.
	callback(sessionAttributes,
			Skill.buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

var skill = new Skill({
	welcomeText: 'You will need to tell me the phone number for your wife first, ' +
		'and she will need to approve you sending text messages to her. ' +
		'Try saying My Wife\'s Phone Number is. ',
	repromptText: 'Please say My Wife\'s Phone Number Is',
}, {
	SetPhoneNumber: setPhoneNumberInSession,
	AskMyWifeQuestion: askMyWifeQuestion,
});

// Something is broken with how Lambda calls this handler function,
// so we can't just directly link exports.handler to skill.handler, because
// it doesn't call it with the right context.
exports.handler = function handleLambdaRequest(event, context) {
	skill.handler(event, context);
};

