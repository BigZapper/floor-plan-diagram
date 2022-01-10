import { useContext } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { BuildingContext } from '../buildingContext/BuildingContext';
import BuildingList from './BuildingList';
import Canvas from './Canvas';
import './home.css';
import Inspector from './Inspector';
import Login from './Login';
import Palette from './Palette';
import SearchPage from './SearchPage';
import UserBar from './UserBar';

function Home() {
  const { user } = useContext(AuthContext);
  const { building } = useContext(BuildingContext);
  return (
    <>
      {user ? (
        <div className="app">
          {building ? (
            <>
              <Palette />
              <Canvas />
              <Inspector />
            </>
          ) : (
            <div className="container-block">
              <UserBar user={user} />
              <div className="tabs">
                <div className="tab-2">
                  <label htmlFor="tab2-1">Buildings</label>
                  <input
                    id="tab2-1"
                    name="tabs-two"
                    type="radio"
                    defaultChecked="checked"
                  />
                  <div>
                    <BuildingList />
                  </div>
                </div>
                <div className="tab-2">
                  <label htmlFor="tab2-2">Seacrching</label>
                  <input id="tab2-2" name="tabs-two" type="radio" />
                  <div>
                    <SearchPage />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default Home;
