# Signals

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3.

## Development server

- Run `npm install`
- Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`.

---

# Angular Signals

Modern web applications thrive on reactivity, where data changes automatically trigger updates in the UI. Angular Signals, introduced in version 17, make managing reactive data within Angular applications more efficient and straightforward.

## Motivation Behind Signals

The Angular team introduced Signals to provide fine-grained reactivity. This new system marks a significant improvement in handling dynamic data and user interactions. It replaces the traditional Zone.js approach, offering a fresh way to detect and trigger changes within Angular.

### The Traditional Zone.js Approach

Angular's traditional change detection assumes that any event handler might change any bound data in the template. As a result, whenever an event occurs, Angular scans all components and their data bindings for potential changes. While this works, it can be inefficient, especially in complex applications.

To optimize this, Angular introduced the OnPush change detection mode, which uses immutability and Observables to reduce the number of components that need checking. However, Angular still relies on Zone.js to detect when event handlers have finished running since the browser, not Angular, triggers these handlers. Zone.js bridges this gap, telling Angular when to update.

Despite its effectiveness, the Zone.js approach has some downsides. When changes occur, the entire component tree is checked, even if only a small part has changed. Angular cannot directly identify which components have changed, leading to unnecessary checks.

### The New Signals Approach

With Signals, Angular can efficiently detect changes in application data and update dependencies automatically. This allows for smarter re-rendering and fine-grained updates to the DOM, reducing the need for Angular to check all components. Eventually, this could eliminate the need for Zone.js in future Angular versions.

**Advantages of Signals:**

- Provides a more intuitive and declarative way to manage reactive data.
- Aligns more closely with JavaScript, making the code easier to read, understand, and maintain.
- Enhances type safety within your reactive code.

## Defining Signals

A Signal in Angular is a reactive entity that holds a value and automatically notifies consumers when that value changes. It's like a combination of a data value and a change notification mechanism.

### Creating Signals

You can create a Signal using the `signal` constructor from the `@angular/core` package. A Signal must always have an initial value and can hold a wide range of values, from simple primitives to complex data structures such as array and object.

```typescript
import { signal } from "@angular/core";

const name = signal("John Doe");
```

In this example, the type of the Signal's value is inferred from the initial value. You can also explicitly define the type:

```typescript
const name = signal<string>("John Doe");
```

Explicitly defining types can improve code readability and maintainability, especially in larger projects.

### Working with Arrays

Here's an example of a Signal holding an array:

```typescript
const weekdays = signal(["Monday", "Tuesday", "Wednesday"]);
```

The type of the Signal is inferred as an array of strings (`string[]`). You can define types explicitly if needed for clarity.

## Reading Signals

You can read a Signal's value using its getter method:

```typescript
console.log(this.name());
```

You can also read Signals directly in your component templates:

```html
<div>{{ name() }}</div>
```

**When you read a Signal in a template, Angular registers it as a dependency, and if the Signal changes, that part of the template is re-rendered.**

## Modifying Signals

Signals created using the `signal` function are writable, meaning you can modify their values after creation. There are two primary methods to do this:

### `set` Method

The `set` method directly assigns a new value to the Signal:

```typescript
this.name.set("John Smith");
console.log(this.name); // John Smith
```

### `update` Method

The `update` method computes a new value from the previous one:

```typescript
this.name.update((value) => "Hello " + value);
console.log(this.name); // Hello John Doe
```

When a Signal's value changes, it automatically updates all dependent components or logic.

## Computed Signals

Computed Signals derive their values from other Signals and automatically react to changes:

```typescript
const firstName = signal("John");
const lastName = signal("Doe");
const fullName = computed(() => `${firstName()} ${lastName()}`);
```

The `fullName` Signal will automatically update whenever `firstName` or `lastName` changes. Computed Signals are lazy-evaluated and cached, meaning they only re-calculate when read and only if the dependent Signals have changed. Computed Signals are read-only and their value cannot be changed.

## Signal Effects

Signal Effects are functions that execute in response to Signal changes, allowing you to perform side effects like logging data:

```typescript
counter = signal(0);

constructor() {
  effect(() => {
    console.log('Count: ', this.counter());
  });
}

update() {
  this.counter.update(current => current + 1);
}
```

Effects require an injection context, such as during the construction of a component or service.

## Converting Between Signals and Observables

### `toSignal()`

The `toSignal()` function creates a Signal from an Observable, providing synchronous access to the latest values emitted by the Observable:

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

data$ = of([{ firstName: 'John', lastName: 'Doe' }]);
dataAsSignal = toSignal(this.data$, { initialValue: [] });

constructor() {
  effect(() => console.log(this.dataAsSignal()));
}
```

The `{ initialValue: [] }` parameter is optional. If not provided, the signal's initial value will be `undefined`.
The `toSignal()` function automatically handles subscription and cleanup, unsubscribing when the consuming component or service is destroyed.

### `toObservable()`

The `toObservable()` function converts a Signal into an Observable. When the Signal's value changes, the Observable automatically emits the new value:

```typescript
month = signal('January');

constructor() {
  toObservable(this.month).pipe(
    tap(month => console.log('Month:', month))
  ).subscribe();

  this.month.set('February');
  this.month.set('March');
  // console output: March
}
```

The Signal starts with the initial value ‘January’. When we call `toObservable(this.month)`, it sends a notification whenever the Signal’s value changes. However, the effect from `toObservable()` only runs after the Signal has finished updating, so the final value it emits is ‘March’.

## Signal Inputs

Angular 17.1 introduces Signal inputs, allowing data to be passed as Signals, ensuring a one-way data flow from the parent to the child component:

```typescript
age = input(0);
employeeId = input<string>({ alias: "id" });
name = input.required<string>();
```

- `age`: An optional input that holds a number, with a default value of 0.
- `employeeId`: An optional input that holds a string or can be undefined, with an alias of ‘id’.
- `name`: A required input that holds a string. Required inputs can't have a default value, and trying to access them before they are set will cause an error. However, you can safely access their values in methods like `ngOnInit`, `ngOnChanges`, `computed`, or `effect`, as these are only triggered after the component is fully initialized.

### Binding to Signal Input

```html
<child-component [age]="age"></child-component>
<child-component [id]="employeeId"></child-component>
<child-component [name]="name"></child-component>
```

## Model Input

Model Input simplifies two-way data binding between the parent and child components:

```typescript
@Component({
  selector: "child-component",
  template: '<input type="text" [(ngModel)]="filter">',
})
export class ChildComponent {
  filter = model.required({ alias: "filterCriteria" });
}

@Component({
  selector: "parent-component",
  template: `
    <child-component [(filterCriteria)]="filterCriteria"></child-component>
    <div>{{ filterCriteria }}</div>
  `,
})
export class ParentComponent {
  filterCriteria = "";
}
```

Whenever you write a new value into the model input, Angular emits an output event suffixed with `Change`, which can be used to trigger additional logic:

```typescript
@Component({
  selector: "parent-component",
  template: ` <child-component [(filterCriteria)]="filterCriteria" (filterCriteriaChange)="logMessage()"></child-component> `,
})
export class ParentComponent {
  filterCriteria = "";

  logMessage() {
    console.log("Event triggered");
  }
}
```
