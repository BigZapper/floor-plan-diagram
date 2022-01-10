import React, { useContext, useState } from 'react';
import { createGroup } from '../api';
import { ShapeContext } from '../shapeContext/context';

function GroupForm({ onclose, user }) {
  const { setGroups } = useContext(ShapeContext);
  const [group, setGroup] = useState('');

  const handleChangeTitle = (e) => {
    setGroup(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createGroup(group, user);
    setGroups((prevState) => [...prevState, res]);
    onclose();
  };
  return (
    <div className="form-style-2">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          <span>
            Title <span className="required">*</span>
          </span>
          <input
            value={group.title}
            onChange={handleChangeTitle}
            type="text"
            className="input-field"
            name="title"
          />
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

export default GroupForm;
