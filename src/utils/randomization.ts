import nWait from "./wait"
export const wait = async (a: number, b: number) => {
    const rand = getRand(a, b);
    await nWait(rand);
}
export const getRand = (a: number, b: number): number => {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
