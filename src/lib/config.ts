export const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
export const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
export const JWT_SECRET = process.env.JWT_SECRET!;

export const TABLES = {
  users: "tblN5IowL1pKPHYop",
  personalInfo: "tbl7WCvt721ACu7X0",
  projects: "tbl3WfjyLdx019Iru",
  skills: "tblbyp2oS6k9G3Wgq",
  messages: "tblQ7BveX8oqCVI6V",
} as const;
