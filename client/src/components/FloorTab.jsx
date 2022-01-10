import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { getShapesSpecified } from '../api';
import { AuthContext } from '../authContext/AuthContext';
import { BuildingContext } from '../buildingContext/BuildingContext';
import { ShapeContext } from '../shapeContext/context';
import ConfirmDialog from './ConfirmDialog';
import EditCanvasForm from './EditCanvasForm';
import EditImageForm from './EditImageForm';
import EditTitleForm from './EditTitleForm';
import EditUserForm from './EditUserForm';
import './floorTab.css';
import Modal from './Modal';

function FloorTab() {
  const optionRef = useRef(null);
  const [showOption, setShowOption] = useState(false);
  const { shapes, dispatch, createDiagram } = useContext(ShapeContext);
  const { user, dispatch: userDispatch } = useContext(AuthContext);
  const { building } = useContext(BuildingContext);
  const [shapeList, setShapeList] = useState([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedDel, setSelectedDel] = useState(null);
  const [isOpenEditCanvas, setIsOpenEditCanvas] = useState(false);
  const [isOpenEditUsers, setIsOpenEditUsers] = useState(false);
  const [isOpenEditImage, setIsOpenEditImage] = useState(false);
  const [isOpenEditTitle, setIsOpenEditTitle] = useState(false);

  function handleClickOutside(event) {
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setShowOption(false);
    } else {
      setShowOption(true);
    }
  }
  // Bind the event listener
  document.addEventListener('mousedown', handleClickOutside);
  useEffect(() => {
    const getListShape = async () => {
      const { data } = await axios.get(
        'http://localhost:5000/api/floors/all/' + building._id,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            sub: user.sub,
          },
        }
      );
      setShapeList(data);
    };
    getListShape();
  }, [user.sub, user.token, shapes.title, building._id]);

  const handleClick = (id) => {
    getShapesSpecified(id, user, dispatch);
  };

  const handleDelete = (id) => {
    setSelectedDel(id);
    setIsOpenDialog(true);
  };
  const onDelete = async (res) => {
    if (res) {
      getShapesSpecified(selectedDel, user, dispatch);
      try {
        const { data } = await axios.delete(
          'http://localhost:5000/api/floors/' + selectedDel,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: {
              sub: user.sub,
            },
          }
        );
        setShapeList((prevState) =>
          prevState.filter((s) => s._id !== data._id)
        );
      } catch (error) {
        alert(error.response.data.message);
      }
    }
    setIsOpenDialog(false);
  };

  const handleEditUsersClick = (id) => {
    handleClick(id);
    setIsOpenEditUsers(true);
  };

  const handleEditImageClick = (id) => {
    handleClick(id);
    setIsOpenEditImage(true);
  };

  const handleEditTitleClick = (id) => {
    handleClick(id);
    setIsOpenEditTitle(true);
  };

  const handleCloseCanvasForm = () => {
    setIsOpenEditCanvas(false);
    userDispatch({ type: 'RESET_OBJ_ACT' });
  };

  const handleCloseUsersForm = () => {
    setIsOpenEditUsers(false);
    userDispatch({ type: 'RESET_OBJ_ACT' });
  };

  const handleCloseImageForm = () => {
    setIsOpenEditImage(false);
    userDispatch({ type: 'RESET_OBJ_ACT' });
  };

  const handleCloseTitleForm = () => {
    setIsOpenEditTitle(false);
    userDispatch({ type: 'RESET_OBJ_ACT' });
  };

  const handleNew = async () => {
    dispatch({ type: 'RESET' });
    const res = await createDiagram(building);
    if (res) {
      setIsOpenEditCanvas(true);
    }
  };
  return (
    <div className="floor-tab-container">
      <Modal
        title="Edit infomation"
        open={isOpenEditCanvas}
        onClose={handleCloseCanvasForm}
      >
        <EditCanvasForm data={shapes} onClose={handleCloseCanvasForm} />
      </Modal>
      <Modal
        title="Edit users"
        open={isOpenEditUsers}
        onClose={handleCloseUsersForm}
      >
        <EditUserForm data={shapes} onClose={handleCloseUsersForm} />
      </Modal>
      <Modal
        open={isOpenEditImage}
        title="Edit Background"
        onClose={handleCloseImageForm}
      >
        <EditImageForm data={shapes} onClose={handleCloseImageForm} />
      </Modal>
      <Modal
        title="Warning!"
        open={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      >
        <ConfirmDialog
          content="Do you want to delete this floor?"
          onHandle={onDelete}
        />
      </Modal>
      <Modal
        title="Edit title"
        open={isOpenEditTitle}
        onClose={() => setIsOpenEditTitle(false)}
      >
        <EditTitleForm data={shapes} onClose={handleCloseTitleForm} />
      </Modal>
      <div
        ref={optionRef}
        className="option-list"
        style={{
          maxHeight: showOption ? 700 : 0,
          transition: 'max-height 0.2s ease-out',
          overflow: 'hidden',
        }}
      >
        <ul className="list-block">
          {shapeList.map((s) => (
            <li
              key={s._id}
              className={
                shapes._id === s._id ? 'option-item active' : 'option-item'
              }
              onClick={() => handleClick(s._id)}
            >
              {s.title}
            </li>
          ))}
        </ul>
        <ul className="list-block">
          <li
            className="option-item"
            onClick={() => handleEditTitleClick(shapes._id)}
          >
            Rename <strong>{shapes.title}</strong>
          </li>
          <li
            className="option-item"
            onClick={() => handleEditUsersClick(shapes._id)}
          >
            Edit user <strong>{shapes.title}</strong>
          </li>
          <li
            className="option-item"
            onClick={() => handleEditImageClick(shapes._id)}
          >
            Edit background <strong>{shapes.title}</strong>
          </li>
          <li className="option-item" onClick={() => handleDelete(shapes._id)}>
            Remove <strong>{shapes.title}</strong>
          </li>
        </ul>
      </div>
      <div
        className="floor-tab-item options"
        onClick={() => setShowOption((prevState) => !prevState)}
      >
        <i className="fa fa-ellipsis-v btn-icon more"></i>
      </div>
      {shapeList
        .map((s) => (
          <div
            key={s._id}
            className={
              shapes._id === s._id ? 'floor-tab-item active' : 'floor-tab-item'
            }
            onClick={() => handleClick(s._id)}
          >
            {s.title}
          </div>
        ))
        .reverse()}
      <div className="floor-tab-item">
        <i className="fa fa-plus btn-icon add" onClick={handleNew}></i>
      </div>
    </div>
  );
}

export default FloorTab;
