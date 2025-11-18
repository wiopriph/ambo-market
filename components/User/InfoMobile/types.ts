interface UserInfo {
  id: string;
  name: string;
  photoURL: string;
  creationTime: number;
  emailVerified: boolean;
}

export interface UserInfoProps {
  user: UserInfo
}
