import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Shape from '../models/shapeModel.js';
import Floor from '../models/floorModel.js';
import { isAuth } from '../utils.js';

const floorRouter = express.Router();

// CREATE A NEW FLOOR
floorRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin || req.user._id === req.body.admin) {
      const newFloor = new Floor({
        title: req.body.title,
        shapes: req.body.shapes,
        users: [
          { userId: req.user._id, role: '1' },
          { userId: req.body.admin, role: '2' },
        ],
        building: req.body.building,
        admin: req.body.admin,
      });

      const savedFloor = await newFloor.save();

      res.send(savedFloor);
    } else {
      res.status(403).send({ message: 'You have not permisson' });
    }
  })
);

// GET LASTEST FLOOR
floorRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const floor = await Floor.findOne(
      { 'users.userId': { $in: req.user._id } },
      {},
      { sort: { createdAt: -1 } }
    );
    res.send(floor);
  })
);

// GET LASTEST FLOOR BY BULDING ID
floorRouter.get(
  '/lastest/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
      const floor = await Floor.findOne(
        { building: req.params.id },
        {},
        { sort: { createdAt: -1 } }
      )
        .populate({
          path: 'shapes',
          populate: {
            path: 'staff',
            model: 'User',
          },
        })
        .populate('users.userId');
      res.send(floor);
    } else {
      const floor = await Floor.findOne(
        {
          $or: [
            { 'users.userId': { $in: req.user._id } },
            { admin: req.user._id },
          ],
          building: req.params.id,
        },
        {},
        { sort: { createdAt: -1 } }
      ).populate({
        path: 'shapes',
        populate: {
          path: 'staff',
          model: 'User',
        },
      });
      res.send(floor);
    }
  })
);

// GET ALL FLOORS
floorRouter.get(
  '/all',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const floors = await Floor.find(
      { 'users.userId': { $in: req.user._id } },
      null,
      {
        sort: { createdAt: -1 },
      }
    )
      .populate('users.userId', 'username')
      .populate('shapes.staff', 'username');
    res.send(floors);
  })
);

// GET ALL FLOORS BY BUILDING ID
floorRouter.get(
  '/all/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
      const floors = await Floor.find(
        {
          building: req.params.id,
        },
        null,
        {
          sort: { createdAt: -1 },
        }
      )
        .populate('users.userId', 'username')
        .populate({
          path: 'shapes',
          populate: {
            path: 'staff',
            model: 'User',
          },
        });
      res.send(floors);
    } else {
      const floors = await Floor.find(
        {
          $or: [
            { 'users.userId': { $in: req.user._id } },
            { admin: req.user._id },
          ],
          building: req.params.id,
        },
        null,
        {
          sort: { createdAt: -1 },
        }
      )
        .populate('users.userId', 'username')
        .populate({
          path: 'shapes',
          populate: {
            path: 'staff',
            model: 'User',
          },
        });
      res.send(floors);
    }
  })
);

// DELETE A FLOOR
floorRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const results = await Floor.findByIdAndDelete(req.params.id);

    res.send(results);
  })
);

// GET A FLOOR BY ID
floorRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const floor = await Floor.findById(
      req.params.id,
      {},
      { userId: req.user._id }
    )
      .populate('users.userId', 'username')
      .populate({
        path: 'shapes',
        populate: {
          path: 'staff',
          model: 'User',
        },
      });
    res.send(floor);
  })
);

// UPDATE A FLOOR BY ID

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
    // .then((result) => resolve(result && result._id))
    // .catch((err) => reject(err));
  });
}

floorRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let arr = req.body.shapes.slice();

    let shapes = [];
    arr.forEach((s) => shapes.push(runUpdateShapes(s)));
    Promise.all(shapes)
      .then(async (r) => {
        const floor = await Floor.findByIdAndUpdate(req.params.id, {
          $set: {
            title: req.body.title,
            shapes: r,
            users: req.body.users,
          },
        }).populate({
          path: 'shapes',
          populate: {
            path: 'staff',
            model: 'User',
          },
        });

        const savedFloor = await floor.save();

        res.send(savedFloor);
      })
      .catch((err) => console.log(err));
  })
);

export default floorRouter;
