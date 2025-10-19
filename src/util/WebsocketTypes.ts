interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: {roomId: string; senderId:string | undefined, senderName:string | undefined, text: string; created_at: number}, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  messageData: (data: {roomId: string; senderId:string | undefined, senderName:string | undefined, text: string; created_at: number}) => void;
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