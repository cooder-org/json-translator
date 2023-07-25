import { google } from "googleapis";

const target = ["https://www.googleapis.com/auth/spreadsheets"];
const jwt = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  scopes: target,
});
const sheets = google.sheets({ version: "v4", auth: jwt });

export interface Endpoint {
  id: string;
  typeName: string;
  schema: string;
  prompt: string;
}

export async function list() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "endpoints",
  });

  let ret: Endpoint[] = [];
  const rows: any = response.data.values;
  if (rows.length) {
    ret = rows.map((row: any) => ({
      id: row[0],
      typeName: row[1],
      schema: row[2],
      prompt: row[3] || "",
    }));
  }
  return ret;
}

export async function add(record: Endpoint) {
  const { id, typeName, schema, prompt } = record;
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "endpoints",
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, typeName, schema, prompt]],
    },
  });
  return response;
}

export async function get(id: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "endpoints",
  });

  let ret: Endpoint[] = [];
  const rows: any = response.data.values;
  if (rows.length) {
    ret = rows.map((row: any) => ({
      id: row[0],
      typeName: row[1],
      schema: row[2],
      prompt: row[3] || "",
    }));
  }
  return ret.find((e) => e.id === id);
}
