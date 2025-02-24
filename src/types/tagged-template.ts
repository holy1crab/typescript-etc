function hi(strings: TemplateStringsArray, arg1: string, arg2: number) {
  console.log(strings, arg1, arg2)
  // the length of strings will always be depending on the number of arguments
  // (basically we split the initial string with passed arguments)
  // initial string will be like this: strings[0] + arg1 + strings[1] + arg2 + strings[2]
  return strings[0] + arg1 + strings[1] + arg2 + strings[2]
}

console.log(hi`first ${'foo'} second ${7} third`)

// https://github.com/microsoft/TypeScript/issues/33304
// const div = html`<div>...</div>`
