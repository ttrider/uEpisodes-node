import * as fs from "fs";
import { promisify } from "util";
import * as path from "path";
import * as os from "os";
import * as mkdir from "mkdirp";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdirp = promisify(mkdir);


export interface IConfig {
    uTorrent: {
        host: string;
        port: number;
        username: string;
        password: string;

        refreshRate: number;
    }

    server: {
        host: string;
        port: number;
    }

}

let config: IConfig;

export async function getConfig(): Promise<IConfig> {
    if (config) {
        return config;
    }

    const appPath = path.resolve(os.homedir(), ".uepisodes");
    await mkdirp(appPath);

    const configPath = path.resolve(appPath, "config.json");

    if (await exists(configPath)) {
        const buffer = await readFile(configPath);
        if (buffer) {
            config = JSON.parse(buffer.toString()) as IConfig;
            return config;
        }
    }

    config = {
        uTorrent: {
            host: "localhost",
            port: 26085,
            username: "admin",
            password: "password",

            refreshRate: 1000
        },
        server: {
            host: "localhost",
            port: 50372,
        }
    }


    return config;
}

export async function setConfig(updatedConfig: IConfig): Promise<IConfig> {

    config = updatedConfig;

    const appPath = path.resolve(os.homedir(), ".uepisodes");
    await mkdirp(appPath);

    const configPath = path.resolve(appPath, "config.json");

    await writeFile(configPath, config);

    return config;
}