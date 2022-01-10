import React, { useContext } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { ShapeContext } from '../shapeContext/context';
import './form.css';

function EditShapeForm({ handleSubmit, selectedShape, updateAttr, onclose }) {
  const { shapes } = useContext(ShapeContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="form-style-2">
      <form>
        <label htmlFor="staff">
          <span>
            Staff <span className="required">*</span>
          </span>
          <select
            name="staff"
            disabled={user.sub === '4'}
            className="select-field"
            defaultValue={selectedShape.staff?._id}
            onChange={updateAttr}
          >
            <option value={''}>Choose user</option>
            {shapes.users.map((u) => (
              <option
                disabled={user.sub === '4'}
                selected={selectedShape.staff?._id === u.userId._id}
                value={u.userId._id}
                key={u.userId._id}
              >
                {u.userId.username}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="monitor">
          <span>
            Monitor <span className="required">*</span>
          </span>
          <input
            type="text"
            disabled={user.sub === '4'}
            className="input-field"
            name="monitor"
            value={selectedShape.monitor}
            onChange={updateAttr}
          />
        </label>
        <label htmlFor="peripheral">
          <span>
            Peripheral <span className="required">*</span>
          </span>
          <input
            disabled={user.sub === '4'}
            type="text"
            className="input-field"
            name="peripheral"
            value={selectedShape.peripheral}
            onChange={updateAttr}
          />
        </label>
        <label htmlFor="computer">
          <span>
            Computer <span className="required">*</span>
          </span>
          <textarea
            disabled={user.sub === '4'}
            name="computer"
            className="textarea-field"
            value={selectedShape.computer}
            onChange={updateAttr}
          ></textarea>
        </label>

        <div className="text-center btn-form-group">
          {user.sub < 4 && (
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
            onClick={onclose}
          />
        </div>
      </form>
    </div>
  );
}

export default EditShapeForm;
