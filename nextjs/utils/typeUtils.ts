export type ResolveStaticPropsReturnType<T extends (...args: any) => Promise<{ props: any }>> =
  T extends (...args: any) => Promise<{ props: infer U }> ? U : never;
