import * as sio from "socket.io";
import { getConfig, IConfig } from "./config";
import { ITorrentInfo } from "./ITorrentInfo";
import { ITorrentFileInfo } from "./ITorrentFileInfo";
// tslint:disable-next-line:no-var-requires
const torrentLib = require("library-utorrent");

import * as clientio from "socket.io-client";

initialize()
    .catch(err => console.error(err));

    setTimeout(() => {

        const socket = clientio.connect('http://localhost:50372');
    
        socket.on('torrent-list', (data: any) => {
            console.log(data);
        });
    
        socket.connect();
    
    }, 1000);


export async function initialize() {

    const config = await getConfig();

    const io = sio(config.server.port);

    io.on('connection', (socket) => {

        console.info("connection");

        // socket.on('message', (d) => {
        //     console.info(d);
        // });
        // socket.on('disconnect', () => {
        //     console.info("disconnect");
        // });


        socket.emit("config", config);
    });



    setInterval(async () => {

        const list = await loadList(config);
        for (const listItem of list) {
            const fileInfo = await loadFileInfo(config, listItem.hash);
            listItem.files = fileInfo;
        }

        io.emit("torrent-list", list);

    }, config.uTorrent.refreshRate);
}

async function loadList(config: IConfig) {

    return new Promise<ITorrentInfo[]>((resolve, reject) => {

        torrentLib.listTorrents(config.uTorrent).exec({
            error: (err: any) => {
                reject(err);
            },
            success: (torrents: any[]) => {

                const res: ITorrentInfo[] = [];
                for (const item of torrents) {
                    const ti = item.parsed as ITorrentInfo;
                    ti.files = [];
                    res.push(item.parsed);
                }

                resolve(res);
            }
        });
    });
}

async function loadFileInfo(config: IConfig, hash: string) {

    return new Promise<ITorrentFileInfo[]>((resolve, reject) => {

        torrentLib.getTorrentDetails({
            hash,
            host: config.uTorrent.host,
            password: config.uTorrent.password,
            port: config.uTorrent.port,
            username: config.uTorrent.username,
        }).exec({
            error: (err: any) => {
                reject(err);
            },
            success: (result: any) => {

                const ret: ITorrentFileInfo[] = [];

                if (result && result.files && result.files.length >= 2) {

                    const fileset = result.files[1];

                    for (const fileItem of fileset) {

                        ret.push({
                            downloadedSize: parseInt(fileItem[2], 10),
                            path: fileItem[0],
                            priority: parseInt(fileItem[3], 10),
                            size: parseInt(fileItem[1], 10)
                        });

                    }
                }

                resolve(ret);
            }
        });
    });
}