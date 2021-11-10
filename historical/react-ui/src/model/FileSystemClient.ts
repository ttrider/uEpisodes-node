// import { observable } from 'mobx';
// import Agent from './Agent';
import Client from './Client';

class FileSystemClient extends Client {
    public viewType: ViewTypes = "FileSystemClientView";
}

export default FileSystemClient;