const { google } = require("googleapis");
const { oAuth2Client } = require("../auth/googleClient.js");

async function findSpreadsheetIdByTitle(title) {
  try {
    const oAuth2Client = getGoogleClient(); // Ensure this function provides authenticated Google client
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.spreadsheet' and name='${title}'`,
      fields: "files(id, name)",
      spaces: "drive",
    });

    const files = response.data.files;
    if (files.length === 0) {
      return JSON.stringify({ message: "No files found." });
    } else {
      const result = {
        message: `Found spreadsheet: ${files[0].name} with ID: ${files[0].id}`,
        spreadsheetId: files[0].id,
      };
      return JSON.stringify(result);
    }
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

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

async function shareSheet(params) {
  try {
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    const { fileId, email, role } = params;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: role,
        type: "user",
        emailAddress: email,
      },
    });

    const result = {
      message: `Shared the sheet with ${email} with ${role} access.`,
    };
    return JSON.stringify(result);
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

async function readSheet(params) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const { spreadsheetId, range } = params;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    return JSON.stringify({ data: response.data.values });
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

async function appendSheet(params) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const { spreadsheetId, range, valueInputOption, values } = params;
    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: valueInputOption || "USER_ENTERED",
      resource: { values: values },
    });

    const result = { message: `Appended data to sheet in range: ${range}` };
    return JSON.stringify(result);
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

async function clearSheet(params) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const { spreadsheetId, range } = params;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const result = { message: `Cleared data from range: ${range}` };
    return JSON.stringify(result);
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

async function createChart(params) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const { spreadsheetId, chartSpec } = params;
    const request = {
      requests: [{ addChart: { chart: chartSpec } }],
    };

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: request,
    });

    const result = {
      message: `Chart created with ID: ${response.data.replies[0].addChart.chart.chartId}`,
    };
    return JSON.stringify(result);
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

async function updateChart(params) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const { spreadsheetId, chartId, newChartSpec } = params;
    const request = {
      requests: [{ updateChartSpec: { chartId: chartId, spec: newChartSpec } }],
    };

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: request,
    });

    const result = { message: `Chart updated with ID: ${chartId}` };
    return JSON.stringify(result);
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

async function deleteChart(params) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const { spreadsheetId, chartId } = params;
    const request = {
      requests: [{ deleteEmbeddedObject: { objectId: chartId } }],
    };

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: request,
    });

    const result = { message: `Chart deleted with ID: ${chartId}` };
    return JSON.stringify(result);
  } catch (error) {
    const result = {
      error: `The API returned an error: ${error.message}`,
      details: error,
    };
    return JSON.stringify(result);
  }
}

module.exports = {
  findSpreadsheetIdByTitle,
  createSheet,
  updateSheet,
  shareSheet,
  readSheet,
  appendSheet,
  clearSheet,
  createChart,
  updateChart,
  deleteChart,
};
