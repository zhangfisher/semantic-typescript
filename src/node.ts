import { isObject, isOptional } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { LinearNodeSymbol, NodeSymbol, RedBlackNodeSymbol } from "./symbol";
import { invalidate, validate, type Comparator } from "./utility";

export interface Node<E, N extends Node<E, N>> extends Iterable<N> {

    ancestors(): Iterable<N>;
    children(): Iterable<N>;
    descendants(): Iterable<N>;
    siblings(): Iterable<N>;
    parent(): Optional<N>;
    root(): N;

    previousSibling(): Optional<N>;
    nextSibling(): Optional<N>;

    preorder(): Generator<N>;
    inorder(): Generator<N>;
    postorder(): Generator<N>;
    breadthfirst(): Generator<N>;

    depth(): bigint;
    height(): bigint;
    width(): bigint;
    level(): bigint;
    isLeaf(): boolean;
    isRoot(): boolean;

    [Symbol.iterator](): Iterator<N>;
};

export abstract class AbstractNode<E, N extends Node<E, N>> implements Node<E, N> {

    protected readonly Node: symbol = NodeSymbol;

    public constructor() {

    }

    public *ancestors(): Iterable<N> {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            let value: N = parent.get();
            yield value;
            yield* value.ancestors();
        }
    }

    public abstract children(): Iterable<N>;

    public *descendants(): Iterable<N> {
        for (let child of this.children()) {
            yield child;
            yield* child.descendants();
        }
    }

    public root(): N {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this as unknown as N;
    }

    public *siblings(): Iterable<N> {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            for (let sibling of parent.get().children()) {
                if (sibling !== (this as unknown as Node<E, N>) && !Object.is(sibling, this)) {
                    yield sibling;
                }
            }
        }
    }

    public abstract parent(): Optional<N>;

    public previousSibling(): Optional<N> {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            let siblings: Array<N> = Array.from(parent.get().children());
            let index: number = siblings.indexOf(this as unknown as N);
            if (index > 0) {
                return Optional.of(siblings[index - 1]);
            }
        }
        return Optional.empty();
    }

    public nextSibling(): Optional<N> {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            let siblings: Array<N> = Array.from(parent.get().children());
            let index: number = siblings.indexOf(this as unknown as N);
            if (index < siblings.length - 1) {
                return Optional.of(siblings[index + 1]);
            }
        }
        return Optional.empty();
    }

    public *preorder(): Generator<N> {
        yield this as unknown as N;
        for (let child of this.children()) {
            yield* child.preorder();
        }
    }

    public *inorder(): Generator<N> {
        let children: Array<N> = Array.from(this.children());
        let middle: number = Math.floor(children.length / 2);
        if (children.length > 0) {
            for (let index: number = 0; index < middle; index++) {
                yield* children[index].inorder();
            }
        }
        yield this as unknown as N;
        for (let index: number = middle; index < children.length; index++) {
            yield* children[index].inorder();
        }
    }

    public *postorder(): Generator<N> {
        for (let child of this.children()) {
            yield* child.postorder();
        }
        yield this as unknown as N;
    }

    public *breadthfirst(): Generator<N> {
        let queue: Array<Node<E, N>> = [this as unknown as N];
        while (queue.length > 0) {
            let node: N = queue.shift() as N;
            yield node;
            for (let child of node.children()) {
                queue.push(child);
            }
        }
    }

    public *[Symbol.iterator](): Iterator<N> {
        yield* this.preorder();
    }

    public depth(): bigint {
        let parent: Optional<N> = this.parent();
        return parent.isPresent() ? 1n + parent.get().depth() : 0n;
    }

    public height(): bigint {
        if (this.isLeaf()) {
            return -1n;
        }
        return [...this.children()].reduce((maximum: bigint, child: N): bigint => {
            if (maximum < child.height()) {
                return child.height() + 1n;
            }
            return maximum + 1n;
        }, 0n);
    }

    public width(): bigint {
        if (this.isLeaf()) {
            return 0n;
        }
        return [...this.children()].reduce((sum: bigint, child: N): bigint => {
            return sum + child.width() + 1n;
        }, 0n);
    }

    public level(): bigint {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            return parent.get().level() + 1n;
        }
        return 0n;
    }

    public isLeaf(): boolean {
        return [...this.children()].length === 0;
    }

    public isRoot(): boolean {
        return this.parent().isEmpty();
    }
};

