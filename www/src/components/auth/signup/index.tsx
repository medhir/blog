import React from 'react';
import { TextField, Button, Container } from '@material-ui/core'
import styles from './signup.module.scss'

const SignUpForm = () => {
    return (
        <section className={styles.signup}>
            <Container maxWidth="sm">
                <h2>Start Learning Now</h2>
                <form>
                    <TextField className={styles.textField} label="username" variant="outlined" />
                    <TextField className={styles.textField} label="password" variant="outlined" />
                    <TextField className={styles.textField} label="password" variant="outlined" />
                    <TextField className={styles.textField} label="confirm password" variant="outlined" />
                    <Button className={styles.button} variant="contained" color="primary">Sign Up</Button>
                </form>
            </Container>
        </section>
    )
};

export default SignUpForm