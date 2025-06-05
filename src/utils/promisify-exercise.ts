interface User {
  type: 'user';
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: 'admin';
  name: string;
  age: number;
  role: string;
}

type Person = User | Admin;

const admins: Admin[] = [
  {type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator'},
  {type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver'},
]

const users: User[] = [
  {type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep'},
  {type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut'},
]

export type ApiResponse<T> = (
  {
    status: 'success';
    data: T;
  } |
  {
    status: 'error';
    error: string;
  }
  )

export type ApiCallback<T> = (response: ApiResponse<T>) => void

export type FunctionWithCallback<T> = (callback: ApiCallback<T>) => void

export function promisify<T>(func: FunctionWithCallback<T>): () => Promise<T> {

  return () => {
    return new Promise((resolve, reject) => {
      func((result) => {
        if (result.status === 'success') {
          resolve(result.data)
        } else {
          reject(result.error)
        }
      })
    })
  }
}

export type PromisifiedObject<T, ReturnT> = { [K in keyof T]: () => Promise<ReturnT> }

function promisifyAll<ReturnT, T extends {
  [key: string]: FunctionWithCallback<ReturnT>
}>(obj: T): PromisifiedObject<T, ReturnT> {
  const newObj: Partial<PromisifiedObject<T, ReturnT>> = {}
  for (const key of Object.keys(obj) as (keyof T)[]) {
    newObj[key] = promisify(obj[key])
  }
  return newObj as PromisifiedObject<T, ReturnT>
}

const oldApi = {
  requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
      status: 'success',
      data: admins,
    })
  },
  requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
      status: 'success',
      data: users,
    })
  },
  requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: 'success',
      data: Date.now(),
    })
  },
  requestCoffeeMachineQueueLength(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: 'error',
      error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.',
    })
  },
}

// export const api = {
//   requestAdmins: promisify(oldApi.requestAdmins),
//   requestUsers: promisify(oldApi.requestUsers),
//   requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),
//   requestCoffeeMachineQueueLength: promisify(oldApi.requestCoffeeMachineQueueLength),
// }

export const api = promisifyAll(oldApi)

function logPerson(person: Person) {
  console.log(
    ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`,
  )
}

async function startTheApp() {
  // console.log('Admins:');
  // (await api.requestAdmins()).forEach(logPerson)
  // console.log()
  //
  // console.log('Users:');
  // (await api.requestUsers()).forEach(logPerson)
  // console.log()
  //
  // console.log('Server time:')
  // console.log(`   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`)
  // console.log()
  //
  // console.log('Coffee machine queue length:')
  // console.log(`   ${await api.requestCoffeeMachineQueueLength()}`)
}

startTheApp().then(
  () => {
    console.log('Success!')
  },
  (e: Error) => {
    console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`)
  },
)
