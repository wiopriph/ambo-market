import type { RouteLocationRaw } from '#vue-router';
import type { DefineComponent } from 'vue';


export interface MenuItem {
  icon: DefineComponent;
  label: string;
  route: RouteLocationRaw;
}

