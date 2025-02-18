export interface MessageProps {
  isRead: boolean,
  isSending?: boolean,
  isFailed?: boolean,
  isMine: boolean,
  date: number,
  message: string,
}
