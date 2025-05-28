import type { RouteLocationRaw } from 'vue-router';


export interface BlogCard {
  route: RouteLocationRaw;
  title: string;
  img?: string;
  tags?: string[];
  date?: Date | string | number;
}
