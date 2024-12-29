import type { RouteLocationRaw } from 'vue-router';


interface BreadcrumbItem {
  title: string;
  to?: RouteLocationRaw;
}

export interface Props {
  items: BreadcrumbItem[];
  disableMicrodata?: boolean;
}