export class LinearNode<E> extends AbstractNode<E, LinearNode<E>> {

    protected previous: Optional<LinearNode<E>>;
    protected next: Optional<LinearNode<E>>;
    protected element: Optional<E>;

    protected readonly LinearNode: symbol = LinearNodeSymbol;

    public constructor(element: E);
    public constructor(element: E, previous: Optional<LinearNode<E>>, next: Optional<LinearNode<E>>);
    public constructor(element: E, previous?: Optional<LinearNode<E>>, next?: Optional<LinearNode<E>>) {
        super();
        this.element = Optional.of(element);
        this.previous = previous || Optional.empty();
        this.next = next || Optional.empty();
    }

    public override *ancestors(): Iterable<LinearNode<E>> {
        let parent: Optional<LinearNode<E>> = this.parent();
        if (parent.isPresent()) {
            yield parent.get();
            yield* parent.get().ancestors();
        }
    }

    public override *descendants(): Iterable<LinearNode<E>> {
        if (validate(this.next) && this.next.isPresent()) {
            yield this.next.get();
            yield* this.next.get().descendants();
        }
    }

    public override root(): LinearNode<E> {
        let parent: Optional<LinearNode<E>> = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this;
    }

    public override *siblings(): Iterable<LinearNode<E>> {
        let root: LinearNode<E> = this.root();
        if (validate(root)) {
            yield root;
            let next: Optional<LinearNode<E>> = this.nextSibling();
            if (validate(next) && next.isPresent()) {
                yield* next.get().siblings();
            }
        }
    }

    public override *children(): Iterable<LinearNode<E>> {
        if (validate(this.next) && this.next.isPresent()) {
            yield this.next.get();
            yield* this.next.get().children();
        }
    }

    public override parent(): Optional<LinearNode<E>> {
        return validate(this.previous) ? this.previous : Optional.empty();
    }

    public override *[Symbol.iterator](): Iterator<LinearNode<E>> {
        let root: LinearNode<E> = this.root();
        if (validate(root)) {
            yield root;
        }
        while (validate(root) && validate(root.next) && root.next.isPresent()) {
            root = root.next.get();
            yield root;
        }
    }

    public getElement(): Optional<E> {
        return validate(this.element) ? this.element : Optional.empty();
    }

    public setElement(element: E): void {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }

    public getPrevious(): Optional<LinearNode<E>> {
        return validate(this.previous) ? this.previous : Optional.empty();
    }

    public setPrevious(previous: LinearNode<E>): void;
    public setPrevious(previous: Optional<LinearNode<E>>): void;
    public setPrevious(previous: LinearNode<E> | Optional<LinearNode<E>>): void {
        if (validate(previous)) {
            if (isOptional(previous)) {
                this.previous = previous as Optional<LinearNode<E>>;
            } else if (isObject(previous)) {
                this.previous = Optional.of(previous as LinearNode<E>);
            }
        }
    }

    public getNext(): Optional<LinearNode<E>> {
        return validate(this.next) ? this.next : Optional.empty();
    }

    public setNext(next: LinearNode<E>): void;
    public setNext(next: Optional<LinearNode<E>>): void;
    public setNext(next: LinearNode<E> | Optional<LinearNode<E>>): void {
        if (validate(next)) {
            if (isOptional(next)) {
                this.next = next as Optional<LinearNode<E>>;
            } else if (isObject(next)) {
                this.next = Optional.of(next as LinearNode<E>);
            }
        }
    }

    public linkPrevious(previous: LinearNode<E>): void {
        if (validate(previous)) {
            this.setPrevious(previous);
            previous.setNext(this);
        }
    }

