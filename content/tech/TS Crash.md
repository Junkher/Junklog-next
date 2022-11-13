---
title: TS Crash
date: 2022-08-03T22:41:41+08:00
tags: []
description: "一入TS深似海"
cover: "https://s2.loli.net/2022/08/03/xoQZ6RwmaG7VNqj.png"
toc: true
---

## 基本类型

### 数组类型

```ts
let list: number[] = [1, 2, 3];
// 二维数组
let vec: number[][] = [[1, 2, 3], [1, 2, 3]];
```

### 元组类型

元组是固定长度的数组，每个元素有自己的类型
```ts
// 声明一个元组，包含两个元素，第一个元素为string类型，第二个元素为number类型
let x: [string, number];

// 正确
x = ['hello', 10];

// 错误；元素类型不匹配
// error: Type 'number' is not assignable to type 'string'
// error: Type 'string' is not assignable to type 'number'
x = [10, 'hello'];

// 错误；长度不匹配
// error: Property '1' is missing in type '[string]' but required in type '[string, number]'
x = ['hello'];
```

### 枚举类型

```ts
enum Direction {
  Up,   // 值默认为 0
  Down, // 值默认为 1
  Left, // 值默认为 2
  Right // 值默认为 3
}

console.log(Direction.Up) //0
console.log(Direction[0]) //Up

enum Calc {
  add = '+' ,
  mult = '*',
}
console.log(Calc.add)  // +
console.log(Calc.mult) // *

//error: Property '+' does not exist on type 'typeof Calc'.
console.log(Calc['+']) 
```

> 只有数字枚举对象支持反向映射


### 简单类型

- 符号类型`symbol`

```ts
const sym = Symbol();
console.log(sym) // "Symbol()"

let obj = {
  [sym]: "value",
  sym: 'I am not a symbol'
};
console.log(obj[sym]); // "value"
console.log(obj.sym); // "I am not a symbol"
```

- Null类型 和 Undefined类型
- Never类型

```ts
// 声明不可能存在的交叉类型(取交集)
let n: boolean & number;
// 等价于
let n: never;
```

- 任意值类型`any`


### 复合类型

- 联合类型  Union Type `|` 或

```ts
let foo: number | "foo" | boolean

//ok
foo = 1 
foo = "foo" 
foo = true

//error: Type '"bar"' is not assignable to type 'number | boolean | "foo"'.
foo = "bar" 
```

- 交叉类型 Intersection Type `&` 且

```ts
interface XPoint {
  x: number
  id: string
}

interface YPoint {
  y: number
  id: number
}

type XYPoint = XPoint & YPoint 
//等价于=> {
//   x: number,
//   y: number,
//   id: string & number
//}


let XY1:XYPoint = {
  x: 1,
  y: 1,
  id: 1 as never
} 
```

- 当`|`和`&`一起使用

```ts

interface IHistoryBook {
  author: string
  type: 'history'
  range: string
}

interface IStoryBook {
  author: string
  type: 'story'
  theme: string
}

const bookList: IBookList = [{
  author: 'foo',
  type: 'history',
  range: '2001-2022'
}, {
  author: 'bar',
  type: 'story',
  theme: 'love'
}]

type IBookList = Array<IHistoryBook | IStoryBook>

type IBookList2= Array<
{
  author: string 
} & (
  {
    type: 'history'
    range: string
  } | {
    type: 'story'
    theme: string
  }
)>
// 相当于捆绑了type: 'history'和range，也就是当type为'history'才有range，合理

type IBookList3= Array<
{
  author: string
  type: 'history' | 'story' 
} & (
  {
    range: string
  } | {
    theme: string
  }
)>
// 这种写法当type为'history'或'story'都可以有range，不合理

```

- `keyof`
```ts
interface Person {
  name: string;
  age: number;
}

// 通过keyof关键字声明联合
let keyWord: keyof Person;
// 完全等价于
let keyWord: "name" | "age";

keyWord = "name"; //ok
keyWord = "age"; //ok
```

`keyof` 关键字生成的是字符串值的联合，每个字符串值都是被获取类型 T 的键的索引名


### 类类型

类本身是一种类型，可以直接作为类型名
```ts
// 定义类
class TypeA {
  // ...
}

// 声明TypeA类型
let a: TypeA;
// 赋值TypeA类型
a = new TypeA();
```


## 对象类型(Object Types)

>对象类型是匿名的接口类型，对象类型没有名字，接口类型有名字。接口类型相当于为对象类型声明了一个别名。对象是一组键值对的实例

```ts
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```

### interface

```ts
interface Person {
  name: string;
  age: number;
}
  
function greet(person: Person) {
  return "Hello " + person.name;
}
```

### type alias

```ts
type Person = {
  name: string;
  age: number;
};
 
function greet(person: Person) {
  return "Hello " + person.name;
}
```

### index signature

>索引签名的名称（如：`{ [index: string]: { message: string } }` 里的 index ）除了可读性外，并没有任何意义。例如：如果有一个用户名，可以使用 { username: string}: { message: string }，这有利于下一个开发者理解代码。 `index`只能是number/string/symbol


