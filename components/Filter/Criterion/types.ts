import type { PeriodsValues } from '~/constants/filters';


export interface CriterionProps {
  type: PeriodsValues;
  value: string | boolean | number;
}
