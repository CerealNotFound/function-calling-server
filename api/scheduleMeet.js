import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

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
  attendees: attendees,
 }
*/

//below is the function schema, or in other words, the structure defined below will be given to the AI as the “function” that it will give us the information about, in order to be able to call it
const scheduleMeetSchema = {
  name: "scheduleGoogleMeet",
  description:
    "schedules a Google Meet event and adds it to the user's Google Calendar with optional conference data for Google Meet integration. It sets up the event with a summary, description, start/end times, timezone, and attendee emails.",
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
      attendeesString: {
        type: "array",
        items: {
          type: "string",
          description: "an array of email addresses for the event attendees",
        },
        description: "the list of attendees to be invited to the meeting event",
      },
    },
    required: ["summary", "startDateTime", "endDateTime", "timeZone"],
  },
};

/* Below we instantiate (OOP, haha!) ChatOpenAI class (create an instance of OpenAI’s API that has a well-defined structure with some set functions), and bind function arguments to the model (binding a function to this class attaches the arguments passed in all future calls, meaning the AI will already have these things available to it on the next calls to the model) */

export const scheduleMeet = async (req, res) => {
  const prompt = req.body.prompt;

  const model = new ChatOpenAI({
    model: "gpt-4-1106-preview",
  }).bind({
    functions: [scheduleMeetSchema],
    function_call: { name: "scheduleGoogleMeet" },
  });

  /* 
      Now we can call the model without having to pass the function arguments in again! (‘cause we “bind”-ed the function to the OpenAI chat instance!)
    
      According to LangChain, we can simply do this:
      const result = await model.invoke([new HumanMessage(“schedule a google meet with title as Discussion and summary as discussion about the latest AI event. Schedule for 2PM IST on 20dec. Invite info@agentprod.com and someone@agentprod.com to the meeting”)])
    
      But, we need to be able to call a function! So, I presume that we can wrap this call in a function, and then export it!
     */

  try {
    const result = await model.invoke([new HumanMessage(prompt)]);
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`function calling failed, err: ${err}`);
  }
};
