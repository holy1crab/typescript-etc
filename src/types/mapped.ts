// sample
type Person = {
  name: string
  age: number
}

/* add optional (?) */
type Partial<T> = { [K in keyof T]?: T[K] }


/* remove optional (-?) */
type Required<T> = { [K in keyof T]-?: T[K] }

const person: Partial<Person> = {name: 'David'}
const person2: Required<Partial<Person>> = {name: 'Rob', age: 3}

type Events = {
  click: 'click',
  mousemove: 'mousemove'
}


/* mapping alias  */
type OnEvents = {
  [K in keyof Events as `on${Capitalize<K>}`]: () => void
}


/* mapping alias: universal type */
type On<T extends object> = {
  [K in keyof T as (K extends string ? `on${Capitalize<K>}` : never)]: () => void
}

const events: On<Events> = {
  onClick: () => {},
  onMousemove: () => {},
}


/* readonly */
type Readonly<T extends object> = {
  readonly [K in keyof T]: T[K]
}

let a: Readonly<Person> = {name: 'Robot', age: 10}
// a.age = 24 // error
