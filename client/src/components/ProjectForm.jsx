import React, { useContext, useState } from 'react';
import { createProject } from '../api';
import { ShapeContext } from '../shapeContext/context';

function ProjectForm({ groups, onclose, user }) {
  const { setProjects } = useContext(ShapeContext);
  const [project, setProject] = useState({
    title: '',
    group: '',
  });

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await createProject(project, user);
    setProjects((prevState) => [...prevState, data]);
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
            value={project.title}
            onChange={handleChange}
            type="text"
            className="input-field"
            name="title"
          />
        </label>
        <label htmlFor="group">
          <span>
            Group <span className="required">*</span>
          </span>
          <select
            value={project.groups}
            onChange={handleChange}
            name="group"
            className="select-field"
          >
            <option value={''}>Choose group</option>
            {groups?.map((g) => (
              <option value={g._id} key={g._id}>
                {g.title}
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

export default ProjectForm;
