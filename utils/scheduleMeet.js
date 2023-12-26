/*API format 

  The API format has been updated to include objects nested inside an array that have been used to signify attendees (names, corresponding emails) for the meeting instead of having an array of emails (strings)

  Also, another argument eventType with enums has been added that signifies if the meeting is solo (just a host), duo (host and 1 attendee) or multiple (host and 2 attendees)

 {
  summary: summary,
  description: description,
  start: {
    dateTime: startDateTime,
    timeZone: timeZone,
  },
  end: {
    dateTIme: endDateTime,
    timeZone: timeZone,
  },
  attendees:[
  {
    name: name,
    email: email,
  },
  {
    name: name,
    email: email,
  }],
  eventType: string,
 }
*/

export const scheduleMeetSchema = {
  name: "scheduleGoogleMeet",
  description:
    "schedules a Google Meet event and adds it to the user's Google Calendar with optional conference data for Google Meet integration. It sets up the event with a summary, description, start/end times, timezone, and attendees.",
  parameters: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "the title of the meeting event",
      },
      description: {
        type: "string",
        description: "the detailed description of the meeting event",
      },
      startDateTime: {
        type: "string",
        description: "the start date and time of the event in RFC3339 format",
      },
      endDateTime: {
        type: "string",
        description: "the end date and time of the event in RFC3339 format",
      },
      timeZone: {
        type: "string",
        description: "the timezone of the start and end times for the event",
      },
      attendees: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "the name of the meeting's attendee",
            },
            email: {
              type: "string",
              description: "the corresponding email of the meeting's attendee",
            },
          },
          description:
            "an object consisting of the names and corresponding emails of the meeting's attendees",
        },
        description:
          "an array of the attendees for the event that consists of objects where each object represents an attendee",
      },
      eventType: {
        type: "string",
        enum: ["solo", "duo", "multiple"],
        description:
          "the type of event where if there are no attendees, its solo (since the host will be there by default), with one attendee it will be a duo and else 'multiple'",
      },
    },
    required: [
      "summary",
      "startDateTime",
      "endDateTime",
      "timeZone",
      "eventType",
    ],
  },
};

export const scheduleGoogleMeet = (meetArgs) => {
  return `
  Meeting scheduled successfully. Details:
    summary: ${meetArgs.summary}
    description: ${
      meetArgs.description ? meetArgs.description : "Not Specified"
    }
    startDateTime: ${meetArgs.startDateTime}
    endDateTime: ${meetArgs.endDateTime}
    timeZone: ${meetArgs.timeZone}
    attendees: ${meetArgs.attendees ? meetArgs.attendees : "No other attendees"}
    eventType: ${meetArgs.eventType}
  `;
};
