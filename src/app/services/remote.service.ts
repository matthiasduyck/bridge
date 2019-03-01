import { Injectable } from '@angular/core';
import * as electron from 'electron';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {
  electron: typeof electron;
  remote: typeof electron.remote;
  ipcRenderer: typeof electron.ipcRenderer;

  constructor() {
    this.electron = this.require('electron');
    this.remote = this.electron.remote;
    this.ipcRenderer = this.electron.ipcRenderer;
  }

  get currentWindow() {
    return this.remote.getCurrentWindow();
  }

  require(content: string) {
    // tslint:disable-next-line
    return eval(`nodeRequire('${content}')`);
  }

  sendIPC(channel: string, ...args: any[]) {
    this.ipcRenderer.send(channel, ...args);
  }

  sendIPCSync(channel: string, ...args: any[]) {
    this.ipcRenderer.sendSync(channel, ...args);
  }

  talkIPC(responseChannel: string, sendChannel: string, ...args: any[]): Promise<{ event: electron.IpcMessageEvent, args: any[] }> {
    return new Promise(resolve => {
      this.ipcRenderer.once(responseChannel, (e: electron.IpcMessageEvent, ...responseArgs: any[]) => {
        resolve({
          event: e,
          args: responseArgs
        });
      });

      this.sendIPC(sendChannel, args);
    });
  }
}
