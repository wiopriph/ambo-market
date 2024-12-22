import type { RouteLocationRaw } from '#vue-router';


interface MenuItem {
  label: string;
  icon: string;
  route: RouteLocationRaw;
}

export interface DropdownMenuProps {
  list: MenuItem[];
}
