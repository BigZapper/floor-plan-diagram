import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import shapeRouter from './routes/shapeRoutes.js';
import floorRouter from './routes/floorRoutes.js';
import userRouter from './routes/userRoutes.js';
import buildingRouter from './routes/buildingRoutes.js';
import groupRouter from './routes/groupRoutes.js';
import projectRouter from './routes/projectRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    process.env.MONGODB_URL ||
      'mongodb+srv://dongha:dongha@drawio.mzzki.mongodb.net/drawio?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to mongoDB'))
  .catch((err) => console.log(err));

app.use('/api/floors', floorRouter);
app.use('/api/users', userRouter);
app.use('/api/buildings', buildingRouter);
app.use('/api/groups', groupRouter);
app.use('/api/projects', projectRouter);
app.use('/api/shapes', shapeRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
