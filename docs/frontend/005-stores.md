# Stores

Stores are used to store data in a controlled and reactive way. 

## A Simple Store

A store consists of a _state_ and a set of _actions_, which can read to and write from that state.
The state is defined as an interface, for example like this:

```ts
interface CounterState {
  counter: number
}
```

The store is then created using `createStore`, together with an initial state value and a set of actions:

```ts
const initialState: CounterState = { counter: 0 }

const CounterStore = createStore(initialState, (getState, setState) => ({
  // These are the store's actions:
    
  // Returns the counter's current value.
  getCounter(): number {
      return getState().counter
  },
  
  // Sets the counter to a new value.
  setCounter(value: number) {
      setState({ counter: value })
  },
  
  // Increments the counter by one.
  increment() {
      setState(({ counter }) => ({ counter: counter + 1 }))
  },
}))
export default CounterStore
```

### Using the Store

The easiest way to access a store is by using its actions:

```ts
CounterStore.setCounter(10)
console.log(CounterStore.getCounter()) //=> 10
CounterStore.increment()
console.log(CounterStore.getCounter()) //=> 11
```

If you're in a React component, you can use the `useStore` hook to get the store's state:

```ts
const { counter } = useStore(CounterStore)
```

The hook will re-render your component if the store's value changes. The `useStore` hook can also be used to write custom store hooks:

```ts
// In your store file:
const useCounter = (): number => {
  const { counter } = useStore(CounterStore)
  return counter
}

// In your component:
const counter = useCounter()
```

## Model Store

Instances of model `Model` (defined in `models/base/Model.ts`) can be stored inside a `ModelStore`.
A `ModelStore` consists of all basic CRUD methods, and also provides specialized hooks and listeners.

Use `createModelStore` to create a new `ModelStore`:

```ts
// The model which you want to store.
interface Person extends Model {
    name: string
}

// Parses the fields of a `Person` which has been parsed from a JSON string.
const parsePerson = (data: Person): Person => {
  ...data,
  ...parseModel(data),
}

const PeopleStore = createModelStore(parsePerson)

export const usePerson = createUseRecord(PeopleStore)
export const usePeople = createUseRecords(PeopleStore)

export default PeopleStore
```

### Model Store Hooks

### Single Record Hook

The `usePerson` hook can be used to load a record by id:
```ts
const person: Person | null = usePerson(10)
```

It also accepts an instance of `People`, which is then parsed and saved into the store. Any changes to the instance will be reacted to as usual.

```ts
const person: Person = usePerson(myUnparsedPerson)
```

### Multi Record Hook

The `usePeople` hook can be used to load all stored records:

```ts
const people: People[] = usePeople()
```

It also accepts a list of ids to load:

```ts
const people: People[] = usePeople([10, 1, 23])
```

Alternatively, you can pass it a function which modifies the array of records before returning it:

```ts
const names: String[] = usePeople((people) => people.map(({ name }) => name))
```