    public unlinkPrevious(): void {
        if (validate(this.previous) && this.previous.isPresent()) {
            if (validate(this.next) && this.next.isPresent()) {
                this.previous.get().setNext(this.next.get());
            } else {
                this.previous.get().setNext(Optional.empty<LinearNode<E>>());
            }
        }
    }

    public linkNext(next: LinearNode<E>): void {
        if (validate(next)) {
            this.setNext(next);
            next.setPrevious(this);
        }
    }

    public unlinkNext(): void {
        if (validate(this.next) && this.next.isPresent()) {
            if (validate(this.previous) && this.previous.isPresent()) {
                this.next.get().setPrevious(this.previous.get());
            } else {
                this.next.get().setPrevious(Optional.empty<LinearNode<E>>());
            }
        }
    }
};

export abstract class BinaryNode<E, N extends BinaryNode<E, N>> extends AbstractNode<E, N> {

    BinaryNode: symbol = Symbol("BinaryNode");

    protected ancestor: Optional<N>;
    protected left: Optional<N>;
    protected right: Optional<N>;
    protected element: Optional<E>;

    public constructor(element: E);
    public constructor(element: E, ancestor: Optional<N>, left: Optional<N>, right: Optional<N>);
    public constructor(element: E, ancestor?: Optional<N>, left?: Optional<N>, right?: Optional<N>) {
        super();
        this.element = Optional.of(element);
        this.ancestor = ancestor || Optional.empty();
        this.left = left || Optional.empty();
        this.right = right || Optional.empty();
    }

