import React, { useContext, useState } from 'react';
import {
  findShapesByUser,
  getBuilding,
  getShapesSpecified,
  search,
} from '../api';
import { AuthContext } from '../authContext/AuthContext';
import { BuildingContext } from '../buildingContext/BuildingContext';
import { ShapeContext } from '../shapeContext/context';
import Widget from './Widget';

function SearchPage() {
  const { user } = useContext(AuthContext);
  const { dispatch: buildingDispatch } = useContext(BuildingContext);
  const { dispatch } = useContext(ShapeContext);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);

  const [buildingProject, setBuildingProject] = useState([]);
  const [floorProject, setFloorProject] = useState([]);
  const [shapeUsers, setShapeUsers] = useState([]);

  const handleSearch = async () => {
    const data = await search(keyword, user);
    setResults({
      groups: data.groups,
      projects: data.projects,
      users: data.users,
    });
  };

  function onlyUnique(arr) {
    var temp = [];
    return arr
      .map((b) => {
        if (temp.includes(b._id)) {
          return null;
        }
        temp.push(b._id);
        return b;
      })
      .filter((e) => e);
  }
  const handleSelectProject = (p) => {
    const floor = p.shapes.map((s) => s.floor);
    const building = floor.map((f) => f.building);
    localStorage['selected'] = JSON.stringify(p.shapes.map((s) => s.id));

    setFloorProject(onlyUnique(floor));
    setBuildingProject(onlyUnique(building));
  };

  const handleClickProjectFloor = (f) => {
    getBuilding(f.building._id, user, buildingDispatch);
    getShapesSpecified(f._id, user, dispatch);
  };

  const handleSelectUserGroup = (u) => {
    getBuilding(u.floor.building._id, user, buildingDispatch);
    getShapesSpecified(u.floor._id, user, dispatch);
    localStorage['selected'] = JSON.stringify([u.id]);
  };

  const handleSelectUser = async (u) => {
    const data = await findShapesByUser(u, user);
    setShapeUsers(data);
  };

  return (
    <div className="search-container">
      <header className="text-center text-light my-4">
        <h3 className="mb-4">Search</h3>
        <form className="add text-center my-4 m0">
          <div className="input-group mb-1">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ fontSize: 14 }}
              type="text"
              className="form-control m-auto"
              name="add"
              placeholder="Search..."
            />
            <div className="input-group-append">
              <button
                className="btn add"
                type="button"
                style={{ fontSize: 14 }}
                onClick={handleSearch}
              >
                <i
                  className="fa fa-search icon"
                  style={{ padding: '0 10px' }}
                />
                Find
              </button>
            </div>
          </div>
        </form>
      </header>
      {results && (
        <div className="container">
          <div className="search-result">
            {results.groups?.length > 0 && (
              <div className="groups-result">
                <strong style={{ fontSize: 14, color: 'gray' }}>Groups</strong>
                <ul className="shapesList totos" style={{ padding: '10px 0' }}>
                  {results.groups?.map(
                    (g) =>
                      g.projects.length > 0 && (
                        <Widget key={g._id} title={g.title} collapsed={true}>
                          {g.projects.map(
                            (p) =>
                              p.shapes.length > 0 && (
                                <Widget
                                  key={p._id}
                                  title={p.title}
                                  collapsed={true}
                                >
                                  {p.shapes?.map((s) => (
                                    <li
                                      key={s._id}
                                      className="d-flex justify-content-between align-items-center"
                                      style={{
                                        padding: 10,
                                        border: '1px solid #ddd',
                                        borderBottom: 'none',
                                      }}
                                    >
                                      <span
                                        className="buildingItems"
                                        onClick={() => handleSelectUserGroup(s)}
                                      >
                                        {s.staff.username +
                                          ' - ' +
                                          s.floor.title +
                                          ' - ' +
                                          s.floor.building.title}
                                      </span>
                                    </li>
                                  ))}
                                </Widget>
                              )
                          )}
                        </Widget>
                      )
                  )}
                </ul>
              </div>
            )}
            {results.projects.length > 0 && (
              <div className="groups-result">
                <strong style={{ fontSize: 14, color: 'gray' }}>
                  Projects
                </strong>
                <ul className="shapesList totos" style={{ padding: '10px 0' }}>
                  {results.projects.map((p) => (
                    <Widget
                      key={p._id}
                      title={p.title}
                      collapsed={true}
                      onClick={() => handleSelectProject(p)}
                    >
                      {buildingProject?.map((b) => (
                        <Widget key={b._id} title={b.title} collapsed={true}>
                          {floorProject
                            ?.filter((f) => f.building._id === b._id)
                            .map((f) => (
                              <li
                                key={f._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <span
                                  className="buildingItems"
                                  onClick={() => handleClickProjectFloor(f)}
                                >
                                  {f.title}
                                </span>
                              </li>
                            ))}
                        </Widget>
                      ))}
                    </Widget>
                  ))}
                </ul>
              </div>
            )}

            {results.users.length > 0 && (
              <div className="groups-result">
                <strong style={{ fontSize: 14, color: 'gray' }}>Users</strong>
                <ul className="shapesList totos" style={{ padding: '10px 0' }}>
                  {results.users.map((u) => (
                    <Widget
                      key={u._id}
                      title={u.username}
                      collapsed={true}
                      onClick={() => handleSelectUser(u._id)}
                    >
                      {shapeUsers?.map((s) => (
                        <li
                          key={s._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span
                            onClick={() => handleSelectUserGroup(s)}
                            className="buildingItems"
                          >
                            {s.floor.title + ' - ' + s.floor.building.title}
                          </span>
                        </li>
                      ))}
                    </Widget>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
