import React, { ReactNode } from 'react'
import styles from './button.module.scss'

interface ButtonProps {
  children: ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = ({ children, className, onClick }: ButtonProps) => (
  <button className={`${styles.button} ${className}`} onClick={onClick}>
    {children}
  </button>
)

export default Button

export const GreenButton = ({ children, onClick }: ButtonProps) => (
  <Button className={styles.green} onClick={onClick}>
    {children}
  </Button>
)

export const RedButton = ({ children, onClick }: ButtonProps) => (
  <Button className={styles.red} onClick={onClick}>
    {children}
  </Button>
)

export const MagentaButton = ({ children, onClick }: ButtonProps) => (
  <Button className={styles.magenta} onClick={onClick}>
    {children}
  </Button>
)
