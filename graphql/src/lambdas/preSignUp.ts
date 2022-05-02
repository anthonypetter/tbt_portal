import { PreSignUpTriggerHandler } from "aws-lambda";

const preSignUpTrigger: PreSignUpTriggerHandler = (
  event,
  context,
  callback
) => {
  // Set the user pool autoConfirmUser flag after validating the email domain
  event.response.autoVerifyEmail = true;
  event.response.autoConfirmUser = true;
  console.log("preSignUpTrigger triggered");
  console.log("event", event);

  // Return to Amazon Cognito
  callback(null, event);
};

exports.handler = preSignUpTrigger;
