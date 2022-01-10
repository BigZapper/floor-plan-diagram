import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { ShapeContext } from '../shapeContext/context';
import './form.css';

function EditTitleForm({ data, ...props }) {
  const [canvasData, setCanvasData] = useState(data);
  const { user, dispatch } = useContext(AuthContext);
  const { saveDiagram } = useContext(ShapeContext);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDiagram(canvasData);
    props?.onClose();
  };
  return (
    <div className="form-style-2">
      <form>
        <label htmlFor="title">
          <input
            disabled={user.sub > 1}
            type="text"
            className="input-field"
            name="title"
            value={canvasData.title}
            onChange={handleChange}
          />
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

export default EditTitleForm;
