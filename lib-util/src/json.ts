export function isObject<T>(v: T): boolean {
  return '[object Object]' === Object.prototype.toString.call(v);
}
export function sortJson<T extends Record<string, any>>(o: T): T {
  if (Array.isArray(o)) {
    return o.sort().map(sortJson) as unknown as T;
  } else if (isObject(o)) {
    return Object.keys(o)
      .sort()
      .reduce(function (a: Record<keyof T, any>, k) {
        a[k as keyof T] = sortJson(o[k as keyof T]);
        return a;
      }, {} as T);
  }
  return o;
}