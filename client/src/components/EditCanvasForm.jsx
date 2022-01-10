import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { ShapeContext } from '../shapeContext/context';
import ImageUpload from './ImageUpload';
import './form.css';
import { BuildingContext } from '../buildingContext/BuildingContext';

function EditCanvasForm({ data, ...props }) {
  const [canvasData, setCanvasData] = useState(data);
  const { user, dispatch } = useContext(AuthContext);
  const { building } = useContext(BuildingContext);
  const { saveDiagram, createImage } = useContext(ShapeContext);

  useEffect(() => {
    setCanvasData(data);
  }, [data]);

  const handleChange = (e) => {
    if (!user.act.includes('edit_title')) {
      dispatch({
        type: 'CHANGE_ACT_OBJ',
        payload: {
          act: [...user.act, 'edit_title'],
          obj: 'canvas',
        },
      });
    }
    const value = e.target.value;
    setCanvasData({ ...canvasData, [e.target.name]: value });
  };

  const imageHandler = (url) => {
    const wC = document.getElementById('canvas')?.offsetWidth;
    const hC = document.getElementById('canvas')?.offsetHeight;
    createImage({ x: 500, y: 450, width: wC - 20, height: hC - 20, src: url });
  };

  const handleSelect = (e, index) => {
    if (!user.act.includes('add_user')) {
      if (!user.act.includes('edit_user')) {
        dispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_user'],
            obj: 'canvas',
          },
        });
      }
    }
    const value = e.target.value;
    let temp = canvasData;
    temp.users[index] = { ...temp.users[index], [e.target.name]: value };
    setCanvasData(temp);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!user.act.includes('add_user')) {
      dispatch({
        type: 'CHANGE_ACT_OBJ',
        payload: {
          act: [...user.act, 'add_user'],
          obj: 'canvas',
        },
      });
    }
    setCanvasData({
      ...canvasData,
      users: [
        ...canvasData.users,
        { userId: { username: '', _id: '' }, role: 'user' },
      ],
    });
  };

  const handleDeleteUser = (e, index) => {
    e.preventDefault();
    if (!user.act.includes('delete_user')) {
      dispatch({
        type: 'CHANGE_ACT_OBJ',
        payload: {
          act: [...user.act, 'delete_user'],
          obj: 'canvas',
        },
      });
    }
    let temp = canvasData;
    temp.users.splice(index, 1);
    setCanvasData({
      ...canvasData,
      users: temp.users,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveDiagram(canvasData);
    props?.onClose();
  };
  return (
    <div className="form-style-2">
      <form>
        <label htmlFor="title">
          <span>
            Title <span className="required">*</span>
          </span>
          <input
            disabled={user.sub > 1}
            type="text"
            className="input-field"
            name="title"
            value={canvasData.title}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="background">
          <span>Background</span>
          <ImageUpload
            image={canvasData.shapes[0]?.src}
            onChange={(value) => imageHandler(value)}
            user={user.sub}
          />
        </label>
        <label
          htmlFor="users"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <span>Users</span>
          <div className="optionBlock">
            {canvasData.users?.map((us, index) => (
              <div className="optionGroup" key={index}>
                <select
                  disabled={user.sub >= us.role}
                  name="userId"
                  className="select-field"
                  defaultValue={us.userId._id}
                  onChange={(e) => handleSelect(e, index)}
                >
                  <option value="">Choose user</option>
                  {building.users?.map((u) => (
                    <option value={u.user._id} key={u.user._id}>
                      {u.user.username}
                    </option>
                  ))}
                </select>
                <select
                  disabled={user.sub >= us.role}
                  name="role"
                  className="select-field"
                  defaultValue={us.role}
                  onChange={(e) => handleSelect(e, index)}
                >
                  <option value="">Choose role</option>
                  <option hidden selected={us.role === user.sub} value="1">
                    Owner
                  </option>
                  <option
                    hidden={user.sub >= '2'}
                    selected={us.role === user.sub}
                    value="2"
                  >
                    Administrator
                  </option>
                  <option
                    hidden={user.sub >= '3'}
                    selected={us.role === user.sub}
                    value="3"
                  >
                    Moderator
                  </option>
                  <option selected={us.role === user.sub} value="4">
                    User
                  </option>
                </select>
                {user.sub < us.role && (
                  <input
                    style={{ width: 20, marginLeft: 7, marginTop: 5 }}
                    onClick={(e) => handleDeleteUser(e, index)}
                    type="image"
                    alt="add"
                    src="/minus.png"
                  />
                )}
              </div>
            ))}
            {user.sub <= '3' && (
              <div className="btn edit" onClick={handleAddUser}>
                <i className="fa fa-plus mr-2"> </i> Add
              </div>
            )}
          </div>
        </label>
        <div className="text-center btn-form-group">
          {user.sub <= 3 && (
            <input
              className="btn submit"
              type="button"
              onClick={handleSubmit}
              value="Submit"
            />
          )}
          <input
            type="button"
            className="btn btnCancel"
            value="Cancel"
            onClick={() => props?.onClose()}
          />
        </div>
      </form>
    </div>
  );
}

export default EditCanvasForm;
