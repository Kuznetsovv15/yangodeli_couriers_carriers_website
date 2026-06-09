import type { LeadFormData } from "@/lib/forms/schema";
import type { Role } from "@/types/role";

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

const ROLE_WORKSHEETS: Record<Role, string> = {
  couriers: "Leads — Couriers",
  pickers: "Leads — Pickers",
  support: "Leads — Support",
  manager: "Leads — Shift Manager",
};

const HEADERS = [
  "Timestamp",
  "Role",
  "Locale",
  "FirstName",
  "LastName",
  "Phone",
  "City",
  "Vehicle",
  "TaxRegistered",
];

type GraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  driveUser: string;
};

function getGraphConfig(): GraphConfig | null {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const driveUser = process.env.MICROSOFT_DRIVE_USER;

  if (!tenantId || !clientId || !clientSecret || !driveUser) {
    return null;
  }

  return { tenantId, clientId, clientSecret, driveUser };
}

async function getAccessToken(config: GraphConfig): Promise<string> {
  const response = await fetch(
    `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Microsoft OAuth error: ${response.status} ${body}`);
  }

  const json = (await response.json()) as { access_token: string };
  return json.access_token;
}

async function resolveItemId(
  token: string,
  config: GraphConfig
): Promise<string | null> {
  const directId = process.env.EXCEL_ITEM_ID;
  if (directId) {
    return directId;
  }

  const filePath = process.env.EXCEL_FILE_PATH ?? "Book.xlsx";
  const url = `${GRAPH_BASE}/users/${encodeURIComponent(config.driveUser)}/drive/root:/${encodeURIComponent(filePath)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as { id: string };
  return json.id;
}

function buildRow(data: LeadFormData, locale?: string): string[] {
  const timestamp = new Date().toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });

  return [
    timestamp,
    data.role,
    locale ?? "",
    data.firstName,
    data.lastName,
    data.phone,
    data.city,
    data.vehicle ?? "",
    data.taxRegistered ?? "",
  ];
}

function itemBasePath(config: GraphConfig, itemId: string): string {
  return `${GRAPH_BASE}/users/${encodeURIComponent(config.driveUser)}/drive/items/${itemId}/workbook`;
}

function worksheetPath(itemBase: string, sheetName: string, range: string): string {
  const sheet = sheetName.replace(/'/g, "''");
  return `${itemBase}/worksheets('${sheet}')/range(address='${range}')`;
}

async function patchRange(
  token: string,
  url: string,
  values: string[][]
): Promise<void> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Microsoft Excel error: ${response.status} ${body}`);
  }
}

async function getNextRow(
  token: string,
  itemBase: string,
  sheetName: string
): Promise<number> {
  const sheet = sheetName.replace(/'/g, "''");
  const url = `${itemBase}/worksheets('${sheet}')/usedRange`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return 1;
  }

  const json = (await response.json()) as { rowCount?: number };
  return (json.rowCount ?? 0) + 1;
}

export async function appendLeadToExcel(
  data: LeadFormData,
  locale?: string
): Promise<void> {
  const config = getGraphConfig();
  if (!config) {
    return;
  }

  const token = await getAccessToken(config);
  const itemId = await resolveItemId(token, config);
  if (!itemId) {
    return;
  }

  const sheetName = ROLE_WORKSHEETS[data.role];
  const itemBase = itemBasePath(config, itemId);
  const row = buildRow(data, locale);
  let nextRow = await getNextRow(token, itemBase, sheetName);

  if (nextRow === 1) {
    await patchRange(
      token,
      worksheetPath(itemBase, sheetName, "A1:I1"),
      [HEADERS]
    );
    nextRow = 2;
  }

  await patchRange(
    token,
    worksheetPath(itemBase, sheetName, `A${nextRow}:I${nextRow}`),
    [row]
  );
}
