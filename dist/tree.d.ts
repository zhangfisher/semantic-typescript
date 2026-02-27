import { BinaryNode, RedBlackNode, type Node } from './node';
import { Optional } from './optional';
import { type Comparator } from './utility';
export interface Tree<E, N extends Node<E, N>, T extends Tree<E, N, T>> extends Iterable<E> {
    root(): Optional<N>;
    isEmpty(): boolean;
    size(): bigint;
    height(): bigint;
    depth(): bigint;
    width(): bigint;
    level(): bigint;
    add(value: E): void;
    remove(value: E): void;
    contains(value: E): boolean;
    find(value: E): Optional<N>;
    preorder(): Generator<E>;
    inorder(): Generator<E>;
    postorder(): Generator<E>;
    breadth(): Generator<E>;
    toArray(): Array<E>;
    toSet(): Set<E>;
    sub(node: N): T;
    prune(node: Node<E, N>): T;
    merge(other: T): T;
    [Symbol.iterator](): Iterator<E>;
}
export declare abstract class AbstractTree<E, N extends Node<E, N>, T extends Tree<E, N, T>> implements Tree<E, N, T> {
    protected readonly Tree: symbol;
    protected internal: bigint;
    constructor();
    abstract root(): Optional<N>;
    isEmpty(): boolean;
    size(): bigint;
    abstract add(value: E): void;
    abstract remove(value: E): void;
    contains(value: E): boolean;
    abstract find(value: E): Optional<N>;
    abstract preorder(): Generator<E>;
    abstract inorder(): Generator<E>;
    abstract postorder(): Generator<E>;
    abstract breadth(): Generator<E>;
    toArray(): Array<E>;
    toSet(): Set<E>;
    abstract sub(node: N): T;
    abstract prune(node: Node<E, N>): T;
    abstract merge(other: T): T;
    height(): bigint;
    width(): bigint;
    depth(): bigint;
    level(): bigint;
    abstract [Symbol.iterator](): Iterator<E>;
}
export declare abstract class BinaryTree<E, N extends BinaryNode<E, N>, T extends BinaryTree<E, N, T>> extends AbstractTree<E, N, T> {
    protected readonly BinaryTree: symbol;
    protected first: Optional<N>;
    constructor();
    constructor(root: Optional<N>);
    root(): Optional<N>;
    find(value: E): Optional<N>;
    preorder(): Generator<E>;
    inorder(): Generator<E>;
    postorder(): Generator<E>;
    isBalanced(): boolean;
    isComplete(): boolean;
    isFull(): boolean;
    isPerfect(): boolean;
    [Symbol.iterator](): Iterator<E>;
}
export declare class RedBlackTree<E> extends BinaryTree<E, RedBlackNode<E>, RedBlackTree<E>> {
    protected readonly RedBlackTree: symbol;
    protected comparator: Comparator<E>;
    constructor();
    constructor(root: Optional<RedBlackNode<E>>);
    constructor(comparator: Comparator<E>);
    constructor(root: Optional<RedBlackNode<E>>, comparator: Comparator<E>);
    add(value: E): void;
    remove(value: E): void;
    breadth(): Generator<E>;
    sub(node: RedBlackNode<E>): RedBlackTree<E>;
    prune(node: Node<E, RedBlackNode<E>>): RedBlackTree<E>;
    merge(other: RedBlackTree<E>): RedBlackTree<E>;
}
