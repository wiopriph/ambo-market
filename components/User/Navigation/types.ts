import type { RouteLocationRaw } from 'vue-router';


interface UserNavigationItem {
  text: string;
  route: RouteLocationRaw;
}

export interface UserNavigationProps {
  list: UserNavigationItem[];
}