    public override *ancestors(): Iterable<N> {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            yield parent.get();
            yield* parent.get().ancestors();
        }
    }

    public compare(other: N): bigint;
    public compare(other: N, comparator: Comparator<E>): bigint;
    public compare(other: N, comparator?: Comparator<E>): bigint{
        if(invalidate(this.element)){
            if(invalidate(other) || invalidate(other.element)){
                return 0n;
            }
            return -1n;
        }
        if(this.element.isPresent()){
            comparator = comparator || useCompare;
            if(validate(other.element) && other.element.isPresent()){
                return BigInt(comparator(this.element.get(), other.element.get()));
            }else{
                return 1n;
            }
        }
        return -1n;
    }

    public override *descendants(): Iterable<N> {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
            yield* this.left.get().descendants();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
            yield* this.right.get().descendants();
        }
    }

    public abstract identity(): N;

    public override root(): N {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this.identity();
    }

    public override *siblings(): Iterable<N> {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            let siblings: Array<N> = Array.from(parent.get().children());
            let index: number = siblings.indexOf(this as unknown as N);
            if (index > 0) {
                yield siblings[index - 1];
            }
            if (index < siblings.length - 1) {
                yield siblings[index + 1];
            }
        }
    }

    public override *children(): Iterable<N> {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
        }
    }

    public override parent(): Optional<N> {
        return validate(this.parent) ? this.ancestor : Optional.empty();
    }

    public override *[Symbol.iterator](): Iterator<N> {
        yield* this.preorder();
    }

    public override *preorder(): Generator<N> {
        yield this as unknown as N;
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().preorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().preorder();
        }
    }

    public override *inorder(): Generator<N> {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().inorder();
        }
        yield this as unknown as N;
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().inorder();
        }
    }

    public override *postorder(): Generator<N> {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().postorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().postorder();
        }
        yield this.identity();
    }

    public override *breadthfirst(): Generator<N> {
        let queue: Array<N> = [this.identity()];
        while (queue.length > 0) {
            let node: N = queue.shift() as N;
            yield node;
            if (validate(node.left) && node.left.isPresent()) {
                queue.push(node.left.get());
            }
            if (validate(node.right) && node.right.isPresent()) {
                queue.push(node.right.get());
            }
        }
    }

    public getElement(): Optional<E> {
        return validate(this.element) ? this.element : Optional.empty();
    }

    public setElement(element: E): void {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }

    public getLeft(): Optional<N> {
        return validate(this.left) ? this.left : Optional.empty();
    }

    public setLeft(left: N): void;
    public setLeft(left: Optional<N>): void;
    public setLeft(left: N | Optional<N>): void {
        if (validate(left)) {
            if (isOptional(left)) {
                this.left = left as Optional<N>;
            } else if (isObject(left)) {
                this.left = Optional.of(left as N);
            }
        }
    }

    public getRight(): Optional<N> {
        return validate(this.right) ? this.right : Optional.empty();
    }

    public setRight(right: N): void;
    public setRight(right: Optional<N>): void;
    public setRight(right: N | Optional<N>): void {
        if (validate(right)) {
            if (isOptional(right)) {
                this.right = right as Optional<N>;
            } else if (isObject(right)) {
                this.right = Optional.of(right as N);
            }
        }
    }

    public getAncestor(): Optional<N> {
        return validate(this.ancestor) ? this.ancestor : Optional.empty();
    }

    public setAncestor(ancestor: N): void;
    public setAncestor(ancestor: Optional<N>): void;
    public setAncestor(ancestor: N | Optional<N>): void {
        if (validate(ancestor)) {
            if (isOptional(ancestor)) {
                this.ancestor = ancestor as Optional<N>;
            } else if (isObject(ancestor)) {
                this.ancestor = Optional.of(ancestor as N);
            }
        }
    }

    public linkLeft(left: N): void {
        if (validate(left)) {
            this.setLeft(left);
            left.setAncestor(this as unknown as Optional<N>);
        }
    }

    public unlinkLeft(): Optional<N> {
        if (validate(this.left) && this.left.isPresent()) {
            let left: Optional<N> = this.left;
            if (validate(left) && left.isPresent()) {
                left.get().setAncestor(Optional.empty<N>());
            }
            return left;
        }
        this.left = Optional.empty();
        return this.left;
    }

    public linkRight(right: N): void {
        if (validate(right)) {
            this.setRight(right);
            right.setAncestor(this as unknown as Optional<N>);
        }
    }

    public unlinkRight(): Optional<N> {
        if (validate(this.right) && this.right.isPresent()) {
            let right: Optional<N> = this.right;
            if (validate(right) && right.isPresent()) {
                right.get().setAncestor(Optional.empty<N>());
            }
            return right;
        }
        this.right = Optional.empty();
        return this.right;
    }

    public isLeftChild(): boolean {
        if (validate(this.ancestor)) {
            return this.ancestor.map((parent: N): boolean => {
                let left: Optional<N> = parent.getLeft();
                if (validate(left) && left.isPresent()) {
                    return (left.get() === (this as unknown as N)) || Object.is(left, this);
                }
                return false;
            }).get(false);
        }
        return false;
    }

    public isRightChild(): boolean {
        if (validate(this.ancestor)) {
            return this.ancestor.map((parent: N): boolean => {
                let right: Optional<N> = parent.getRight();
                if (validate(right) && right.isPresent()) {
                    return (right.get() === (this as unknown as N)) || Object.is(right, this);
                }
                return false;
            }).get(false);
        }
        return false;
    }

    public detach(): void {
        let parent: Optional<N> = this.parent();
        if (parent.isPresent()) {
            if (this.isLeftChild()) {
                parent.get().unlinkLeft();
            }
            if (this.isRightChild()) {
                parent.get().unlinkRight();
            }
        }
    }

    public isBanlanced(): boolean {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().height() === this.right.get().height();
        }
        return false;
    }

    public isFull(): boolean {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().isFull() && this.right.get().isFull();
        }
        return false;
    }

    public isComplete(): boolean {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().isComplete() && this.right.get().isComplete();
        }
        return false;
    }

    public isPerfect(): boolean {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().isPerfect() && this.right.get().isPerfect();
        }
        return false;
    }

    public invert(): void;
    public invert(deep: boolean): void
    public invert(deep: boolean = false): void {
        if (deep === true) {
            if (validate(this.left) && this.left.isPresent()) {
                this.left.get().invert(deep);
            }
            if (validate(this.right) && this.right.isPresent()) {
                this.right.get().invert(deep);
            }
        } else {
            let left: Optional<N> = this.left;
            let right: Optional<N> = this.right;
            this.left = right;
            this.right = left;
        }
    }
};

