/**
 * Type taking all nullable props from object T
 */
type PickNullable<T> = {
  [P in keyof T as undefined extends T[P] ? P : never]: T[P];
};

/**
 * Type taking all not nullable props from object T
 */
type PickNotNullable<T> = {
  [P in keyof T as undefined extends T[P] ? never : P]: T[P];
};

/**
 * Type defining an object with all nullable props as optional
 */
type OptionalNullable<T> = {
  [K in keyof PickNullable<T>]?: Exclude<T[K], undefined>;
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

/**
 * Object type in which all props are nullable
 */
type AllNullable<T> = {
  [K in keyof T]: undefined extends T[K] ? T[K] : never;
};

export { OptionalNullable, AllNullable };
