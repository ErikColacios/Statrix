interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: {roomId: string; userId:string | undefined, userName:string | undefined, text: string; timestamp: number}, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  message: (data: {roomId: string; userId:string | undefined, userName:string | undefined, text: string; timestamp: number}) => void;
  joinRoom: (roomId:string) => void;
  leaveRoom: (roomId:string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}