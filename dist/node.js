import { isObject, isOptional } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { LinearNodeSymbol, NodeSymbol, RedBlackNodeSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
;
export class AbstractNode {
    Node = NodeSymbol;
    constructor() {
    }
    *ancestors() {
        let parent = this.parent();
        if (parent.isPresent()) {
            let value = parent.get();
            yield value;
            yield* value.ancestors();
        }
    }
    *descendants() {
        for (let child of this.children()) {
            yield child;
            yield* child.descendants();
        }
    }
    root() {
        let parent = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this;
    }
    *siblings() {
        let parent = this.parent();
        if (parent.isPresent()) {
            for (let sibling of parent.get().children()) {
                if (sibling !== this && !Object.is(sibling, this)) {
                    yield sibling;
                }
            }
        }
    }
    previousSibling() {
        let parent = this.parent();
        if (parent.isPresent()) {
            let siblings = Array.from(parent.get().children());
            let index = siblings.indexOf(this);
            if (index > 0) {
                return Optional.of(siblings[index - 1]);
            }
        }
        return Optional.empty();
    }
    nextSibling() {
        let parent = this.parent();
        if (parent.isPresent()) {
            let siblings = Array.from(parent.get().children());
            let index = siblings.indexOf(this);
            if (index < siblings.length - 1) {
                return Optional.of(siblings[index + 1]);
            }
        }
        return Optional.empty();
    }
    *preorder() {
        yield this;
        for (let child of this.children()) {
            yield* child.preorder();
        }
    }
    *inorder() {
        let children = Array.from(this.children());
        let middle = Math.floor(children.length / 2);
        if (children.length > 0) {
            for (let index = 0; index < middle; index++) {
                yield* children[index].inorder();
            }
        }
        yield this;
        for (let index = middle; index < children.length; index++) {
            yield* children[index].inorder();
        }
    }
    *postorder() {
        for (let child of this.children()) {
            yield* child.postorder();
        }
        yield this;
    }
    *breadthfirst() {
        let queue = [this];
        while (queue.length > 0) {
            let node = queue.shift();
            yield node;
            for (let child of node.children()) {
                queue.push(child);
            }
        }
    }
    *[Symbol.iterator]() {
        yield* this.preorder();
    }
    depth() {
        let parent = this.parent();
        return parent.isPresent() ? 1n + parent.get().depth() : 0n;
    }
    height() {
        if (this.isLeaf()) {
            return -1n;
        }
        return [...this.children()].reduce((maximum, child) => {
            if (maximum < child.height()) {
                return child.height() + 1n;
            }
            return maximum + 1n;
        }, 0n);
    }
    width() {
        if (this.isLeaf()) {
            return 0n;
        }
        return [...this.children()].reduce((sum, child) => {
            return sum + child.width() + 1n;
        }, 0n);
    }
    level() {
        let parent = this.parent();
        if (parent.isPresent()) {
            return parent.get().level() + 1n;
        }
        return 0n;
    }
    isLeaf() {
        return [...this.children()].length === 0;
    }
    isRoot() {
        return this.parent().isEmpty();
    }
}
;
export class LinearNode extends AbstractNode {
    previous;
    next;
    element;
    LinearNode = LinearNodeSymbol;
    constructor(element, previous, next) {
        super();
        this.element = Optional.of(element);
        this.previous = previous || Optional.empty();
        this.next = next || Optional.empty();
    }
    *ancestors() {
        let parent = this.parent();
        if (parent.isPresent()) {
            yield parent.get();
            yield* parent.get().ancestors();
        }
    }
    *descendants() {
        if (validate(this.next) && this.next.isPresent()) {
            yield this.next.get();
            yield* this.next.get().descendants();
        }
    }
    root() {
        let parent = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this;
    }
    *siblings() {
        let root = this.root();
        if (validate(root)) {
            yield root;
            let next = this.nextSibling();
            if (validate(next) && next.isPresent()) {
                yield* next.get().siblings();
            }
        }
    }
    *children() {
        if (validate(this.next) && this.next.isPresent()) {
            yield this.next.get();
            yield* this.next.get().children();
        }
    }
    parent() {
        return validate(this.previous) ? this.previous : Optional.empty();
    }
    *[Symbol.iterator]() {
        let root = this.root();
        if (validate(root)) {
            yield root;
        }
        while (validate(root) && validate(root.next) && root.next.isPresent()) {
            root = root.next.get();
            yield root;
        }
    }
    getElement() {
        return validate(this.element) ? this.element : Optional.empty();
    }
    setElement(element) {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }
    getPrevious() {
        return validate(this.previous) ? this.previous : Optional.empty();
    }
    setPrevious(previous) {
        if (validate(previous)) {
            if (isOptional(previous)) {
                this.previous = previous;
            }
            else if (isObject(previous)) {
                this.previous = Optional.of(previous);
            }
        }
    }
    getNext() {
        return validate(this.next) ? this.next : Optional.empty();
    }
    setNext(next) {
        if (validate(next)) {
            if (isOptional(next)) {
                this.next = next;
            }
            else if (isObject(next)) {
                this.next = Optional.of(next);
            }
        }
    }
    linkPrevious(previous) {
        if (validate(previous)) {
            this.setPrevious(previous);
            previous.setNext(this);
        }
    }
    unlinkPrevious() {
        if (validate(this.previous) && this.previous.isPresent()) {
            if (validate(this.next) && this.next.isPresent()) {
                this.previous.get().setNext(this.next.get());
            }
            else {
                this.previous.get().setNext(Optional.empty());
            }
        }
    }
    linkNext(next) {
        if (validate(next)) {
            this.setNext(next);
            next.setPrevious(this);
        }
    }
    unlinkNext() {
        if (validate(this.next) && this.next.isPresent()) {
            if (validate(this.previous) && this.previous.isPresent()) {
                this.next.get().setPrevious(this.previous.get());
            }
            else {
                this.next.get().setPrevious(Optional.empty());
            }
        }
    }
}
;
export class BinaryNode extends AbstractNode {
    BinaryNode = Symbol("BinaryNode");
    ancestor;
    left;
    right;
    element;
    constructor(element, ancestor, left, right) {
        super();
        this.element = Optional.of(element);
        this.ancestor = ancestor || Optional.empty();
        this.left = left || Optional.empty();
        this.right = right || Optional.empty();
    }
    *ancestors() {
        let parent = this.parent();
        if (parent.isPresent()) {
            yield parent.get();
            yield* parent.get().ancestors();
        }
    }
    compare(other, comparator) {
        if (invalidate(this.element)) {
            if (invalidate(other) || invalidate(other.element)) {
                return 0n;
            }
            return -1n;
        }
        if (this.element.isPresent()) {
            comparator = comparator || useCompare;
            if (validate(other.element) && other.element.isPresent()) {
                return BigInt(comparator(this.element.get(), other.element.get()));
            }
            else {
                return 1n;
            }
        }
        return -1n;
    }
    *descendants() {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
            yield* this.left.get().descendants();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
            yield* this.right.get().descendants();
        }
    }
    root() {
        let parent = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this.identity();
    }
    *siblings() {
        let parent = this.parent();
        if (parent.isPresent()) {
            let siblings = Array.from(parent.get().children());
            let index = siblings.indexOf(this);
            if (index > 0) {
                yield siblings[index - 1];
            }
            if (index < siblings.length - 1) {
                yield siblings[index + 1];
            }
        }
    }
    *children() {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
        }
    }
    parent() {
        return validate(this.parent) ? this.ancestor : Optional.empty();
    }
    *[Symbol.iterator]() {
        yield* this.preorder();
    }
    *preorder() {
        yield this;
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().preorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().preorder();
        }
    }
    *inorder() {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().inorder();
        }
        yield this;
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().inorder();
        }
    }
    *postorder() {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().postorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().postorder();
        }
        yield this.identity();
    }
    *breadthfirst() {
        let queue = [this.identity()];
        while (queue.length > 0) {
            let node = queue.shift();
            yield node;
            if (validate(node.left) && node.left.isPresent()) {
                queue.push(node.left.get());
            }
            if (validate(node.right) && node.right.isPresent()) {
                queue.push(node.right.get());
            }
        }
    }
    getElement() {
        return validate(this.element) ? this.element : Optional.empty();
    }
    setElement(element) {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }
    getLeft() {
        return validate(this.left) ? this.left : Optional.empty();
    }
    setLeft(left) {
        if (validate(left)) {
            if (isOptional(left)) {
                this.left = left;
            }
            else if (isObject(left)) {
                this.left = Optional.of(left);
            }
        }
    }
    getRight() {
        return validate(this.right) ? this.right : Optional.empty();
    }
    setRight(right) {
        if (validate(right)) {
            if (isOptional(right)) {
                this.right = right;
            }
            else if (isObject(right)) {
                this.right = Optional.of(right);
            }
        }
    }
    getAncestor() {
        return validate(this.ancestor) ? this.ancestor : Optional.empty();
    }
    setAncestor(ancestor) {
        if (validate(ancestor)) {
            if (isOptional(ancestor)) {
                this.ancestor = ancestor;
            }
            else if (isObject(ancestor)) {
                this.ancestor = Optional.of(ancestor);
            }
        }
    }
    linkLeft(left) {
        if (validate(left)) {
            this.setLeft(left);
            left.setAncestor(this);
        }
    }
    unlinkLeft() {
        if (validate(this.left) && this.left.isPresent()) {
            let left = this.left;
            if (validate(left) && left.isPresent()) {
                left.get().setAncestor(Optional.empty());
            }
            return left;
        }
        this.left = Optional.empty();
        return this.left;
    }
    linkRight(right) {
        if (validate(right)) {
            this.setRight(right);
            right.setAncestor(this);
        }
    }
    unlinkRight() {
        if (validate(this.right) && this.right.isPresent()) {
            let right = this.right;
            if (validate(right) && right.isPresent()) {
                right.get().setAncestor(Optional.empty());
            }
            return right;
        }
        this.right = Optional.empty();
        return this.right;
    }
    isLeftChild() {
        if (validate(this.ancestor)) {
            return this.ancestor.map((parent) => {
                let left = parent.getLeft();
                if (validate(left) && left.isPresent()) {
                    return (left.get() === this) || Object.is(left, this);
                }
                return false;
            }).get(false);
        }
        return false;
    }
    isRightChild() {
        if (validate(this.ancestor)) {
            return this.ancestor.map((parent) => {
                let right = parent.getRight();
                if (validate(right) && right.isPresent()) {
                    return (right.get() === this) || Object.is(right, this);
                }
                return false;
            }).get(false);
        }
        return false;
    }
    detach() {
        let parent = this.parent();
        if (parent.isPresent()) {
            if (this.isLeftChild()) {
                parent.get().unlinkLeft();
            }
            if (this.isRightChild()) {
                parent.get().unlinkRight();
            }
        }
    }
    isBanlanced() {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().height() === this.right.get().height();
        }
        return false;
    }
    isFull() {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().isFull() && this.right.get().isFull();
        }
        return false;
    }
    isComplete() {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().isComplete() && this.right.get().isComplete();
        }
        return false;
    }
    isPerfect() {
        if (this.isLeaf()) {
            return true;
        }
        if (this.left.isPresent() && this.right.isPresent()) {
            return this.left.get().isPerfect() && this.right.get().isPerfect();
        }
        return false;
    }
    invert(deep = false) {
        if (deep === true) {
            if (validate(this.left) && this.left.isPresent()) {
                this.left.get().invert(deep);
            }
            if (validate(this.right) && this.right.isPresent()) {
                this.right.get().invert(deep);
            }
        }
        else {
            let left = this.left;
            let right = this.right;
            this.left = right;
            this.right = left;
        }
    }
}
;
export class RedBlackNode extends BinaryNode {
    RedBlackNode = RedBlackNodeSymbol;
    color;
    constructor(element, color = "RED", ancestor, left, right) {
        super(element, ancestor || Optional.empty(), left || Optional.empty(), right || Optional.empty());
        this.color = color;
    }
    identity() {
        return this;
    }
    getElement() {
        return validate(this.element) ? this.element : Optional.empty();
    }
    setElement(element) {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }
    getLeft() {
        return validate(this.left) ? this.left : Optional.empty();
    }
    getRight() {
        return validate(this.right) ? this.right : Optional.empty();
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    isRed() {
        return this.color === "RED";
    }
    isBlack() {
        return this.color === "BLACK";
    }
    turnRed() {
        this.color = "RED";
    }
    turnBlack() {
        this.color = "BLACK";
    }
    toggle() {
        if (this.isRed()) {
            this.turnBlack();
        }
        else {
            this.turnRed();
        }
    }
    compareAndLink(other, comparator) {
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
                if (validate(this.left) && this.left.isPresent()) {
                    this.left.get().compareAndLink(other, comparator);
                }
                else {
                    this.linkLeft(other);
                    this.fix();
                }
            }
            else {
                if (validate(this.right) && this.right.isPresent()) {
                    this.right.get().compareAndLink(other, comparator);
                }
                else {
                    this.linkRight(other);
                    this.fix();
                }
            }
        }
    }
    rotate() {
        if (this.isRed() && this.parent().isPresent() && this.parent().get().isRed()) {
            let grandparent = this.parent().get().parent();
            if (validate(grandparent) && grandparent.isPresent()) {
                if (this.parent().get() === grandparent.get().left.get()) {
                    grandparent.get().rotateRight();
                }
                else {
                    grandparent.get().rotateLeft();
                }
            }
        }
    }
    rotateLeft() {
        if (validate(this.right) && this.right.isPresent()) {
            let newRoot = this.right.get();
            this.linkRight(newRoot);
            let parent = this.parent();
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
    rotateRight() {
        if (validate(this.left) && this.left.isPresent()) {
            let newRoot = this.left.get();
            this.linkLeft(newRoot);
            let parent = this.parent();
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
    fix() {
        let current = this;
        let parent = current.parent();
        let grandparent = Optional.empty();
        let uncle = Optional.empty();
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
                }
                else {
                    if (current === parent.get().right.orElse(null)) {
                        current = parent.get();
                        current.rotateLeft();
                        parent = current.parent();
                    }
                    parent.get().turnBlack();
                    grandparent.get().turnRed();
                    grandparent.get().rotateRight();
                }
            }
            else {
                uncle = grandparent.get().left;
                if (uncle.isPresent() && uncle.get().isRed()) {
                    parent.get().turnBlack();
                    uncle.get().turnBlack();
                    grandparent.get().turnRed();
                    current = grandparent.get();
                }
                else {
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
        let root = current.root();
        root.turnBlack();
    }
    uncle() {
        let parent = this.parent();
        if (invalidate(parent) || parent.isEmpty()) {
            return Optional.empty();
        }
        let grandparent = parent.get().parent();
        if (invalidate(grandparent) || grandparent.isEmpty()) {
            return Optional.empty();
        }
        return parent.flat((value) => {
            if (value.isLeftChild()) {
                return grandparent.get().right;
            }
            return grandparent.get().left;
        });
    }
    findMinimum() {
        let current = this;
        while (current.left.isPresent()) {
            current = current.left.get();
        }
        return current;
    }
    findMaximum() {
        let current = this;
        while (current.right.isPresent()) {
            current = current.right.get();
        }
        return current;
    }
}
;
export class AverageLevelNode extends BinaryNode {
    constructor(element, ancestor, left, right) {
        super(element, ancestor || Optional.empty(), left || Optional.empty(), right || Optional.empty());
    }
    *[Symbol.iterator]() {
        yield* this.preorder();
    }
    identity() {
        return this;
    }
    getElement() {
        return validate(this.element) ? this.element : Optional.empty();
    }
    setElement(element) {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }
    getLeft() {
        return validate(this.left) ? this.left : Optional.empty();
    }
    getRight() {
        return validate(this.right) ? this.right : Optional.empty();
    }
}
;
export class BinarySearchNode extends AbstractNode {
    left;
    right;
    element;
    constructor(element, left, right) {
        super();
        this.left = left || Optional.empty();
        this.right = right || Optional.empty();
        this.element = Optional.of(element);
    }
    *ancestors() {
        let parent = this.parent();
        if (parent.isPresent()) {
            yield parent.get();
            yield* parent.get().ancestors();
        }
    }
    *descendants() {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
            yield* this.left.get().descendants();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
            yield* this.right.get().descendants();
        }
    }
    root() {
        let parent = this.parent();
        if (parent.isPresent()) {
            return parent.get().root();
        }
        return this;
    }
    *siblings() {
        let parent = this.parent();
        if (parent.isPresent()) {
            let siblings = Array.from(parent.get().children());
            let index = siblings.indexOf(this);
            if (index > 0) {
                yield siblings[index - 1];
            }
            if (index < siblings.length - 1) {
                yield siblings[index + 1];
            }
        }
    }
    *children() {
        if (validate(this.left) && this.left.isPresent()) {
            yield this.left.get();
            yield* this.left.get().children();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield this.right.get();
            yield* this.right.get().children();
        }
    }
    parent() {
        return Optional.empty();
    }
    *[Symbol.iterator]() {
        yield* this.inorder();
    }
    *inorder() {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().inorder();
        }
        yield this;
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().inorder();
        }
    }
    *preorder() {
        yield this;
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().preorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().preorder();
        }
    }
    *postorder() {
        if (validate(this.left) && this.left.isPresent()) {
            yield* this.left.get().postorder();
        }
        if (validate(this.right) && this.right.isPresent()) {
            yield* this.right.get().postorder();
        }
        yield this;
    }
    *breadthfirst() {
        let queue = [this];
        while (queue.length > 0) {
            let node = queue.shift();
            yield node;
            if (validate(node.left) && node.left.isPresent()) {
                queue.push(node.left.get());
            }
            if (validate(node.right) && node.right.isPresent()) {
                queue.push(node.right.get());
            }
        }
    }
    getElement() {
        return validate(this.element) ? this.element : Optional.empty();
    }
    setElement(element) {
        if (validate(element)) {
            this.element = Optional.of(element);
        }
    }
    getLeft() {
        return validate(this.left) ? this.left : Optional.empty();
    }
    getRight() {
        return validate(this.right) ? this.right : Optional.empty();
    }
}
;
