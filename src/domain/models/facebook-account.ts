interface FacebookData {
  name: string
  email: string
  facebookId: string
}

interface AccountData {
  id?: string
  name?: string
}

export class FacebookAccount {
  id?: string
  name: string
  facebookId: string
  email: string

  constructor (fbData: FacebookData, accountData?: AccountData) {
    this.id = accountData?.id
    this.email = fbData.email
    this.name = accountData?.name ?? fbData.name
    this.facebookId = fbData.facebookId
  }
}
