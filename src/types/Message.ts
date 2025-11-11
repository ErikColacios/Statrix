type Message = {
  messageId: number,
  senderId: string | undefined;
  senderName: string | undefined;
  text: string;
  created_at: string;
}