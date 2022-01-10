import React, { useEffect, useState } from 'react';
import { SHAPE_TYPES } from '../constants';
import useImageUpload from '../hooks/ImageUpload';

export default function ImageUpload({ image, onChange, user }) {
  const [img, setImg] = useState(null);
  const imgURL = useImageUpload(img);

  useEffect(() => {
    if (imgURL) {
      onChange(imgURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgURL]);

  return (
    <>
      <div className="Upload">
        <input
          type="file"
          id={'file'}
          style={{ display: user < '3' ? 'block' : 'none' }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        {img ? (
          <img
            src={URL.createObjectURL(img)}
            alt=""
            className="UploadImg"
            id=""
            data-shape={SHAPE_TYPES.IMG}
          />
        ) : (
          <img src={image || '/upload.png'} alt="" className="UploadImg" />
        )}
      </div>
      {imgURL && <div className="success">Upload successfully</div>}
    </>
  );
}
