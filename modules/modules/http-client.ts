import axios, { AxiosResponse } from "axios";
import { parseDate } from "./common";
import { HttpClient } from "./types";

async function head(url: string, lastUpdated?: Date) {
  if (lastUpdated === undefined) return true;

  try {
    const response = await axios.head(url, {
      headers: {
        "if-modified-since": lastUpdated.toUTCString(),
      },
    });

    if (response.status) {
      if (response.status === 304) {
        return false;
      }
      if (response.status < 400) {
        return true;
      }
    }
  } catch (e) {
    const response = (
      e as unknown as { response?: AxiosResponse<unknown, unknown> }
    ).response;
    if (response) {
      if (response.status) {
        if (response.status === 304) {
          return false;
        }
        if (response.status < 400) {
          return true;
        }
      }
    }
    return false;
  }
}

async function get(url: string) {
  const response = await axios.get(url);

  if (response?.status == 200) {
    return {
      data: response.data,
      lastModified: parseDate(response.headers["last-modified"]) ?? new Date(),
    };
  }
  console.error(response.statusText);
  return;
}

export const client: HttpClient = {
  get, head
};