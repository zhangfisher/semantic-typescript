import { empty, generate } from "./factory";
import { isFunction, isOptional } from "./guard";
import type { Semantic } from "./semantic";
import { OptionalSymbol } from "./symbol";
import { invalidate, validate, type Consumer, type Functional, type MaybeInvalid, type Predicate, type Runnable } from "./utility";

export class Optional<T> {

    protected value: MaybeInvalid<T>;

    protected readonly Optional: Symbol = OptionalSymbol;

    protected constructor(value: MaybeInvalid<T>) {
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

    public filter(predicate: Predicate<T>): Optional<T> {
        if (this.isPresent() && isFunction(predicate) && predicate(this.value as T)) {
            return new Optional<T>(this.value as T);
        }
        return new Optional<T>((void 0));
    }

    public get(): T;
    public get(defaultValue: T): T;
    public get(defaultValue?: T): T {
        if (this.isPresent()) {
            return this.value as T;
        } else {
            if (validate(defaultValue)) {
                return defaultValue;
            } else {
                throw new TypeError("Optional is empty.");
            }
        }
    }

    public ifPresent(action: Consumer<T>): void;
    public ifPresent(action: Consumer<T>, elseAction: Runnable): void;
    public ifPresent(action: Consumer<T>, elseAction?: Runnable): void {
        if (this.isPresent() && isFunction(action)) {
            action(this.value as T);
        } else if (isFunction(elseAction)) {
            elseAction();
        }
    }

    public isEmpty(): boolean {
        return invalidate(this.value);
    }

    public isPresent(): boolean {
        return validate(this.value);
    }

    public map<R>(mapper: Functional<T, R>): Optional<R> {
        if (this.isPresent() && isFunction(mapper)) {
            return new Optional<R>(mapper(this.value as T));
        }
        return new Optional<R>(null);
    }

    public flat(mapper: Functional<T, Optional<T>>): Optional<T> {
        if (this.isPresent() && isFunction(mapper)) {
            let result: Optional<T> = mapper(this.value as T);
            if(isOptional(result)){
                return result;
            }
            throw new TypeError("Must return an Optional.");
        }
        return new Optional<T>(null);
    }

    public flatMap<R>(mapper: Functional<T, Optional<R>>): Optional<R> {
        if (this.isPresent() && isFunction(mapper)) {
            let result: Optional<R> = mapper(this.value as T);
            if(isOptional(result)){
                return result;
            }
            throw new TypeError("Must return an Optional.");
        }
        return new Optional<R>(null);
    }

    public orElse(other: MaybeInvalid<T>): MaybeInvalid<T> {
        if (this.isPresent()) {
            return this.value as T;
        }
        return other;
    }

    public semantic(): Semantic<T> {
        if (this.isPresent()) {
            return generate((): T => {
                return this.value as T;
            }, (): boolean => {
                return this.isEmpty();
            });
        }
        return empty();
    }

    public static empty<T>() {
        return new Optional<T>(null);
    }

    public static of<T>(value: MaybeInvalid<T>) {
        return Optional.ofNullable<T>(value);
    }

    public static ofNullable<T>(value: MaybeInvalid<T> = (void 0)) {
        return new Optional<T>(value);
    }

    public static ofNonNull<T>(value: T) {
        if (validate(value)) {
            return new Optional<T>(value);
        }
        throw new TypeError("Value is not valid");
    }
};
Object.freeze(Optional);
Object.freeze(Optional.prototype);
Object.freeze(Object.getPrototypeOf(Optional));