import { useEmpty, useOf } from "./factory";
import { isFunction, isOptional } from "./guard";
import { OptionalSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
export class Optional {
    value;
    Optional = OptionalSymbol;
    constructor(value) {
        this.value = value;
        Object.defineProperties(this, {
            "Optional": {
                value: OptionalSymbol,
                writable: false,
                enumerable: false,
                configurable: false
            },
            "value": {
                value: value,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
        Object.freeze(this);
    }
    filter(predicate) {
        if (this.isPresent() && isFunction(predicate) && predicate(this.value)) {
            return new Optional(this.value);
        }
        return new Optional((void 0));
    }
    get(defaultValue) {
        if (this.isPresent()) {
            return this.value;
        }
        else {
            if (validate(defaultValue)) {
                return defaultValue;
            }
            else {
                throw new TypeError("Optional is empty.");
            }
        }
    }
    ifPresent(action, elseAction) {
        if (this.isPresent() && isFunction(action)) {
            action(this.value);
        }
        else if (isFunction(elseAction)) {
            elseAction();
        }
    }
    isEmpty() {
        return invalidate(this.value);
    }
    isPresent() {
        return validate(this.value);
    }
    map(mapper) {
        if (this.isPresent() && isFunction(mapper)) {
            return new Optional(mapper(this.value));
        }
        return new Optional(null);
    }
    flat(mapper) {
        if (this.isPresent() && isFunction(mapper)) {
            let result = mapper(this.value);
            if (isOptional(result)) {
                return result;
            }
            throw new TypeError("Must return an Optional.");
        }
        return new Optional(null);
    }
    flatMap(mapper) {
        if (this.isPresent() && isFunction(mapper)) {
            let result = mapper(this.value);
            if (isOptional(result)) {
                return result;
            }
            throw new TypeError("Must return an Optional.");
        }
        return new Optional(null);
    }
    orElse(other) {
        if (this.isPresent()) {
            return this.value;
        }
        return other;
    }
    semantic() {
        if (this.isPresent()) {
            return useOf(this.value);
        }
        return useEmpty();
    }
    static empty() {
        return new Optional(null);
    }
    static of(value) {
        return Optional.ofNullable(value);
    }
    static ofNullable(value = (void 0)) {
        return new Optional(value);
    }
    static ofNonNull(value) {
        if (validate(value)) {
            return new Optional(value);
        }
        throw new TypeError("Value is not valid");
    }
}
;
Object.freeze(Optional);
Object.freeze(Optional.prototype);
Object.freeze(Object.getPrototypeOf(Optional));
