import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Shape from '../models/shapeModel.js';
import Group from '../models/groupModels.js';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth } from '../utils.js';
import mongoose from 'mongoose';

const groupRouter = express.Router();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
groupRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const groups = await Group.find().populate('shapes').populate('projects');
    res.send(groups);
  })
);
groupRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const group = new Group({
      title: req.body.title || 'New group',
      shapes: [],
      users: [req.user._id],
      projects: [],
    });
    const createdGroup = await group.save();
    res.status(201).send(createdGroup);
  })
);

function runUpdateShapes(s) {
  return new Promise((resolve, reject) => {
    //you update code here
    Shape.findOneAndUpdate(
      { id: s.id },
      { $set: s },
      { upsert: true, new: true },
      function (err, result) {
        if (err) reject(err);
        resolve(result._id);
      }
    );
  });
}

groupRouter.put(
  '/:id/remove_shape',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const shapeId = mongoose.Types.ObjectId(req.body.shape._id);
    // await Shape.findByIdAndUpdate(shapeId, { $set: { group: null } });
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $pull: {
        shapes: shapeId,
        users: req.body.shape.staff._id,
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/remove_shapes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shapes = req.body.shapes;
    let groups = req.body.groups.filter(onlyUnique);
    const shapeIds = shapes.map((s) => s._id);
    const userIds = shapes
      .map((s) => mongoose.Types.ObjectId(s.staff._id))
      .filter(onlyUnique);
    // await Shape.updateMany(
    //   { _id: { $in: shapeIds } },
    //   { $set: { group: null } }
    // );
    const group = await Group.update(
      { _id: { $in: groups } },
      {
        $pullAll: {
          shapes: shapeIds,
          users: userIds,
        },
      },
      { multi: true }
    );
    res.send(group);
  })
);

groupRouter.put(
  '/:id/add_shape',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        shapes: req.body.shape._id,
        users: req.body.shape.staff,
        projects: req.body.shape.project,
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/:id/add_shapes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shapes = req.body.shapes;
    const shapeIds = shapes.map((s) => s._id);
    const userIds = shapes
      .map((s) => mongoose.Types.ObjectId(s.staff._id))
      .filter(onlyUnique);

    const result = await Group.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        shapes: { $each: shapeIds },
        users: { $each: userIds },
      },
    });
    res.send(result);
  })
);

groupRouter.put(
  '/:id/add_project',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        projects: req.body.project,
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/:id/add_user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        users: req.body.user,
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/:id/edit_title',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/:id/del_shape',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shape = Shape.findById(req.body.shape._id);
    if (shape) {
      shape.group = null;
      await shape.save();
    }
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $pull: {
        shapes: { _id: req.body.shape._id },
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/:id/del_user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $pull: {
        users: { _id: req.body.user._id },
      },
    });
    res.send(group);
  })
);

groupRouter.put(
  '/:id/del_project',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate(req.params.id, {
      $pull: {
        projects: { _id: req.body.project._id },
      },
    });
    res.send(group);
  })
);

groupRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);
    res.send(group);
  })
);

groupRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    await Group.findByIdAndDelete(req.params.id);
    res.status(200);
  })
);

groupRouter.get(
  '/search/:keyword',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const groups = await Group.find({
      title: { $regex: req.params.keyword, $options: 'i' },
    })
      .populate('shapes')
      .populate({
        path: 'projects',
        populate: {
          path: 'shapes',
          model: 'Shape',
          populate: [
            {
              path: 'staff',
              model: 'User',
            },
            {
              path: 'floor',
              model: 'Floor',
              populate: {
                path: 'building',
                model: 'Building',
              },
            },
          ],
        },
      });

    const projects = await Project.find({
      title: { $regex: req.params.keyword, $options: 'i' },
    }).populate({
      path: 'shapes',
      model: 'Shape',
      populate: {
        path: 'floor',
        model: 'Floor',
        populate: [
          {
            path: 'building',
            model: 'Building',
          },
          {
            path: 'shapes',
            model: 'Shape',
          },
        ],
      },
    });

    const users = await User.find({
      username: { $regex: req.params.keyword, $options: 'i' },
    }).select('-password');
    res.send({ groups, projects, users });
  })
);

export default groupRouter;
