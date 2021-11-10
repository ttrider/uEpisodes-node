import { ITorrentFileInfo } from "./ITorrentFileInfo";

// tslint:disable:class-name
export interface ITorrentInfo {
    hash: string;
    name: string;
    size: number;
    percentProgressMils: number;
    downloadedBytes: number;
    uploadedBytes: number;
    ratioMils: number;
    uploadspeedBytesSec: number;
    downloadspeedBytesSec: number;
    etaSec: number;
    peersConnected: number;
    peersSwarm: number;
    seedsConnected: number;
    seedsSwarm: number;
    availability: number;
    queueOrder: number;
    remainingBytes: number;
    torrentUrl: string;
    status: string;
    downloadDir: string;

    files: ITorrentFileInfo[];
}


