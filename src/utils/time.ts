export function secondsToTimeString(seconds: number): string {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().slice(11, 11 + 8);
}