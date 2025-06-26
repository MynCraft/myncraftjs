export type ExtraText = {
    color?: string | { value: string };
    bold?: boolean | { value: boolean };
    text: string | { value: string };
    extra?: ExtraText[] | { value: { value: ExtraText[] } };
    value?: ExtraText[];
};
export function getExtra(extra: ExtraText): string {
    let colorizedMsg = "";

    colorizedMsg +=
        typeof extra.text === "string" ? extra.text : (extra.text?.value ?? "")


    let extraArray: ExtraText[] | undefined;
    if (Array.isArray(extra.extra)) {
        extraArray = extra.extra;
    } else if (extra.extra && typeof extra.extra === "object" && "value" in extra.extra && Array.isArray(extra.extra.value?.value)) {
        extraArray = extra.extra.value.value;
    }
    if (extraArray && extraArray.length > 0) {
        for (const e of extraArray) {
            colorizedMsg += getExtra(e);
        }
    }
    if (extra.value && extra.value.length > 0) {
        for (const e of extra.value) {
            colorizedMsg += getExtra(e);
        }
    }
    return colorizedMsg;
}