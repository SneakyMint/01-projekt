import { makeAutoObservable } from 'mobx'
import { UserType } from 'models/auth_model'
import { userStorage } from 'utils/localStorage'

export interface AuthContextType {
  user?: UserType | null
  login: () => void
  signout: () => void
  update: (user: UserType) => void
  getUserId: () => string
}

class AuthStore {
  user?: UserType | null = userStorage.getUser() || null

  constructor() {
    makeAutoObservable(this)
  }

  login(user: UserType) {
    userStorage.setUser(user)
    this.user = user
  }

  signout() {
    userStorage.clearUser()
    this.user = undefined
  }

  update(user: UserType) {
    this.user = user
    userStorage.setUser(user)
  }

  getUserId(): string {
    const user: UserType = userStorage.getUser()
    return user.id
  }
}

const authStore = new AuthStore()
export default authStore
