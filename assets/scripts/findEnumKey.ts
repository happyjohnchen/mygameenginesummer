type Compare<T, U> = (a: T, b: U) => boolean;
export function findKey<T, U extends T[keyof T]>(
    record: T,
    value: U,
    compare: Compare<T[keyof T], U> = (a, b) => a === b): keyof T | undefined {
    return (Object.keys(record) as Array<keyof T>).find(k => compare(record[k], value)
    );
}
