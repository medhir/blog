import React, { Component } from 'react'
import http from '../../../utility/http'

const LocalStorageAuthorizationKey = 'medhir-com-authorization'
const StatusAuthorized = 'authorized'

interface ValidateProps {
  role: string
}

interface ValidateState {
  validated: boolean
}

class Validate extends Component<ValidateProps, ValidateState> {
  constructor(props: ValidateProps) {
    super(props)
    const authorizationStatus = localStorage.getItem(
      LocalStorageAuthorizationKey
    )
    if (authorizationStatus === StatusAuthorized) {
      this.state = {
        validated: true,
      }
    } else {
      this.state = {
        validated: false,
      }
    }
  }

  componentDidMount() {
    const { role } = this.props
    http
      .Get(`/jwt/validate/${role}`, {
        withCredentials: true,
      })
      .then(() => {
        this.setState({ validated: true })
        localStorage.setItem(LocalStorageAuthorizationKey, StatusAuthorized)
      })
      .catch(() => {
        this.setState({ validated: false })
        localStorage.setItem(LocalStorageAuthorizationKey, '')
      })
  }

  render() {}
}

export default Validate
