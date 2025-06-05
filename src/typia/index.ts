import typia, {CamelCase, tags} from 'typia'

export const checkString = typia.createIs<string>()

interface Person {
  first_name: string;
}

type PersonCamelized = CamelCase<Person>

function main() {

  const a: PersonCamelized = {
    firstName: 'something',
  }

  checkString(1)
}

main()
