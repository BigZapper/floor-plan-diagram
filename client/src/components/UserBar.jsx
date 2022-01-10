import { useContext } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import './userBar.css';

function UserBar() {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.clear();
  };
  return (
    <div className="userbar">
      <span>
        Welcome <span className="user">{user.username}</span>
      </span>
      <div className="btn logout" onClick={handleLogout}>
        <i className="fa fa-sign-out"></i> Logout
      </div>
    </div>
  );
}

export default UserBar;
