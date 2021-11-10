declare type Colors = "red" | "yellow" | "green" | "blue" | "gray" | "black" | "white";

declare type Direction = "left" | "right" | "up" | "down";

declare type ViewTypes = null | "FileSystemClientView" | "FolderWatcherClientView" | "TorrentClientView";

declare type TorrentStatus = "downloading" | "seeding" | "pending" | "paused";

// tslint:disable-next-line:interface-name
declare interface TorrentFileInfo {
    path: string,
    name: string,
    length: number,
    percent: number
}

// tslint:disable-next-line:interface-name
declare interface TorrentInfo {
    name: string;
    status: TorrentStatus;
    percent: number;
    files: TorrentFileInfo[]
}