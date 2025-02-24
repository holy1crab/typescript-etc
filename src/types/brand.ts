declare const __brand: unique symbol

type Brand<T, B> = T & {[__brand]: B}

type Email = Brand<string, 'Email'>

// type narrowing
function isEmail(input: string): input is Email {
  // some validation logic
  return input.includes('@')
}

// so, basically we can't call `sendEmail` without calling another method with type narrowing (isEmail)
function sendEmail(email: Email) {
  console.log(`send email to ${email}`)
}

function assertValidEmail(input: string): asserts input is Email {
  if (!isEmail(input)) {
    throw new Error('invalid email')
  }
}

const sampleEmail = 'hello@world.com'

if (isEmail(sampleEmail)) {
  // works because sampleEmail converted to `Email` type
  sendEmail(sampleEmail)
}

// not working because we didn't call `isEmail` and type is still string
// sendEmail(sampleEmail)


assertValidEmail(sampleEmail)
sampleEmail
// ^?
sendEmail(sampleEmail)
