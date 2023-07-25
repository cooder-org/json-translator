import { google } from "googleapis";

const sheets = google.sheets("v4");

export interface Endpoint {
  id: string;
  typeName: string;
  schema: string;
  input: string;
}

export async function list() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "endpoints",
    auth,
  });

  let ret: Endpoint[] = [];
  const rows: any = response.data.values;
  if (rows.length) {
    ret = rows.map((row: any) => ({
      id: row[0],
      typeName: row[1],
      schema: row[2],
      input: row[3] || "",
    }));
  }
  return ret;
}

export async function add(record: Endpoint) {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const { id, typeName, schema, input } = record;
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "endpoints",
    auth,
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, typeName, schema, input]],
    },
  });
  return response;
}

export async function get(id: string) {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "endpoints",
    auth,
  });

  let ret: Endpoint[] = [];
  const rows: any = response.data.values;
  if (rows.length) {
    ret = rows.map((row: any) => ({
      id: row[0],
      typeName: row[1],
      schema: row[2],
      input: row[3] || "",
    }));
  }
  return ret.find((e) => e.id === id);
}
