export let validate = (t) => {
    return t !== null && t !== (void 0);
};
export let invalidate = (t) => {
    return t === null || t === (void 0);
};
export let typeOf = (t) => {
    if (typeof t === "object") {
        if (t === null) {
            return "null";
        }
        return "object";
    }
    return typeof t;
};
;
;
;
;
;
;
;
;
;
;
;
;
;
