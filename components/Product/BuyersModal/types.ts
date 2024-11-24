// @todo: описать тип
export interface BuyerData {
  userId: string;
  userPhoto: string;
  userName: string;
}

// @todo: описать тип
export interface PostData {
  title: string;
  description: string;
}

export interface BuyersModalProps {
  postId: string;
}
