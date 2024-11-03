interface BreadcrumbItem {
  title: string;
  to?: string;
}

export interface Props {
  items: BreadcrumbItem[];
  disableMicrodata?: boolean;
}
