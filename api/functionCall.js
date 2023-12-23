import OpenAI from "openai";
import { scheduleMeetSchema } from "../utils/scheduleMeet.js";
import { createContactSchema } from "../utils/createContact.js";

//create a messages array below that could simulate context window, and keeps track of the chats
const messages = [{ role: "system", content: "You are a helpful assistant" }];

//defined an array of tools, here, only a function object where the function's structure/schema is defined as a variable for cleanliness/convience
const tools = [
  {
    type: "function",
    function: scheduleMeetSchema,
  },
  {
    type: "function",
    function: createContactSchema,
  },
];

export const functionCall = async (req, res) => {
  const openai = new OpenAI();
  const prompt = req.body.prompt;

  messages.push({ role: "user", content: prompt });

  /*
  Above we simply instantiate an OpenAI class instance that automatically picks up the API key stored in .env. 
  The prompt is extracted from the request. The messages array is then appended with an object that sets up the user's query that can then be taken by the AI

  Later in the code, we append the result into the messages array so as to update the context window.
 */

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: messages,
      tools: tools,
      tool_choice: "auto", //we could skip this as this is the default value
    });

    if (
      result.choices[0].message.tool_calls[0].function.name == "createContact"
    ) {
      const contactArgs =
        result.choices[0].message.tool_calls[0].function.arguments;
      console.log(contactArgs);
      // const body = {
      //   properties: contactArgs,
      // };
      // console.log(process.env.HUBSPOT);
      // console.log(body);
      const crmResponse = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          },
          body: contactArgs,
        }
      );

      console.log(crmResponse);
    }

    messages.push({ role: "assistant", content: result.choices[0].message });
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`function calling failed, err: ${err}`);
  }
};
