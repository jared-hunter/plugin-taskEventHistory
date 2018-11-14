/*
 *  Written By: Jared Hunter
 *
 *  This function was written to retrieve the events for a workspace for the
 *  purposes of troubleshooting taskrouter configuration from within flex UI.
 *  The following inputs on the request body will filter the results
 *       taskSid - where all events returned will be associated to this task
 *
 *  the default period of the vent history is 2880 minutes (2 days)
 *
 *  DEPENDENCIES: After creating function ensure environment variable is added
 *     TWILIO_FLEX_WORKSPACE_SID assign the value of your flex workspace
 *
 *  TBD: Add minutes as a parameter
 */

exports.handler = function(context, event, callback) {
  var client = context.getTwilioClient();
  var response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("event workspace %s", context.TWILIO_FLEX_WORKSPACE_SID);
  console.log("event task %s", event.taskSid);

  let returnEvents = function(err, events) {
    if (err) {
      response.body = { eventsize: 0, message: err.message, eventList: null };
    } else if (!events || events.length === 0) {
      response.body = {
        eventsize: 0,
        message: "no events found",
        eventList: null
      };
    } else {
      response.body = {
        eventsize: events.length,
        message: "",
        eventlist: events
      };
    }
    return callback(null, response);
  };

  if (
    context.TWILIO_FLEX_WORKSPACE_SID &&
    event.taskSid &&
    event.taskSid !== ""
  ) {
    client.taskrouter
      .workspaces(context.TWILIO_FLEX_WORKSPACE_SID)
      .events.list({ taskSid: event.taskSid, minutes: 2880 }, returnEvents);
  } else if (context.TWILIO_FLEX_WORKSPACE_SID) {
    client.taskrouter
      .workspaces(context.TWILIO_FLEX_WORKSPACE_SID)
      .events.list({ minutes: 2880 }, returnEvents);
  } else {
    response.body = {
      eventsize: 0,
      message: "missing workspace sid",
      events: null
    };
    return callback(null, response);
  }
};
