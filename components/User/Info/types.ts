interface UserInfo {
  id: string;
  name: string;
  photoURL: string;
  rating: number;
  creationTime: number;
  emailVerified: boolean;
  fbVerified: boolean;
  friendCount: number;
}

export interface UserInfoProps {
  user: UserInfo
}
