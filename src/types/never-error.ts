function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`)
}

type Action =
  | {type: 'ADD_TODO'; text: string}
  | {type: 'DELETE_TODO'; id: number}
  | {type: 'UPDATE_TODO'; id: number; text: string};

function handleAction(action: Action) {
  switch (action.type) {
    case 'ADD_TODO':
      console.log('Add todo:', action.text)
      break
    case 'DELETE_TODO':
      console.log('Delete todo:', action.id)
      break
    case 'UPDATE_TODO':
      console.log('Update todo:', action.id, action.text)
      break
    default:
      assertNever(action) // Если какой-то кейс не обработан, будет ошибка
  }
}