type Color = "RED" | "BLACK";
export class RedBlackNode<E> extends BinaryNode<E, RedBlackNode<E>> {

    protected readonly RedBlackNode: symbol = RedBlackNodeSymbol;

    protected color: Color;

    public constructor(element: E);
    public constructor(element: E, color: Color);
    public constructor(element: E, color: Color, ancestor: Optional<RedBlackNode<E>>, left: Optional<RedBlackNode<E>>, right: Optional<RedBlackNode<E>>);
    public constructor(element: E, color: Color = "RED", ancestor?: Optional<RedBlackNode<E>>, left?: Optional<RedBlackNode<E>>, right?: Optional<RedBlackNode<E>>) {
        super(element, ancestor || Optional.empty(), left || Optional.empty(), right || Optional.empty());
        this.color = color;
    }

    public override identity(): RedBlackNode<E> {
        return this;
    }

    public getElement(): Optional<E> {
        return validate(this.element) ? this.element : Optional.empty();
    }

    public setElement(element: E): void {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }

    public getLeft(): Optional<RedBlackNode<E>> {
        return validate(this.left) ? this.left : Optional.empty();
    }

    public getRight(): Optional<RedBlackNode<E>> {
        return validate(this.right) ? this.right : Optional.empty();
    }

    public getColor(): Color {
        return this.color;
    }

    public setColor(color: Color): void {
        this.color = color;
    }

    public isRed(): boolean {
        return this.color === "RED";
    }

    public isBlack(): boolean {
        return this.color === "BLACK";
    }

    public turnRed(): void {
        this.color = "RED";
    }

    public turnBlack(): void {
        this.color = "BLACK";
    }

    public toggle() {
        if (this.isRed()) {
            this.turnBlack();
        } else {
            this.turnRed();
        }
    }

    public compareAndLink(other: RedBlackNode<E>): void;
    public compareAndLink(other: RedBlackNode<E>, comparator: Comparator<E>): void;
    public compareAndLink(other: RedBlackNode<E>, comparator?: Comparator<E>): void {
        if (invalidate(this.element)) {
            if (invalidate(other) || invalidate(other.element)) {
                return;
            }
            this.linkLeft(other);
            return;
        }
        if (validate(other) && validate(other.element)) {
            comparator = comparator || useCompare;
            if (this.compare(other, comparator) < 0) {
                if(validate(this.left) && this.left.isPresent()){
                    this.left.get().compareAndLink(other, comparator);
                }else{
                    this.linkLeft(other);
                    this.fix();
                }
            } else {
                if(validate(this.right) && this.right.isPresent()){
                    this.right.get().compareAndLink(other, comparator);
                }else{
                    this.linkRight(other);
                    this.fix();
                }
            }
        }
    }

    public rotate(): void {
        if (this.isRed() && this.parent().isPresent() && this.parent().get().isRed()) {
            let grandparent: Optional<RedBlackNode<E>> = this.parent().get().parent();
            if (validate(grandparent) && grandparent.isPresent()) {
                if (this.parent().get() === grandparent.get().left.get()) {
                    grandparent.get().rotateRight();
                } else {
                    grandparent.get().rotateLeft();
                }
            }
        }
    }

    public rotateLeft(): RedBlackNode<E> {
        if (validate(this.right) && this.right.isPresent()) {
            let newRoot = this.right.get();
            this.linkRight(newRoot);

            let parent: Optional<RedBlackNode<E>> = this.parent();
            if (validate(parent) && parent.isPresent()) {
                if (this.isLeftChild()) {
                    parent.get().linkLeft(newRoot);
                }
                if (this.isRightChild()) {
                    parent.get().linkRight(newRoot);
                }
            }
            newRoot.linkLeft(this);
            return newRoot;
        }

        return this;
    }

