import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import { ShapeContext } from '../shapeContext/context';
import { BuildingContext } from '../buildingContext/BuildingContext';
import './buildingList.css';
import Modal from './Modal';
import Loading from './Loading';
import EditBuildingForm from './EditBuildingForm';
import {
  createBuilding,
  deleteBuilding,
  getBuilding,
  getBuildingList,
  updateBuilding,
} from '../api';
import ConfirmDialog from './ConfirmDialog';

function BuildingList() {
  const { user } = useContext(AuthContext);
  const {
    dispatch: buildingDispatch,
    listBuilding,
    isFetching,
  } = useContext(BuildingContext);
  const { getFloors } = useContext(ShapeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedDel, setSelectedDel] = useState(null);
  const [titleNew, setTitleNew] = useState('');
  const [buildings, setBuildings] = useState(listBuilding);
  useEffect(() => {
    if (selectedBuilding) {
      setIsOpen(true);
    }
  }, [selectedBuilding]);

  const handleClick = (id) => {
    getFloors(id);
    getBuilding(id, user, buildingDispatch);
  };

  const handleNew = async () => {
    await createBuilding(titleNew, user, buildingDispatch);
    getBuildingList(user, buildingDispatch);
    setTitleNew('');
  };
  const handleEditBuildingClick = (id) => {
    setSelectedBuilding(id);
  };

  const handleDelete = (id) => {
    setIsOpenDialog(true);
    setSelectedDel(id);
  };

  const onDelete = (isDelete) => {
    if (isDelete) {
      deleteBuilding(selectedDel, user, buildingDispatch);
    }
    setIsOpenDialog(false);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setSelectedBuilding('');
  };

  const handleSubmit = (value) => {
    let temp = { ...value, users: [] };
    value.users.forEach((u) => temp.users.push({ user: u }));
    updateBuilding(temp, buildingDispatch, user);
    setIsOpen(false);
    getBuildingList(user, buildingDispatch);
  };

  const handleSearch = (e) => {
    setBuildings(listBuilding.filter((b) => b.title.includes(e.target.value)));
  };

  useEffect(() => {
    getBuildingList(user, buildingDispatch);
  }, [buildingDispatch, user]);
  useEffect(() => {
    setBuildings(listBuilding);
  }, [listBuilding]);

  return (
    <>
      {isFetching && <Loading />}
      <div className="container">
        <header className="text-center text-light my-4">
          <h3 className="mb-4">Building List</h3>
          <form className="search">
            <i className="fa fa-search icon" />
            <input
              type="text"
              className="form-control input-field m-auto"
              placeholder="Search buildings"
              onChange={handleSearch}
            />
          </form>
        </header>
        <Modal title="Edit building" open={isOpen} onClose={handleCloseForm}>
          <EditBuildingForm
            selectedBuilding={selectedBuilding}
            onclose={handleCloseForm}
            onSubmit={handleSubmit}
          />
        </Modal>
        <Modal
          title="Warning!"
          open={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
        >
          <ConfirmDialog content="Delete this building?" onHandle={onDelete} />
        </Modal>
        <ul className="list-group todos mx-auto text-light">
          {buildings?.map((s) => (
            <li
              key={s._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                className="buildingItems"
                onClick={() => handleClick(s._id)}
              >
                {s.title}
              </span>
              {/* <i className="fa fa-user-plus btn-icon add-user"></i> */}
              {user.isAdmin && (
                <>
                  <i
                    className="fa fa-pencil-square-o btn-icon edit"
                    onClick={() => handleEditBuildingClick(s._id)}
                  />
                  <i
                    className="fa fa-trash-o btn-icon delete"
                    onClick={() => handleDelete(s._id)}
                  />
                </>
              )}
            </li>
          ))}
        </ul>
        {user.isAdmin && (
          <form className="add text-center my-4">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control m-auto"
                name="add"
                placeholder="Add new building..."
                value={titleNew}
                onChange={(e) => setTitleNew(e.target.value)}
              />
              <div className="input-group-append">
                <button className="btn add" type="button" onClick={handleNew}>
                  <i className="fa fa-plus"></i> Add
                </button>
              </div>
            </div>
          </form>
        )}
        <footer className="text-center">
          <small>
            Copyright 1999-2021 by Refsnes Data. All Rights Reserved.
          </small>
          <small> W3Schools isPowered by W3.CSS.</small>
        </footer>
      </div>
    </>
  );
}

export default BuildingList;
