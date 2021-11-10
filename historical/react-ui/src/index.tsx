// tslint:disable:no-console
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Sidebar from "./components/sidebar/sidebar";
import Workspace from './components/workspace/workspace';
import './index.css';
import Agent from "./model/Agent";
import Application from './model/Application';
import FolderWatcherClient from './model/FolderWatcherClient';
import TorrentClient from './model/TorrentClient';
import registerServiceWorker from './registerServiceWorker';

const app = new Application();

const localAgent = new Agent();
localAgent.title = "Local";

const localTorrentClient = new TorrentClient();
localTorrentClient.name = "uTorrent";

const localFSClient01 = new FolderWatcherClient();
localFSClient01.name = "~/torrents/incoming";

localAgent.addClient(localTorrentClient, localFSClient01);

const sAgent = new Agent();
sAgent.title = "http://s.ttrider.com";

const sFSClient01 = new FolderWatcherClient();
sFSClient01.name = "c:\\torrents";
const sFSClient02 = new FolderWatcherClient();
sFSClient02.name = "d:\\torrents";
sAgent.addClient(sFSClient01, sFSClient02);

const mediaAgent = new Agent();
mediaAgent.title = "http://media.ttrider.com";
const mediaTorrentClient = new TorrentClient();
mediaTorrentClient.name = "uTorrent";

const mediaFSClient01 = new FolderWatcherClient();
mediaFSClient01.name = "/data/utorrent/items";
mediaAgent.addClient(mediaFSClient01);

app.addAgent(localAgent).addAgent(sAgent, mediaAgent);






ReactDOM.render(
  <div className="root">
    <Sidebar app={app} />
    <Workspace app={app} />
  </div>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

