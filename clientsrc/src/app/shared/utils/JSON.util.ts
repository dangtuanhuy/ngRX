export function checkJsonString(str: string) {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}
