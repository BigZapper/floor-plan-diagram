import { useContext, useState } from 'react';
import { loginCall, registerCall } from '../api';
import { AuthContext } from '../authContext/AuthContext';
import Loading from './Loading';
import './login.css';

export default function Login() {
  const { dispatch, isFetching } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    loginCall({ username, password }, dispatch);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      alert('Password not match!');
    } else {
      registerCall({ username, password }, dispatch);
    }
  };

  return (
    <div className="login-box">
      {isFetching && <Loading />}
      <h2>Login</h2>
      <form>
        <div className="user-box">
          <input
            type="text"
            name="username"
            required
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
        <div className="btnGroup">
          <button className="btn login" onClick={handleLogin}>
            <i className="fa fa-sign-in"></i> Login
          </button>
          <button className="btn register" onClick={handleRegister}>
            <i className="fa fa-user-plus"></i> Register
          </button>
        </div>
      </form>
    </div>
  );
}
