export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`the field ${fieldName} is required `)
    this.name = 'RequiredFiledError'
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
