import mysql from "serverless-mysql";
import mysql2 from "mysql2";

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    insecureAuth: true,
  },
  library: mysql2 as unknown as Function,
});

export interface QueryParams {
  query: string;
  values?: any[];
}

export interface DBError {
  error: any;
  code: string;
  errno: number;
  sqlMessage: string;
  sqlState: string;
  sql: string;
}

export async function executeQuery({ query, values }: QueryParams) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return {error};
  }
}
