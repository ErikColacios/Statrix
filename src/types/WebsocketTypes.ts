interface ServerToClientEvents {
  noArg: () => void;
  typing: (b: {messageId:number, roomId: string; senderId:string | undefined, senderName:string | undefined;}, c: Buffer) => void;
  basicEmit: (a: number, b: {messageId:number, roomId: string; senderId:string | undefined, senderName:string | undefined, text: string; created_at: Date}, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  typing: (data: {roomId: string; senderId:string | undefined, senderName:string | undefined;}) => void;
  messageData: (data: {roomId: string; senderId:string | undefined, senderName:string | undefined, text: string; created_at: string}) => void;
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