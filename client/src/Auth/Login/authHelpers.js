import Auth0 from 'auth0-js';
import { PHONE_NUMBER } from '../../ProtectedConstants';

const webAuth = new Auth0.WebAuth({
    domain: 'medhir.auth0.com',
    clientID: 'iQLtk7iIJDVpsGoT3daNp5lvhLM9Pfkx',
    redirectUri: 'http://localhost:3000/',
    responseType: 'token id_token',
});

const errMessage = 'Authorization could not be completed: ';

const sendText = () => {
    webAuth.passwordlessStart({
        connection: 'sms',
        send: 'code',
        phoneNumber: PHONE_NUMBER
    }, (err, res) => {
        if (err) {
            console.error(errMessage, err);
        }
    })
}

const login = (code) => {
    webAuth.passwordlessVerify({
        connection: 'sms', 
        phoneNumber: PHONE_NUMBER,
        verificationCode: code
    }, (err, res) => {
        if (err) {
            console.error(errMessage, err);
        }
        console.log(res);
    })
}

export default {
    sendText,
    login,
}