    public rotateRight(): RedBlackNode<E> {
        if (validate(this.left) && this.left.isPresent()) {
            let newRoot = this.left.get();
            this.linkLeft(newRoot);

            let parent: Optional<RedBlackNode<E>> = this.parent();
            if (validate(parent) && parent.isPresent()) {
                if (this.isLeftChild()) {
                    parent.get().linkLeft(newRoot);
                }
                if (this.isRightChild()) {
                    parent.get().linkRight(newRoot);
                }
            }
            newRoot.linkRight(this);
            return newRoot;
        }

        return this;
    }

    public fix(): void {
        let current: RedBlackNode<E> = this;
        let parent: Optional<RedBlackNode<E>> = current.parent();
        let grandparent: Optional<RedBlackNode<E>> = Optional.empty();
        let uncle: Optional<RedBlackNode<E>> = Optional.empty();

        while (parent.isPresent() && parent.get().isRed()) {
            grandparent = parent.get().parent();
            if (grandparent.isEmpty()) {
                break;
            }
            if (parent.get().isLeftChild()) {
                uncle = grandparent.get().right;

                if (uncle.isPresent() && uncle.get().isRed()) {
                    parent.get().turnBlack();
                    uncle.get().turnBlack();
                    grandparent.get().turnRed();
                    current = grandparent.get();
                } else {
                    if (current === parent.get().right.orElse(null)) {
                        current = parent.get();
                        current.rotateLeft();
                        parent = current.parent();
                    }
                    parent.get().turnBlack();
                    grandparent.get().turnRed();
                    grandparent.get().rotateRight();
                }
            } else {
                uncle = grandparent.get().left;

                if (uncle.isPresent() && uncle.get().isRed()) {
                    parent.get().turnBlack();
                    uncle.get().turnBlack();
                    grandparent.get().turnRed();
                    current = grandparent.get();
                } else {
                    if (current === parent.get().left.orElse(null)) {
                        current = parent.get();
                        current.rotateRight();
                        parent = current.parent();
                    }

                    parent.get().turnBlack();
                    grandparent.get().turnRed();
                    grandparent.get().rotateLeft();
                }
            }

            parent = current.parent();
        }

        let root: RedBlackNode<E> = current.root();
        root.turnBlack();
    }

    public uncle(): Optional<RedBlackNode<E>> {
        let parent: Optional<RedBlackNode<E>> = this.parent();
        if (invalidate(parent) || parent.isEmpty()) {
            return Optional.empty();
        }
        let grandparent: Optional<RedBlackNode<E>> = parent.get().parent();
        if (invalidate(grandparent) || grandparent.isEmpty()) {
            return Optional.empty();
        }

        return parent.flat((value: RedBlackNode<E>): Optional<RedBlackNode<E>> => {
            if (value.isLeftChild()) {
                return grandparent.get().right;
            }
            return grandparent.get().left;
        });
    }

    public findMinimum(): RedBlackNode<E> {
        let current: RedBlackNode<E> = this;
        while (current.left.isPresent()) {
            current = current.left.get();
        }
        return current;
    }

    public findMaximum(): RedBlackNode<E> {
        let current: RedBlackNode<E> = this;
        while (current.right.isPresent()) {
            current = current.right.get();
        }
        return current;
    }
};

export class AverageLevelNode<E> extends BinaryNode<E, AverageLevelNode<E>> {

    public constructor(element: E);
    public constructor(element: E, ancestor: Optional<AverageLevelNode<E>>, left: Optional<AverageLevelNode<E>>, right: Optional<AverageLevelNode<E>>);
    public constructor(element: E, ancestor?: Optional<AverageLevelNode<E>>, left?: Optional<AverageLevelNode<E>>, right?: Optional<AverageLevelNode<E>>) {
        super(element, ancestor || Optional.empty(), left || Optional.empty(), right || Optional.empty());
    }


