const StorageKey = 'medhirblogeditaccesstoken' 

class AuthUtility {
    constructor () {
        const localAuth = localStorage.getItem(StorageKey)
        if (localAuth) {
            this.auth = JSON.parse(localAuth)
        } else {
            this.auth = null
        }
    }

    setAuth (auth) {
        const { token } = auth
        this.auth = {
            token: token
        }
        localStorage.setItem(StorageKey, JSON.stringify(this.auth))
    }

    get authed () {
        if (this.auth) return true 
        return false
    }

    get token () {
        if (!this.auth) {
            return null
        }
        return this.auth.token
    }
}

export const AuthUtil = new AuthUtility();