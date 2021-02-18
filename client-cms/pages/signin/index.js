import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import MainNavbar from '../../components/MainNavbar'
import MainFooter from '../../components/MainFooter'
import style from '../../styles/Signin.module.scss'
import toaster from '../../utils/toaster'
import { useEffect, useState } from 'react'
import { signinUser, setUser } from '../../store/actions/userAction'

const Login = (props) => {
  const router = useRouter()
  const { signinUser, setUser } = props
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const defaultButtonState = {
    disabled: false,
    text: 'Sign in',
  }
  const [submitButton, setSubmitButton] = useState(defaultButtonState)

  useEffect(() => {
    if (props.currentUser) {
      setUser(props.currentUser)
      router.push('/')
    }
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()

    setSubmitButton({
      disabled: true,
      text: 'Signing...',
    })

    signinUser({
      user: {
        username,
        password,
      },
      onSuccess: () => {
        setSubmitButton(defaultButtonState)
        router.push('/')
      },
      onError: (errors) => {
        for (let err of errors) {
          toaster(err.message, 'error')
        }

        setSubmitButton(defaultButtonState)
      },
    })
  }

  return (
    <div>
      <MainNavbar />
      <div className="container">
        <main className="mainContent">
          {props.currentUser ? (
            <></>
          ) : (
            <form onSubmit={onSubmit} className={style.mainForm}>
              <h1 className={style.formTitle}>Sign In</h1>
              <div className={style.formGroup}>
                <label>Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="form-control"
                />
              </div>
              <div className={style.formGroup}>
                <label>Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="form-control"
                />
              </div>
              <button disabled={submitButton.disabled}>
                {submitButton.text}
              </button>
            </form>
          )}
        </main>
        <MainFooter />
      </div>
    </div>
  )
}

// const transferStatetoProps = state => ({
// })

export default connect(null, { signinUser, setUser })(Login)
