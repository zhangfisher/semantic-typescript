import { isFunction, isRedBlackNode } from './guard';
import { useCompare } from './hook';
import { BinaryNode, RedBlackNode, type Node } from './node'
import { Optional } from './optional';
import { BinaryTreeSymbol, TreeSymbol } from './symbol';
import { validate, type Comparator } from './utility';
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

export abstract class AbstractTree<E, N extends Node<E, N>, T extends Tree<E, N, T>> implements Tree<E, N, T> {

    protected readonly Tree: symbol = TreeSymbol;

    protected internal: bigint = 0n;

    public constructor() {

    }

    public abstract root(): Optional<N>;

    public isEmpty(): boolean {
        return this.root().isEmpty();
    }

    public size(): bigint {
        return this.internal;
    }

    public abstract add(value: E): void;

    public abstract remove(value: E): void;

    public contains(value: E): boolean {
        return this.find(value).isPresent();
    }

    public abstract find(value: E): Optional<N>;

    public abstract preorder(): Generator<E>;

    public abstract inorder(): Generator<E>;

    public abstract postorder(): Generator<E>;

    public abstract breadth(): Generator<E>;

    public toArray(): Array<E> {
        return Array.from(this.preorder());
    }

    public toSet(): Set<E> {
        return new Set(this.preorder());
    }

    public abstract sub(node: N): T;

    public abstract prune(node: Node<E, N>): T;

    public abstract merge(other: T): T;

    public height(): bigint {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().height();
        }
        return 0n;
    }

    public width(): bigint {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().width();
        }
        return 0n;
    }

    public depth(): bigint {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().depth();
        }
        return 0n;
    }

    public level(): bigint {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().level();
        }
        return 0n;
    }

    public abstract [Symbol.iterator](): Iterator<E>;
};

export abstract class BinaryTree<E, N extends BinaryNode<E, N>, T extends BinaryTree<E, N, T>> extends AbstractTree<E, N, T> {

    protected readonly BinaryTree: symbol = BinaryTreeSymbol;

    protected first: Optional<N>;
    public constructor();
    public constructor(root: Optional<N>);
    public constructor(root: Optional<N> = Optional.empty<N>()) {
        super();
        this.first = root;
    }

    public override root(): Optional<N> {
        return this.first;
    }

    public override find(value: E): Optional<N> {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            for (let node of root.get().preorder()) {
                if (node.getElement() === value || Object.is(node.getElement(), value)) {
                    return Optional.of(node);
                }
            }
        }
        return Optional.empty<N>();
    }

    public override *preorder(): Generator<E> {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            for (let node of root.get().preorder()) {
                let element: Optional<E> = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
            }
        }
    }

    public override *inorder(): Generator<E> {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            for (let node of root.get().inorder()) {
                let element: Optional<E> = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
            }
        }
    }

    public override *postorder(): Generator<E> {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            for (let node of root.get().postorder()) {
                let element: Optional<E> = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
            }
        }
    }

    public isBalanced(): boolean {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().isBanlanced();
        }
        return false;
    }

    public isComplete(): boolean {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().isComplete();
        }
        return false;
    }

    public isFull(): boolean {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().isFull();
        }
        return false;
    }

    public isPerfect(): boolean {
        let root: Optional<N> = this.root();
        if (root.isPresent()) {
            return root.get().isPerfect();
        }
        return false;
    }

    public override *[Symbol.iterator](): Iterator<E> {
        yield* this.preorder();
    }
};

export class RedBlackTree<E> extends BinaryTree<E, RedBlackNode<E>, RedBlackTree<E>> {

    protected readonly RedBlackTree: symbol = Symbol("RedBlackTree");

    protected comparator: Comparator<E>;

    public constructor();
    public constructor(root: Optional<RedBlackNode<E>>);
    public constructor(comparator: Comparator<E>);
    public constructor(root: Optional<RedBlackNode<E>>, comparator: Comparator<E>);
    public constructor(argument1?: Optional<RedBlackNode<E>> | Comparator<E>, argument2?: Comparator<E>) {
        if(isFunction(argument1)){
            super();
            this.comparator = argument1;
        }else if(isRedBlackNode(argument1)){
            super(argument1);
            if(isFunction(argument2)){
                this.comparator = argument2;
            }else{
                this.comparator = useCompare;
            }
        }else{
            throw new TypeError("Invalid arguments.");
        }
    }

    public override add(value: E): void {
        let node: RedBlackNode<E> = new RedBlackNode(value);
        if (this.first.isEmpty()) {
            this.first = Optional.of(node);
        } else {
            this.first.get().compareAndLink(node);
        }
        this.internal++;
    }

    public override remove(value: E): void {
        let node: Optional<RedBlackNode<E>> = this.find(value);
        if (node.isPresent()) {
            node.get().detach();
            node.get().fix();
            this.internal--;
        }
    }

    public override *breadth(): Generator<E> {
        let root: Optional<RedBlackNode<E>> = this.root();
        if (root.isPresent()) {
            let queue: Array<RedBlackNode<E>> = [root.get()];
            while (queue.length > 0) {
                let node: RedBlackNode<E> = queue.shift()!;
                let element: Optional<E> = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
                if (validate(node.getLeft()) && node.getRight().isPresent()) {
                    queue.push(node.getLeft().get());
                }
                if (validate(node.getLeft()) && node.getLeft().isPresent()) {
                    queue.push(node.getLeft().get());
                }
            }
        }
    }

    public sub(node: RedBlackNode<E>): RedBlackTree<E> {
        return new RedBlackTree(Optional.of(node));
    }

    public prune(node: Node<E, RedBlackNode<E>>): RedBlackTree<E> {
        let tree: RedBlackTree<E> = new RedBlackTree();
        let queue: Array<RedBlackNode<E>> = [node as RedBlackNode<E>];
        while (queue.length > 0) {
            let node: RedBlackNode<E> = queue.shift()!;
            let element: Optional<E> = node.getElement();
            if (validate(element) && element.isPresent()) {
                tree.add(element.get());
            }
            if (validate(node.getLeft()) && node.getLeft().isPresent()) {
                queue.push(node.getLeft().get());
            }
            if (validate(node.getRight()) && node.getRight().isPresent()) {
                queue.push(node.getRight().get());
            }
            return tree;
        }
        return tree;
    }

    public merge(other: RedBlackTree<E>): RedBlackTree<E> {
        let tree: RedBlackTree<E> = new RedBlackTree();
        let queue: Array<RedBlackNode<E>> = [this.root().get()];
        while (queue.length > 0) {
            let node: RedBlackNode<E> = queue.shift()!;
            let element: Optional<E> = node.getElement();
            if (validate(element) && element.isPresent()) {
                tree.add(element.get());
            }
            if (validate(node.getLeft()) && node.getLeft().isPresent()) {
                queue.push(node.getLeft().get());
            }
            if (validate(node.getRight()) && node.getRight().isPresent()) {
                queue.push(node.getRight().get());
            }
        }
        queue = [other.root().get()];
        while (queue.length > 0) {
            let node: RedBlackNode<E> = queue.shift()!;
            let element: Optional<E> = node.getElement();
            if (validate(element) && element.isPresent()) {
                tree.add(element.get());
            }
            if (validate(node.getLeft()) && node.getLeft().isPresent()) {
                queue.push(node.getLeft().get());
            }
            if (validate(node.getRight()) && node.getRight().isPresent()) {
                queue.push(node.getRight().get());
            }
        }
        return tree;
    }
};
