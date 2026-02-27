import { isFunction, isRedBlackNode } from './guard';
import { useCompare } from './hook';
import { BinaryNode, RedBlackNode } from './node';
import { Optional } from './optional';
import { BinaryTreeSymbol, TreeSymbol } from './symbol';
import { validate } from './utility';
export class AbstractTree {
    Tree = TreeSymbol;
    internal = 0n;
    constructor() {
    }
    isEmpty() {
        return this.root().isEmpty();
    }
    size() {
        return this.internal;
    }
    contains(value) {
        return this.find(value).isPresent();
    }
    toArray() {
        return Array.from(this.preorder());
    }
    toSet() {
        return new Set(this.preorder());
    }
    height() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().height();
        }
        return 0n;
    }
    width() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().width();
        }
        return 0n;
    }
    depth() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().depth();
        }
        return 0n;
    }
    level() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().level();
        }
        return 0n;
    }
}
;
export class BinaryTree extends AbstractTree {
    BinaryTree = BinaryTreeSymbol;
    first;
    constructor(root = Optional.empty()) {
        super();
        this.first = root;
    }
    root() {
        return this.first;
    }
    find(value) {
        let root = this.root();
        if (root.isPresent()) {
            for (let node of root.get().preorder()) {
                if (node.getElement() === value || Object.is(node.getElement(), value)) {
                    return Optional.of(node);
                }
            }
        }
        return Optional.empty();
    }
    *preorder() {
        let root = this.root();
        if (root.isPresent()) {
            for (let node of root.get().preorder()) {
                let element = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
            }
        }
    }
    *inorder() {
        let root = this.root();
        if (root.isPresent()) {
            for (let node of root.get().inorder()) {
                let element = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
            }
        }
    }
    *postorder() {
        let root = this.root();
        if (root.isPresent()) {
            for (let node of root.get().postorder()) {
                let element = node.getElement();
                if (validate(element) && element.isPresent()) {
                    yield element.get();
                }
            }
        }
    }
    isBalanced() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().isBanlanced();
        }
        return false;
    }
    isComplete() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().isComplete();
        }
        return false;
    }
    isFull() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().isFull();
        }
        return false;
    }
    isPerfect() {
        let root = this.root();
        if (root.isPresent()) {
            return root.get().isPerfect();
        }
        return false;
    }
    *[Symbol.iterator]() {
        yield* this.preorder();
    }
}
;
export class RedBlackTree extends BinaryTree {
    RedBlackTree = Symbol("RedBlackTree");
    comparator;
    constructor(argument1, argument2) {
        if (isFunction(argument1)) {
            super();
            this.comparator = argument1;
        }
        else if (isRedBlackNode(argument1)) {
            super(argument1);
            if (isFunction(argument2)) {
                this.comparator = argument2;
            }
            else {
                this.comparator = useCompare;
            }
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
    add(value) {
        let node = new RedBlackNode(value);
        if (this.first.isEmpty()) {
            this.first = Optional.of(node);
        }
        else {
            this.first.get().compareAndLink(node);
        }
        this.internal++;
    }
    remove(value) {
        let node = this.find(value);
        if (node.isPresent()) {
            node.get().detach();
            node.get().fix();
            this.internal--;
        }
    }
    *breadth() {
        let root = this.root();
        if (root.isPresent()) {
            let queue = [root.get()];
            while (queue.length > 0) {
                let node = queue.shift();
                let element = node.getElement();
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
    sub(node) {
        return new RedBlackTree(Optional.of(node));
    }
    prune(node) {
        let tree = new RedBlackTree();
        let queue = [node];
        while (queue.length > 0) {
            let node = queue.shift();
            let element = node.getElement();
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
    merge(other) {
        let tree = new RedBlackTree();
        let queue = [this.root().get()];
        while (queue.length > 0) {
            let node = queue.shift();
            let element = node.getElement();
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
            let node = queue.shift();
            let element = node.getElement();
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
}
;
