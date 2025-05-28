import type { RouteLocationRaw } from 'vue-router';


export interface BlogTagProps {
  isActive: boolean;
  value: string;
  route: RouteLocationRaw
}
