import { useContext, useEffect, useState } from 'react';
import { search } from '../api';
import { AuthContext } from '../authContext/AuthContext';
import { ShapeContext } from '../shapeContext/context';
import './form.css';
import Widget from './Widget';

function SearchForm({ show }) {
  const { user } = useContext(AuthContext);
  const { selectShapes, selected, shapes } = useContext(ShapeContext);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async () => {
    const data = await search(keyword, user);
    setResults({
      groups: data.groups,
      projects: data.projects,
      users: data.users,
    });
  };

  const handleSelectGroup = (g) => {
    selectShapes([]);
    setSelectedProject(null);
    setSelectedGroup((prevState) => (prevState === g ? null : g));
  };

  const handleSelectProject = (p) => {
    selectShapes([]);
    setSelectedGroup(null);
    setSelectedProject((prevState) => (prevState === p ? null : p));
  };

  const handleSelectUser = (u) => {
    selectShapes([]);
    setSelectedGroup(null);
    setSelectedProject(null);
    setSelectedUser((prevState) => (prevState === u ? null : u));
  };

  useEffect(() => {
    if (selectedGroup) {
      selectShapes(selectedGroup.shapes.map((s) => s.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedProject) {
      selectShapes(selectedProject.shapes.map((s) => s.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  useEffect(() => {
    const temp = shapes.shapes?.filter((s) => s.staff?._id === selectedUser)[0];
    selectShapes([temp?.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  return (
    <div className={show ? 'search-con' : 'hide'}>
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
              Find
            </button>
          </div>
        </div>
      </form>
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
                        <Widget
                          key={g._id}
                          title={g.title}
                          collapsed={true}
                          onClick={() => handleSelectGroup(g)}
                        >
                          {g.projects.map(
                            (p) =>
                              p.shapes.length > 0 && (
                                <Widget
                                  key={p._id}
                                  title={p.title}
                                  collapsed={true}
                                  onClick={() => handleSelectProject(p)}
                                >
                                  {p.shapes?.map((s) => (
                                    <li
                                      key={s._id}
                                      className={
                                        selected[0] === s._id
                                          ? 'd-flex justify-content-between align-items-center active'
                                          : 'd-flex justify-content-between align-items-center'
                                      }
                                      style={{
                                        padding: 10,
                                        border: '1px solid #ddd',
                                        borderBottom: 'none',
                                      }}
                                    >
                                      <span
                                        className="buildingItems"
                                        onClick={() => selectShapes([s.id])}
                                      >
                                        {s.staff.username}
                                      </span>
                                    </li>
                                  ))}
                                </Widget>
                              )
                          )}
                          {/* <li
                        
                        className={
                          selectedGroup?._id === g._id
                            ? 'list-group-item d-flex justify-content-between align-items-center active'
                            : 'list-group-item d-flex justify-content-between align-items-center'
                        }
                      >
                        <span
                          className="buildingItems"
                          onClick={() => handleSelectGroup(g)}
                        >
                          {g.title}
                        </span>
                      </li> */}
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
                    <li
                      key={p._id}
                      className={
                        selectedProject?._id === p._id
                          ? 'list-group-item d-flex justify-content-between align-items-center active'
                          : 'list-group-item d-flex justify-content-between align-items-center'
                      }
                    >
                      <span
                        className="buildingItems"
                        onClick={() => handleSelectProject(p)}
                      >
                        {p.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.users.length > 0 && (
              <div className="groups-result">
                <strong style={{ fontSize: 14, color: 'gray' }}>Users</strong>
                <ul className="shapesList totos" style={{ padding: '10px 0' }}>
                  {results.users.map((u) => (
                    <li
                      key={u._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span
                        onClick={() => handleSelectUser(u._id)}
                        className="buildingItems"
                      >
                        {u.username}
                      </span>
                    </li>
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

export default SearchForm;
