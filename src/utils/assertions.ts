export function assertNever(value: never): never {
  const repr = JSON.stringify(value);
  throw new Error(`Unhandled discriminant case: ${repr}`);
}
