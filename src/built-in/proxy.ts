const target = {
  message1: 'hello',
  message2: 'everyone',
}

const handler1: ProxyHandler<typeof target> = {
  get(target, prop) {
    return (target as any)[prop] + ' additional'
  },
}

const proxy1 = new Proxy(target, handler1)

console.log(proxy1.message1)
console.log(proxy1.message2)

/*
examples of usages:
  - api which returns HttpResponse, with proxy we can "unwrap" api
*/