    public *[Symbol.iterator](): Iterator<AverageLevelNode<E>> {
        yield* this.preorder();
    }

    public override identity(): AverageLevelNode<E> {
        return this;
    }

    public getElement(): Optional<E> {
        return validate(this.element) ? this.element : Optional.empty();
    }

    public setElement(element: E): void {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }

    public getLeft(): Optional<AverageLevelNode<E>> {
        return validate(this.left) ? this.left : Optional.empty();
    }

    public getRight(): Optional<AverageLevelNode<E>> {
        return validate(this.right) ? this.right : Optional.empty();
    }
};

export class BinarySearchNode<E> extends AbstractNode<E, BinarySearchNode<E>> {

    protected left: Optional<BinarySearchNode<E>>;
    protected right: Optional<BinarySearchNode<E>>;
    protected element: Optional<E>;

    public constructor(element: E);
    public constructor(element: E, left: Optional<BinarySearchNode<E>>, right: Optional<BinarySearchNode<E>>);
    public constructor(element: E, left?: Optional<BinarySearchNode<E>>, right?: Optional<BinarySearchNode<E>>) {
        super();
        this.left = left || Optional.empty();
        this.right = right || Optional.empty();
        this.element = Optional.of(element);
    }

    public *ancestors(): Iterable<BinarySearchNode<E>> {
        let parent: Optional<BinarySearchNode<E>> = this.parent();
        if (parent.isPresent()) {
            yield parent.get();
            yield* parent.get().ancestors();
        }
    }

    public *descendants(): Iterable<BinarySearchNode<E>> {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
            yield* this.left.get().descendants();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
            yield* this.right.get().descendants();
        }
    }

    public root(): BinarySearchNode<E> {
        let parent: Optional<BinarySearchNode<E>> = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this;
    }

    public *siblings(): Iterable<BinarySearchNode<E>> {
        let parent: Optional<BinarySearchNode<E>> = this.parent();
        if (parent.isPresent()) {
            let siblings: Array<BinarySearchNode<E>> = Array.from(parent.get().children());
            let index: number = siblings.indexOf(this as unknown as BinarySearchNode<E>);
            if (index > 0) {
                yield siblings[index - 1];
            }
            if (index < siblings.length - 1) {
                yield siblings[index + 1];
            }
        }
    }

    public *children(): Iterable<BinarySearchNode<E>> {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
            yield* this.left.get().children();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
            yield* this.right.get().children();
        }
    }

    public parent(): Optional<BinarySearchNode<E>> {
        return Optional.empty();
    }

    public *[Symbol.iterator](): Iterator<BinarySearchNode<E>> {
        yield* this.inorder();
    }

    public *inorder(): Generator<BinarySearchNode<E>> {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().inorder();
        }
        yield this;
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().inorder();
        }
    }

    public *preorder(): Generator<BinarySearchNode<E>> {
        yield this;
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().preorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().preorder();
        }
    }

    public *postorder(): Generator<BinarySearchNode<E>> {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().postorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().postorder();
        }
        yield this;
    }

    public *breadthfirst(): Generator<BinarySearchNode<E>> {
        let queue: Array<BinarySearchNode<E>> = [this];
        while (queue.length > 0) {
            let node: BinarySearchNode<E> = queue.shift() as BinarySearchNode<E>;
            yield node;
            if (validate(node.left) && node.left.isPresent()) {
                queue.push(node.left.get());
            }
            if (validate(node.right) && node.right.isPresent()) {
                queue.push(node.right.get());
            }
        }
    }

    public getElement(): Optional<E> {
        return validate(this.element) ? this.element : Optional.empty();
    }

    public setElement(element: E): void {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }

    public getLeft(): Optional<BinarySearchNode<E>> {
        return validate(this.left) ? this.left : Optional.empty();
    }

    public getRight(): Optional<BinarySearchNode<E>> {
        return validate(this.right) ? this.right : Optional.empty();
    }
};