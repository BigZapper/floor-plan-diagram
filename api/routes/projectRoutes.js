import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Shape from '../models/shapeModel.js';
import Group from '../models/groupModels.js';
import Project from '../models/projectModel.js';
import { isAdmin, isAuth } from '../utils.js';
import mongoose from 'mongoose';

const projectRouter = express.Router();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
projectRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const projects = await Project.find().populate('shapes');
    res.send(projects);
  })
);
projectRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const project = new Project({
      title: req.body.project.title || 'New project',
      shapes: [],
      users: [req.user._id],
      group: req.body.project.group,
    });
    await project.save(async function (err, result) {
      await Group.findByIdAndUpdate(req.body.project.group, {
        $addToSet: { projects: result._id },
      });
      res.status(201).send(result);
    });
    // const group = await
  })
);

projectRouter.put(
  '/:id/remove_shape',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $pull: {
        shapes: req.body.shape._id,
        users: req.body.shape.staff._id,
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/remove_shapes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shapes = req.body.shapes;
    let projects = req.body.projects.filter(onlyUnique);
    const shapeIds = shapes.map((s) => s._id);
    const userIds = shapes
      .map((s) => mongoose.Types.ObjectId(s.staff._id))
      .filter(onlyUnique);
    const project = await Project.update(
      { _id: { $in: projects } },
      {
        $pullAll: {
          shapes: shapeIds,
          users: userIds,
        },
      },
      { multi: true }
    );
    res.send(project);
  })
);

projectRouter.put(
  '/:id/add_shape',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        shapes: req.body.shape._id,
        users: req.body.shape.staff,
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/:id/add_shapes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shapes = req.body.shapes;
    const shapeIds = shapes.map((s) => s._id);
    const userIds = shapes
      .map((s) => mongoose.Types.ObjectId(s.staff._id))
      .filter(onlyUnique);
    const temp = await Shape.find({ _id: { $in: shapeIds } });

    await Shape.insertMany(
      shapes.filter((s) => !temp.some((t) => t.id === s.id))
    );
    const r = await Shape.updateMany(
      { _id: { $in: shapeIds } },
      { $set: { project: req.params.id } }
    );
    console.log(r);
    const result = await Project.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        shapes: { $each: shapeIds },
        users: { $each: userIds },
      },
    });
    res.send(result);
  })
);

projectRouter.put(
  '/:id/add_group',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $set: {
        projects: req.body.group,
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/:id/add_user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $push: {
        users: req.body.user,
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/:id/edit_title',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/:id/del_shape',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shape = Shape.findById(req.body.shape._id);
    if (shape) {
      shape.project = null;
      await shape.save();
    }
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $pull: {
        shapes: { _id: req.body.shape._id },
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/:id/del_user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $pull: {
        users: { _id: req.body.user._id },
      },
    });
    res.send(project);
  })
);

projectRouter.put(
  '/:id/del_project',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $pull: {
        projects: { _id: req.body.project._id },
      },
    });
    res.send(project);
  })
);

projectRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.send(project);
  })
);

projectRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200);
  })
);

export default projectRouter;
