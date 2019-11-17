# Description

[![Greenkeeper badge](https://badges.greenkeeper.io/baksale/any-dependency-tree.svg)](https://greenkeeper.io/)

Build and visualize dependency tree for any hierarchical structure.  
Just implement *element => dependencies: element[]* [interface](./src/index.ts#EntityDependencyApi)  

# Usage
Install the package
```bash
npm i any-depepndency-tree
```
## Minimal
[Implement EntityDependencyApi](./src/index.ts#EntityDependencyApi)
```typescript
...
const myImp: EntityDependencyApi<MyHierarchyType> = ...; // Mandatory custom implementation
```
Define starting point of the tree
```typescript
const myRoot: MyHierarchyType = ...; // this is starting poing of the tree;
```
Build the complete tree
```typescript
...
const builder = new DependencyTreeBuilder<MyHierarchyType>(myImp);
const rootNode = await dependencyTreeBuilder.buildDependencyTree(myRoot);
// now the rootTreeNode has the complete tree
```
## Optional
Can visualize the tree using standard JSON.stringify approach
```typescript
...
const serializingVisitor: = new Serializing();
const treeString: string = serializingVisitor.visitTree(rootNode);
console.log(treeString);
```
Or via custom implementation of tree node element visualizer
```typescript
...
const customSerializer: Serializer<MyHierarchyType> = ... // Optional custom implementation
const serializingVisitor: = new Serializing(customSerializer);
const treeString: string = serializingVisitor.visitTree(rootTreeNode);
console.log(treeString);
```
Can also convert built tree into the ordered list where children are in the beginning  
```
const orderVisitor: Ordering = new Ordering(true);
const orderedElements: DependencyTreeNode<any>[] = orderVisitor.visitTree(rootNode);
```
orderedElements now contains all nodes from the tree including root as the very last element.  

## Examples
1. [index.test.ts](./test/index.test.ts)
1. [integration.test.ts](./test/visitor/serializing.test.ts)

# Contribution
If you are interested in contributing, please take a look at the [CONTRIBUTING](./CONTRIBUTING.md) guide.
