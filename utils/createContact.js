/* API format
{
  "properties": {
    "email": "example@hubspot.com",
    "firstname": "Jane",
    "lastname": "Doe",
    "phone": "(555) 555-5555",
    "company": "HubSpot",
    "website": "hubspot.com",
    "lifecyclestage": "marketingqualifiedlead"
  }
}
*/

//parameters are objects with type and description, or enums

export const createContactSchema = {
  name: "createContact",
  description:
    "creates a contact object with the relevant data that would be added to a CRM (HubSpot)",
  parameters: {
    type: "object",
    properties: {
      properties: {
        type: "object",
        description: "object containing all the required parameters",
        properties: {
          email: {
            type: "string",
            description: "corresponding email of the contact",
          },
          firstname: {
            type: "string",
            description: "first name of the contact",
          },
          lastname: {
            type: "string",
            description: "last name of the contact",
          },
          phone: {
            type: "string",
            description:
              "phone number of the contact with the country code. example: +91 1234567890",
          },
          company: {
            type: "string",
            description:
              "name of the company that the contact is associated with",
          },
          website: {
            type: "string",
            description: "url of the website of the contact",
          },
          lifecyclestage: {
            type: "string",
            enum: [
              "subscriber",
              "lead",
              "marketingqualifiedlead",
              "salesqualifiedlead",
              "opportunity",
              "customer",
              "evangelist",
              "other",
            ],
          },
        },
        description: "customer lifecycle stage of the contact",
      },
    },
    required: ["firstname", "email"],
  },
};
