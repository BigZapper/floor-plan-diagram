import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { ShapeContext } from '../shapeContext/context';
import './form.css';
import ImageUpload from './ImageUpload';

function EditImageForm({ data, ...props }) {
  const [canvasData, setCanvasData] = useState(data);
  const { user, dispatch } = useContext(AuthContext);
  const { saveDiagram, createImage } = useContext(ShapeContext);

  useEffect(() => {
    setCanvasData(data);
  }, [data]);

  const imageHandler = (url) => {
    if (!user.act.includes('edit_image')) {
      dispatch({
        type: 'CHANGE_ACT_OBJ',
        payload: {
          act: [...user.act, 'edit_image'],
          obj: 'canvas',
        },
      });
    }
    const wC = document.getElementById('canvas')?.offsetWidth;
    const hC = document.getElementById('canvas')?.offsetHeight;
    createImage({ x: 500, y: 450, width: wC - 20, height: hC - 20, src: url });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDiagram(canvasData);
    props?.onClose();
  };

  return (
    <div className="form-style-2">
      <form>
        <label htmlFor="background">
          <ImageUpload
            image={canvasData.shapes[0]?.src}
            onChange={(value) => imageHandler(value)}
            user={user.sub}
          />
        </label>
        <div className="text-center btn-form-group">
          {user.sub < '3' && (
            <input
              disabled={user.sub > '3'}
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

export default EditImageForm;
