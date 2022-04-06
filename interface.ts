export interface ServerToClientEvents {
    noArg: () => void;
    "chat message": (msg: string) => void;
    "system message": (msg: string) => void;
    hello: (msg: string) => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
  export interface ClientToServerEvents {
    hello: (arg: string) => any;
    "chat message": (msg: string) => void;
    login: (msg: string) => void;
    pwd: (msg: string) => void;
    register: (msg: string[]) => void;
  }
  
  export interface SocketData {
    id: number;
    login: string;
    password: string;
  }