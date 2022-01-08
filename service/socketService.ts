import { isDevelopment } from '../utils/isProduction';

export interface SocketEvent {
  type: string;
  payload: string | { [key: string]: any };
}

export class SocketService {
  public static maxReconnectAttempts = 3;

  public socket: WebSocket = null;

  public watcher: any = null;

  public reconnectAttempts: number = 0;

  private url: string;

  public setUrl(url) {
    this.url = url;
  }

  public connect() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        console.error('[SocketService] unable to close previous websocket.');
      }
    }

    this.socket = new WebSocket(this.url);
    this.reconnectAttempts = 0;
  }

  public reconnect() {
    this.connect();
  }

  send(event: SocketEvent) {
    if (isDevelopment()) console.log('sending:', event);

    this.socket.send(JSON.stringify(event));
  }
}
