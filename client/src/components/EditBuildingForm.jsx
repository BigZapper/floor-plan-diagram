import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { getAllUsers } from '../api';
import { AuthContext } from '../authContext/AuthContext';
import './form.css';

function EditBuildingForm({ selectedBuilding, onclose, onSubmit }) {
  const { user } = useContext(AuthContext);
  const [building, setBuilding] = useState();
  const [users, setUsers] = useState([]);

  const getBuilding = useCallback(
    async (id) => {
      const { data } = await axios.get(
        'http://localhost:5000/api/buildings/' + id,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setBuilding({
        ...data,
        users: Array.from(data.users, (x) => x.user._id),
      });
    },
    [user.token]
  );
  const getUsers = useCallback(async () => {
    const res = await getAllUsers(user);
    setUsers(res);
  }, [user]);

  useEffect(() => {
    getBuilding(selectedBuilding);
    getUsers();
  }, [user.token, selectedBuilding, getBuilding, getUsers]);

  const handleChangeTitle = (e) => {
    setBuilding({
      ...building,
      title: e.target.value,
    });
  };
  const handleChangeSelect = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setBuilding({ ...building, [e.target.name]: value });
  };
  const handleChangeAdmin = (e) => {
    setBuilding({
      ...building,
      admin: e.target.value,
      users:
        building.users.indexOf(e.target.value) === -1
          ? [...building.users, e.target.value]
          : [...building.users],
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(building);
  };
  return (
    <div className="form-style-2">
      {/* <div className="form-style-2-heading">Provide your information</div> */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="titile">
          <span>
            Building name <span className="required">*</span>
          </span>
          <input
            type="text"
            className="input-field"
            name="title"
            value={building?.title}
            onChange={handleChangeTitle}
          />
        </label>
        <label htmlFor="users">
          <span>
            Users <span className="required">*</span>
          </span>
          <select
            multiple
            name="users"
            className="select-field"
            onChange={handleChangeSelect}
          >
            <option value={''}>Choose user</option>
            {users.map((u) => (
              <option
                selected={building?.users.includes(u._id)}
                value={u._id}
                key={u._id}
              >
                {u.username}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="admin">
          <span>
            Admin <span className="required">*</span>
          </span>
          <select
            name="admin"
            className="select-field"
            onChange={handleChangeAdmin}
          >
            <option value={''}>Choose user</option>
            {users.map((u) => (
              <option
                value={u._id}
                key={u._id}
                selected={building?.admin === u._id}
              >
                {u.username}
              </option>
            ))}
          </select>
        </label>
        <div className="text-center btn-form-group">
          <input className="btn submit" type="submit" value="Submit" />
          <input
            type="button"
            className="btn btnCancel"
            value="Cancel"
            onClick={onclose}
          />
        </div>
      </form>
    </div>
  );
}

export default EditBuildingForm;
