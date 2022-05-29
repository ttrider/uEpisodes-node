import path from "path";
import os from "os";
import * as fss from "fs";
import axios, { AxiosResponse } from "axios";
import { getLogger } from "./logger";
import { maxAge, parseDate } from "./common";
import lru from "lru-cache";
import { HttpClient } from "..";

const { stat, mkdir, writeFile, readFile, utimes } = fss.promises;

const lruOptions = { maxAge: maxAge };
const metadataLRU = new lru(lruOptions);

export default async function getMetadata<T>(
  httpClient: HttpClient,
  fileUrl: string,
  factory: (body: string) => Promise<T>,
  filter?: RegExp,
  forceRefresh?: boolean
) {
  const logger = getLogger("getMetadata");
  logger.debug(fileUrl);

  const url = new URL(fileUrl);
  const urlFile =
    (url.pathname + url.search).replace(/[:/\\.?=]/g, "-") + ".json";

  const cached = metadataLRU.get(urlFile);
  if (cached) {
    return cached as T;
  }

  const outputFile = path.resolve(os.tmpdir(), "uepisodes/epguides", urlFile);

  let modifiedTime = forceRefresh
    ? undefined
    : await getModifiedTime(outputFile);
  logger.debug("modifiedTime:", modifiedTime);

  // if we downloaded this file within 8 hours - use it
  const now = Date.now();
  if (modifiedTime && now - modifiedTime.valueOf() < maxAge) {
    const localMetadata = await readLocalData(outputFile);
    if (localMetadata) {
      metadataLRU.set(urlFile, localMetadata);
      return localMetadata;
    }
    modifiedTime = undefined;
  }

  const shouldDownload = await httpClient.head(fileUrl, modifiedTime);
  logger.debug("shouldDownload:", shouldDownload);
  if (shouldDownload) {
    const dataString = await httpClient.get(fileUrl);
    logger.debug(
      "got results from ",
      fileUrl,
      "has results:",
      !!dataString,
      "last modified:",
      dataString?.lastModified
    );
    if (dataString?.data) {
      const inputData = filter
        ? filter.exec(dataString.data)?.[1]?.trim()
        : dataString.data;

      const metadata = await factory(inputData);
      await mkdir(path.dirname(outputFile), { recursive: true });
      await writeFile(outputFile, JSON.stringify(metadata, null, 2));

      if (dataString.lastModified) {
        await utimes(
          outputFile,
          dataString.lastModified,
          dataString.lastModified
        );
      }

      metadataLRU.set(urlFile, metadata);
      return metadata;
    }
  }
  const localMetadata = await readLocalData(outputFile);
  if (localMetadata) {
    metadataLRU.set(urlFile, localMetadata);
    return localMetadata;
  }
  return {} as T;

  async function readLocalData(filePath: string) {
    try {
      const buffer = await readFile(filePath);
      const metadata = JSON.parse(buffer.toString()) as T;
      logger.debug("metadata from file");
      return metadata;
    } catch (e) {
      logger.error(e);
      return;
    }
  }

  async function getModifiedTime(path: string) {
    logger.debug("getModifiedTime", path);
    try {
      // check if exists and get the last modifed date
      const fStats = await stat(path);
      if (fStats) {
        logger.debug("getModifiedTime", fStats.mtime);
        return fStats.mtime;
      }
      logger.debug("getModifiedTime", "empty result from stat");
      return undefined;
    } catch (e) {
      const err = e as { code: string; errno: number };
      // if file/path doen"t exists, return null
      if (err && err.code === "ENOENT" && err.errno === -2) {
        logger.debug("getModifiedTime", "file not found");
        return undefined;
      }
      // otherwise - re-throw;
      throw err;
    }
  }
}


