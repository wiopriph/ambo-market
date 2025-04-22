import type { RouteLocationRaw } from 'vue-router';


export interface BlogCard {
  route: RouteLocationRaw;
  title: string;
  img?: string;
  date?: Date | string | number;
}
