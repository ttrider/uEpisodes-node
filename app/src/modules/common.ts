import { readAll } from "csv-string";

export const maxAge = 1000 * 60 * 60 * 8; // 8 hours

export function getTokens(value: string) {
  if (value) {
    return normalizeName(value)
      .split(/\s/gim)
      .filter((s) => !!s)
      .map((s) => s.trim());
  }
  return [];
}

export function normalizeName(value: string) {
  if (value) {
    return value
      .toLowerCase()
      .replace(/["'`,:?]/gim, "")
      .replace(/[/\\.,+-]/gim, " ")
      .replace(/\(|\)/gim, " ")
      .replace(/\sthe\s/gim, " ")
      .replace(/\s{2,}/gim, "")
      .trim();
  }
  return "";
}

export function parseCSV(dataString: string) {
  return new Promise<Record<string, string>[]>((resolve) => {
    const data: Record<string, string>[] = [];
    readAll(dataString, (rows) => {
      parseCsvRecords(rows, data);
    });
    resolve(data);
  });
}

export function parseCsvRecords(
  rows: string[][],
  data: Record<string, string>[]
) {
  if (rows.length > 0) {
    const columnNames = rows[0];
    for (let index = 1; index < rows.length; index++) {
      const row = rows[index];
      const rd: Record<string, string> = {};
      for (let ri = 0; ri < Math.min(row.length, columnNames.length); ri++) {
        rd[columnNames[ri]] = row[ri];
      }
      data.push(rd);
    }
  }
}

export function parseDate(value: string) {
  if (value) {
    const d = new Date(value);
    if (d && !isNaN(d.valueOf())) {
      return d;
    }
  }
  return;
}

export function parseNumber(value: string) {
  if (value != undefined) {
    const d = parseInt(value);
    if (!isNaN(d)) {
      return d;
    }
  }
  return;
}
