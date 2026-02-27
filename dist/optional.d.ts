import type { Semantic } from "./semantic";
import { type Consumer, type Functional, type MaybeInvalid, type Predicate, type Runnable } from "./utility";
export declare class Optional<T> {
    protected value: MaybeInvalid<T>;
    protected readonly Optional: Symbol;
    protected constructor(value: MaybeInvalid<T>);
    filter(predicate: Predicate<T>): Optional<T>;
    get(): T;
    get(defaultValue: T): T;
    ifPresent(action: Consumer<T>): void;
    ifPresent(action: Consumer<T>, elseAction: Runnable): void;
    isEmpty(): boolean;
    isPresent(): boolean;
    map<R>(mapper: Functional<T, R>): Optional<R>;
    flat(mapper: Functional<T, Optional<T>>): Optional<T>;
    flatMap<R>(mapper: Functional<T, Optional<R>>): Optional<R>;
    orElse(other: MaybeInvalid<T>): MaybeInvalid<T>;
    semantic(): Semantic<T>;
    static empty<T>(): Optional<T>;
    static of<T>(value: MaybeInvalid<T>): Optional<T>;
    static ofNullable<T>(value?: MaybeInvalid<T>): Optional<T>;
    static ofNonNull<T>(value: T): Optional<T>;
}
