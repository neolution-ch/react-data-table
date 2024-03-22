import { AllNullable } from "./NullableTypes";

/**
 * Type making the object possibly undefined if all properties are nullable
 */
export type ColumnFilterState<TFilter> = TFilter extends AllNullable<TFilter> ? TFilter | undefined : TFilter;