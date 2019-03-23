class AuthUtility {
    constructor () {
        this.auth = null
    }

    setAuth (auth) {
        this.auth = auth
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