```ts
interface NumberStringArray {
  [index: number]: string
}

//可看成一个字符串数组
let numberStringArray: NumberStringArray = ['foo', 'bar']

let numberStringArray2: NumberStringArray = {
  1: 'foo',
  2: 'bar'
}

interface StringStringArray {
  [index: string]: string
}

let stringStringArray: StringStringArray = {
  foo: 'foo',
  bar: 'bar',
  2: 'dsds'
}

console.log(numberStringArray)//[ 'foo', 'bar' ]
console.log(numberStringArray2)//{ '1': 'foo', '2': 'bar' }
console.log(stringStringArray)//{ '2': 'dsds', foo: 'foo', bar: 'bar' }
```

## 泛型(Generic Types)

### 泛型语法

泛型，即不预先指定具体的类型，而在使用的时候再指定
```ts
/*函数泛型，不预先指定具体的类型，而在使用的时候再指定*/
type IGetRepeatArr = <T>(target: T) => T[]


interface IX<T, U> {
	key: T
	val: U
}

```

### 泛型约束

在声明泛型时，可以给定一个默认类型
```ts
interface MyType<T = string> {
  value: T;
}

// 正确，在类型参数没有显示指定的情况下，采用了默认类型 string
let x1: MyType = {
  value: "hello world"
}
// 等价于
let x1: MyType<string> = {
  value: "hello world"
}

// 错误， error TS2322: Type 'number' is not assignable to type 'string'
let x2: MyType = {
  value: 123
}
```

## 类型转换

### 类型断言

理解为类型转换即可
```ts
let someValue: any = "this is a string";

// 1、尖括号语法
let strLength: number = (<string>someValue).length;
// 2、as语法
let strLength: number = (someValue as string).length;
```

尖括号 `<>` 的运算符优先级低于点号 `.` ，因而必须用括号将断言表达式扩起来，直接这样写是错误的：
```ts
// 错误，error TS2339: Property 'showColor' does not exist on type 'Shape'
console.log(<Circle>circle.showColor());
```


## 命名空间(Namespace)

### 空间拆分
```ts
namespace ns {
  let a = 1;
}
namespace ns {
  // 错误，error TS2339: Property 'a' does not exist on type 'typeof ns'
  let b = a + 1;
}
```


## 工具类型(Utility Types)


### Record<Keys，Type>

record跟index signature看起来很像，在一些情况下效果完全一致。

```ts
const object1: Record<string, string> = { prop: 'Value' }; // OK
const object2: { [key: string]: string } = { prop: 'Value' }; // OK
```

但在一些明确特定的keys的情形下，record是**最佳选择**，而index signature的index只能是number、string这样的基本类型，而不能是具体的某些值或者枚举对象。

```ts
interface CatInfo {
  age: number;
  breed: string;
}
 
type CatName = "miffy" | "boris" | "mordred";
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
 
console.log(cats.boris);
```

### Partial< Type >

使`Type`中所有属性变为可选的

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};

```

```ts
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};
 
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```


### Required< Type >

使`Type`中所有属性变为必需的

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

```ts
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
 
const obj2: Required<Props> = { a: 5 };//Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```


## 条件类型(Conditional Types)

### Infer

`T extends (infer E)[] ? E : T`：如果T能够赋值给`(infer E)[]`，则结果是数组的元素`E`，否则为`T`

```ts
type ArrayElementType<T> = T extends (infer E)[] ? E : T;

// type of item1 is `number`
type item1 = ArrayElementType<number[]>;

// type of item1 is `{name: string}`
type item2 = ArrayElementType<{ name: string }>;
```

` T extends (arg: infer P) => any ? P : T` ：如果 T 能赋值给 (arg: infer P) => any，则结果是 (arg: infer P) => any 类型中的参数 P，否则返回为 T。

```ts
type ParamType<T> = T extends (arg: infer P) => any ? P : T;

interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>; // string

```


内置类型`ReturnType<T>`，只是将infer移到了返回值的部分

```ts
type ReturnType<T> = T extends (...args: any) => infer R ? R : T;

interface User {
  name: string;
  age: number;
}

type Func = () => User;
type Return = ReturnType<Func>; // Return = User
```


## 特殊符号

- `?.`

可选链操作符 ( `?.` ) 类似于 . 链式操作符，不同之处在于，在引用为空 (null 或者 undefined) 的情况下不会引起错误，该表达式短路返回值是 undefined。

下面这行代码的含义是，当 foo 被定义了，foo.bar.baz() 将会执行完成；但是当 foo 是 null 或者 undefined 时，TypeScript 会立即停止运行，并且仅仅是返回 undefined。

```ts
let x = foo?.bar.baz();
```

等价于

```ts
let x = foo === null || foo === undefined ? undefined : foo.bar.baz();
```

>可选链操作符常用于从后端接口获取返回对象，但无法保证返回的对象一定存在的情形。避免了需要繁琐使用`&&`进行多层级的判断

- `??`

空值合并操作符（`??`）是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。

```ts
const foo = null ?? 'default string';
console.log(foo);
// expected output: "default string"

const baz = 0 ?? 42;
console.log(baz);
// expected output: 0

```

## 参考资料

- https://jkchao.github.io/typescript-book-chinese/typings/indexSignatures.html
- https://jkchao.github.io/typescript-book-chinese/tips/infer.html
- https://github.com/joye61/typescript-tutorial
- https://juejin.cn/post/6985424163502571534
- https://dmitripavlutin.com/typescript-index-signatures/
- https://juejin.cn/post/6998347146709696519
- https://learntypescript.dev/09/l2-conditional-infer
