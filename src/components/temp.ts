export function sum(...numbers: number[]): number {
    let res = 0;
    for (const numb of numbers) res += numb;
    return res;
}
