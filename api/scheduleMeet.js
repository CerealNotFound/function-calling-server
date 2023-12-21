import OpenAI from "openai";

/*API format 
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
  }],
 }
*/

const scheduleMeetSchema = {
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

const messages = [{ role: "system", content: "You are a helpful assistant" }];

/* const assistant = await openai.beta.assistants.create({
  name: “AgentProd”,
  instructions: “You are a helpful assistant tasked with creating”
}) */

const tools = [
  {
    type: "function",
    function: scheduleMeetSchema,
  },
];

export const scheduleMeet = async (req, res) => {
  const openai = new OpenAI();
  const prompt = req.body.prompt;
  messages.push({ role: "user", content: prompt });

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: messages,
      tools: tools,
      tool_choice: "auto", //we could skip this
    });
    messages.push({ role: "assistant", content: result.choices[0].message });
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`function calling failed, err: ${err}`);
  }
};
