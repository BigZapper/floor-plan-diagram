import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  addGroup,
  addProject,
  addShape,
  addShapestoGroup,
  addShapestoProject,
  getShapesSpecified,
  removeShapeFromGroup,
  removeShapeFromProject,
  removeShapesFromGroup,
  removeShapesFromProject,
} from '../api';
import { AuthContext } from '../authContext/AuthContext';
import { BuildingContext } from '../buildingContext/BuildingContext';
import { ShapeContext } from '../shapeContext/context';
import ConfirmDialog from './ConfirmDialog';
import EditCanvasForm from './EditCanvasForm';
import EditImageForm from './EditImageForm';
import EditUserForm from './EditUserForm';
import GroupForm from './GroupForm';
import Modal from './Modal';
import ProjectForm from './ProjectForm';
import UserBar from './UserBar';
import Widget from './Widget';

function Inspector() {
  const {
    shapes,
    selectShapes,
    selected,
    dispatch,
    updateAttribute,
    saveDiagram,
    lockBackground,
    setLockBackground,
    updateGroups,
    updateProjects,
    groups,
    setGroups,
    projects,
    setProjects,
  } = useContext(ShapeContext);

  const { user, dispatch: userDispatch } = useContext(AuthContext);
  const { building } = useContext(BuildingContext);
  const [shapeList, setShapeList] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [isOpenEditCanvas, setIsOpenEditCanvas] = useState(false);
  const [isOpenEditUsers, setIsOpenEditUsers] = useState(false);
  const [isOpenEditImage, setIsOpenEditImage] = useState(false);
  const [isOpenGroupForm, setIsOpenGroupForm] = useState(false);
  const [isOpenProjectForm, setIsOpenProjectForm] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedDel, setSelectedDel] = useState(null);
  const [floorGroup, setFloorGroup] = useState([]);
  const [floorProject, setFloorProject] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedShape, setSelectedShape] = useState(
    selected.length === 1 && selected[0]
      ? shapes.shapes?.find((s) => s.id === selected[0])
      : ''
  );
  const [selectedShapes, setSelectedShapes] = useState(
    selected && shapes.shapes.filter((s) => selected.includes(s.id))
  );

  useEffect(() => {
    if (selected.length === 1 && selected[0]) {
      setSelectedShape(shapes.shapes?.find((s) => s.id === selected[0]));
    } else setSelectedShape('');
  }, [selected, shapes.shapes]);

  useEffect(() => {
    if (selected) {
      setSelectedShapes(shapes.shapes.filter((s) => selected.includes(s.id)));
    } else setSelectedShapes([]);
  }, [selected, shapes.shapes]);

  const updateAttr = useCallback(
    (event) => {
      if (!user.act.includes('add_shape')) {
        if (!user.act.includes('edit_shape')) {
          userDispatch({
            type: 'CHANGE_ACT_OBJ',
            payload: {
              act: [...user.act, 'edit_shape'],
              obj: 'shape',
            },
          });
        }
      }
      const attr = event.target.name;
      updateAttribute(attr, event.target.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateAttribute]
  );

  const handleAddGroup = useCallback(
    async (event) => {
      if (!user.act.includes('add_shape')) {
        if (!user.act.includes('edit_shape')) {
          userDispatch({
            type: 'CHANGE_ACT_OBJ',
            payload: {
              act: [...user.act, 'edit_shape'],
              obj: 'shape',
            },
          });
        }
      }
      // Nếu shape đã có group cũ => gỡ shape này trong group cũ
      if (selectedShape.group) {
        await removeShapeFromGroup(selectedShape.group, selectedShape, user);
      }
      await addShape(selectedShape._id, selectedShape, user).then(() => {
        const attr = event.target.name;
        updateAttribute(attr, event.target.value);
        addGroup(event.target.value, selectedShape, user);
        saveDiagram(shapes, true);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateAttribute, selectedShape?._id]
  );

  const handleAddProject = useCallback(
    async (event) => {
      if (!user.act.includes('add_shape')) {
        if (!user.act.includes('edit_shape')) {
          userDispatch({
            type: 'CHANGE_ACT_OBJ',
            payload: {
              act: [...user.act, 'edit_shape'],
              obj: 'shape',
            },
          });
        }
      }
      // Nếu shape đã có project cũ => gỡ shape này trong project cũ
      if (selectedShape.project) {
        await removeShapeFromProject(
          selectedShape.project,
          selectedShape,
          user
        );
      }
      await addShape(selectedShape._id, selectedShape, user).then(() => {
        const attr = event.target.name;
        updateAttribute(attr, event.target.value);
        addProject(event.target.value, selectedShape, user);
        saveDiagram(shapes, true);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateAttribute]
  );

  const handleAddGroups = async (e) => {
    const groupIds = selectedShapes.map((s) => s.group);
    await removeShapesFromGroup(groupIds, selectedShapes, user);
    addShapestoGroup(e.target.value, selectedShapes, user);
    updateGroups(selectedShapes, e.target.value);
    saveDiagram(shapes, true);
  };

  const handleAddProjects = async (e) => {
    const projectIds = selectedShapes.map((s) => s.project);
    await removeShapesFromProject(projectIds, selectedShapes, user);
    addShapestoProject(e.target.value, selectedShapes, user);
    updateProjects(selectedShapes, e.target.value);
    saveDiagram(shapes, true);
  };

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

  const handleEditCanvasClick = (id) => {
    handleClick(id);
    setIsOpenEditCanvas(true);
  };

  const handleEditUsersClick = (id) => {
    handleClick(id);
    setIsOpenEditUsers(true);
  };

  const handleEditImageClick = (id) => {
    handleClick(id);
    setIsOpenEditImage(true);
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

  const handleSearch = (e) => {
    setListSearch(shapeList.filter((b) => b.title.includes(e.target.value)));
  };

  const handleSave = () => {
    saveDiagram();
  };

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
    const getGroups = async () => {
      const { data } = await axios.get('http://localhost:5000/api/groups/', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      });
      const thisFloor = shapes.shapes
        .filter((s) => s.group)
        .map((s) => s.group);
      setGroups(data);
      setFloorGroup(data.filter((s) => thisFloor.includes(s._id)));
    };

    const getProjects = async () => {
      const { data } = await axios.get('http://localhost:5000/api/projects/', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      });
      setProjects(data);
    };
    getProjects();
    getGroups();
    getListShape();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.sub, user.token, shapes.title, building._id, shapes.shapes]);

  useEffect(() => {
    const choosenGroup = selectedShapes.map((s) => s.group).filter(onlyUnique);
    if (choosenGroup.length === 1) {
      setAvailableProjects(projects.filter((s) => s.group === choosenGroup[0]));
    }
  }, [projects, selectedShapes]);

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

  useEffect(() => {
    setListSearch(shapeList);
    setSelectedProject(null);
    setSelectedGroup(null);
  }, [shapeList]);

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

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  useEffect(() => {
    const thisFloor = shapes.shapes
      .filter((s) => s.project)
      .map((s) => s.project)
      .filter(onlyUnique);
    setFloorProject(projects?.filter((s) => thisFloor.includes(s._id)));
  }, [projects, shapes.shapes]);

  return (
    <aside className="panel">
      <UserBar />
      <div className="panel-container">
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
          title="Edit image"
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
          title="Add new group"
          open={isOpenGroupForm}
          onClose={() => setIsOpenGroupForm(false)}
        >
          <GroupForm
            projects={projects}
            onclose={() => setIsOpenGroupForm(false)}
            user={user}
          />
        </Modal>
        <Modal
          title="Add new project"
          open={isOpenProjectForm}
          onClose={() => setIsOpenProjectForm(false)}
        >
          <ProjectForm
            groups={groups}
            onclose={() => setIsOpenProjectForm(false)}
            user={user}
          />
        </Modal>
        <Widget collapsed={true} title="Floor plan">
          <>
            <form className="search">
              <i className="fa fa-search icon" />
              <input
                type="text"
                className="form-control input-field m-auto"
                placeholder="Search floors"
                onChange={handleSearch}
              />
            </form>
            <ul className="shapeList todos">
              {listSearch.map((s) => (
                <li
                  key={s._id}
                  className={
                    shapes._id === s._id
                      ? 'list-group-item d-flex justify-content-between align-items-center active'
                      : 'list-group-item d-flex justify-content-between align-items-center'
                  }
                >
                  <span
                    className="buildingItems"
                    onClick={() => handleClick(s._id)}
                  >
                    {s.title}
                  </span>
                  <i
                    className="fa fa-camera-retro btn-icon edit-image"
                    onClick={() => handleEditImageClick(s._id)}
                  ></i>
                  <i
                    className="fa fa-user-plus btn-icon add-user"
                    onClick={() => handleEditUsersClick(s._id)}
                  ></i>
                  <i
                    className="fa fa-pencil-square-o btn-icon edit"
                    onClick={() => handleEditCanvasClick(s._id)}
                  />
                  <i
                    className="fa fa-trash-o btn-icon delete"
                    onClick={() => handleDelete(s._id)}
                  />
                </li>
              ))}
            </ul>
          </>
        </Widget>
        <Widget collapsed={true} title="Groups">
          <ul className="shapeList todos">
            {floorGroup?.map((g) => (
              <li
                key={g._id}
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
              </li>
            ))}
            {user.isAdmin && (
              <div className="btn new" onClick={() => setIsOpenGroupForm(true)}>
                <i className="fa fa-plus mr-2"> </i> Add new group
              </div>
            )}
          </ul>
        </Widget>
        <Widget collapsed={true} title="Projects">
          <ul className="shapeList todos">
            {floorProject?.map((p) => (
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
            {user.isAdmin && (
              <div
                className="btn new"
                onClick={() => setIsOpenProjectForm(true)}
              >
                <i className="fa fa-plus mr-2"> </i> Add new project
              </div>
            )}
          </ul>
        </Widget>
        {selected.length > 1 && (
          <Widget collapsed={false} title="Selected shapes">
            <>
              <div className="key">
                Add to group{' '}
                <select
                  name="group"
                  disabled={!user.isAdmin}
                  className="select-field shapeInfo"
                  defaultValue={
                    new Set(selectedShapes.map((s) => s.group)).size === 1
                      ? selectedShapes[0].group
                      : ''
                  }
                  onChange={handleAddGroups}
                >
                  <option value={''}>Choose group</option>
                  {groups &&
                    groups.map((g) => (
                      <option
                        disabled={!user.isAdmin}
                        selected={
                          new Set(selectedShapes.map((s) => s.group)).size === 1
                            ? selectedShapes[0].group
                            : ''
                        }
                        value={g._id}
                        key={g._id}
                      >
                        {g.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="key">
                Add to project{' '}
                <select
                  name="project"
                  disabled={!user.isAdmin}
                  className="select-field shapeInfo"
                  defaultValue={
                    new Set(selectedShapes.map((s) => s.project)).size === 1
                      ? selectedShapes[0].project
                      : ''
                  }
                  onChange={handleAddProjects}
                >
                  <option value={''}>Choose project</option>
                  {availableProjects &&
                    availableProjects.map((p) => (
                      <option
                        disabled={!user.isAdmin}
                        selected={
                          new Set(selectedShapes.map((s) => s.project)).size ===
                          1
                            ? selectedShapes[0].project
                            : ''
                        }
                        value={p._id}
                        key={p._id}
                      >
                        {p.title}
                      </option>
                    ))}
                </select>
              </div>
            </>
          </Widget>
        )}
        {selectedShape && selectedShape.type !== 'image' ? (
          <>
            {user.sub < '4' && (
              <Widget collapsed={false} title={'Properties'}>
                <div className="key">
                  Stroke{' '}
                  <input
                    className="value"
                    name="stroke"
                    type="color"
                    value={selectedShape.stroke}
                    onChange={updateAttr}
                  />
                </div>

                <div className="key">
                  Fill{' '}
                  <input
                    className="value"
                    name="fill"
                    type="color"
                    value={selectedShape.fill}
                    onChange={updateAttr}
                  />
                </div>

                <div className="key">
                  Color{' '}
                  <input
                    className="value"
                    name="color"
                    type="color"
                    value={selectedShape.color}
                    onChange={updateAttr}
                  />
                </div>
              </Widget>
            )}
            <Widget title="Details" collapsed={false}>
              <>
                <div className="key">
                  Staff:{' '}
                  <select
                    name="staff"
                    disabled={user.sub === '4'}
                    className="select-field shapeInfo"
                    defaultValue={selectedShape.staff?._id}
                    onChange={updateAttr}
                  >
                    <option value={''}>Choose user</option>
                    {shapes &&
                      shapes.users?.map((u) => (
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
                </div>
                <div className="key">
                  Computer:{' '}
                  <input
                    disabled={user.sub === '4'}
                    className="value shapeInfo"
                    name="computer"
                    type="text"
                    value={selectedShape.computer}
                    onChange={updateAttr}
                  />
                </div>
                <div className="key">
                  Monitor:{' '}
                  <input
                    disabled={user.sub === '4'}
                    className="value shapeInfo"
                    name="monitor"
                    type="text"
                    value={selectedShape.monitor}
                    onChange={updateAttr}
                  />
                </div>
                <div className="key">
                  Peripheral:{' '}
                  {/* <span className="value">{selectedShape.peripheral}</span> */}
                  <input
                    disabled={user.sub === '4'}
                    className="value shapeInfo"
                    name="peripheral"
                    type="text"
                    value={selectedShape.peripheral}
                    onChange={updateAttr}
                  />
                </div>
                <div className="key">
                  Group{' '}
                  <select
                    name="group"
                    disabled={!user.isAdmin}
                    className="select-field shapeInfo"
                    defaultValue={selectedShape.group?._id}
                    onChange={handleAddGroup}
                  >
                    <option value={''}>Choose group</option>
                    {groups &&
                      groups.map((g) => (
                        <option
                          disabled={!user.isAdmin}
                          selected={selectedShape.group === g._id}
                          value={g._id}
                          key={g._id}
                        >
                          {g.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="key">
                  Project{' '}
                  <select
                    name="project"
                    disabled={!user.isAdmin}
                    className="select-field shapeInfo"
                    defaultValue={selectedShape.project?._id}
                    onChange={handleAddProject}
                  >
                    <option value={''}>Choose project</option>
                    {availableProjects &&
                      availableProjects.map((p) => (
                        <option
                          disabled={!user.isAdmin}
                          selected={selectedShape.project === p._id}
                          value={p._id}
                          key={p._id}
                        >
                          {p.title}
                        </option>
                      ))}
                  </select>
                </div>
                {user.sub < '4' && (
                  <div className="btn edit" onClick={handleSave}>
                    <i className="fa fa-save mr-2"> </i> Save
                  </div>
                )}
              </>
            </Widget>
          </>
        ) : (
          <div className="key" style={{ padding: 15 }}>
            Lock background{' '}
            <input
              className="value"
              name="stroke"
              type="checkbox"
              checked={lockBackground}
              onChange={(e) => setLockBackground(e.target.checked)}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

export default Inspector;
