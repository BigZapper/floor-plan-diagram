import jwt from "jsonwebtoken";
import { newEnforcer } from "casbin";
import path, { join } from "path";
import { SUB } from "./constants.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const generateTokenWithRole = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      role: user.sub,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

const myKeyMatch = (key1, key2) => {
  if (Array.isArray(key1)) {
    let flag = true;
    key1.forEach((k) => {
      if (!new RegExp(key2).test(k)) {
        flag = false;
      }
    });
    return flag;
  } else {
    return new RegExp(key1).test(key2);
  }
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      async (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          const __dirname = path.resolve();
          const enforcer = await newEnforcer(
            join(__dirname, "/api/casbin_conf/model.conf"),
            join(__dirname, "/api/casbin_conf/policy.csv")
          );
          enforcer.addFunction("my_func", myKeyMatch);
          const sub = req.query.sub || "";
          const obj = req.query.obj || req.originalUrl;
          const act = req.query.act || req.method;
          // enforcer.addFunction()
          const result = await enforcer.enforce(sub, obj, act);
          if (result) {
            next();
          } else {
            res
              .status(403)
              .send({ message: `${SUB[sub]} cannot ${act} on ${obj}` });
          }
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "You have not permisson" });
  }
};
