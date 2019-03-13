import auth0 from 'auth0-js'

class AuthUtility {
    auth0 = new auth0.WebAuth({
        domain: 'medhir.auth0.com',
        clientID: 'MkwsxMFT9oV5R77RAQt0fNOBa0bs8FYF',
        responseType: 'token id_token',
        scope: 'openid'
    })

    login () {
        this.auth0.authorize()
    }
}

export const AuthUtil = new AuthUtility();