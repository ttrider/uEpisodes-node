import { net } from "electron";
import { HttpClient, parseDate } from "uepisodes-modules";

function get(url: string) {
  return new Promise<
    | {
        data: string;
        lastModified: Date;
      }
    | undefined
  >((resolve) => {
    const request = net.request({ url, method: "GET" });
    request.on("response", (response) => {
      if (response.statusCode !== 200) {
        resolve(undefined);
        return;
      }

      const lm = response.headers["last-modified"];
      const lmm = parseDate(lm ? (Array.isArray(lm) ? lm.join(",") : lm) : "");
      const lastModified = lmm ? lmm : new Date();

      const body: string[] = [];
      response.on("data", (chunk) => {
        body.push(chunk.toString());
      });

      response.on("end", () => {
        resolve({
          data: body.join(""),
          lastModified,
        });
      });
    });
    request.end();
  });
}

async function head(url: string, lastUpdated?: Date) {
  if (lastUpdated === undefined) return true;

  return new Promise<boolean | undefined>((resolve, reject) => {
    const request = net.request({ url, method: "HEAD" });
    request.on("response", (response) => {
      if (response.statusCode === 304) {
        resolve(false);
        return;
      }
      if (response.statusCode < 400) {
        resolve(true);
        return;
      }
      reject(new Error(response.statusMessage));
    });
    request.setHeader("if-modified-since", lastUpdated.toUTCString());
    request.end();
  });
}

export const client: HttpClient = {
  get,
  head,
};
