const { google } = require("googleapis");
const { oAuth2Client } = require("../auth/googleClient.js");

async function createSheet(auth, title) {
  const sheets = google.sheets({ version: "v4", auth });
  const resource = {
    properties: {
      title,
    },
  };

  try {
    const response = await sheets.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });

    const result = {
      message: "the google sheet was created",
      details: response,
    };

    return JSON.stringify(result);
  } catch (error) {
    if (error.message) {
      result = { error: error.message };
    } else {
      result = { error: "An unknown error occurred", details: error };
    }
    return JSON.stringify(result);
  }
}

async function updateSheet(auth, spreadsheetId) {
  const sheets = google.sheets({ version: "v4", auth });
  const range = "Sheet1"; // Specify the sheet name and range here
  const valueInputOption = "USER_ENTERED"; // Options are RAW or USER_ENTERED

  // Dummy data to be updated in the specified range
  const values = [
    ["Name", "Age", "City"], // Header row
    ["Alice", 30, "New York"],
    ["Bob", 22, "Los Angeles"],
    // Add more rows as needed
  ];

  const resource = {
    values,
  };

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });

    const result = {
      message: "The google sheet was updated successfully",
      details: response,
    };

    return JSON.stringify(result);
  } catch (error) {
    let result;
    if (error.message) {
      result = { error: error.message };
    } else {
      result = { error: "An unknown error occurred", details: error };
    }
    return JSON.stringify(result);
  }
}

updateSheet(oAuth2Client, "1Ob58WbPibT2j2XQggNJnXm20xlBEtfHRqvH0xVYEaP4");

module.exports = { createSheet, updateSheet };
