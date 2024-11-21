// backend/routes/user.js
const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { success }= signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Invalid inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username
  });
  if (existingUser) {
    return res.status(411).json({
      msg: "Email already taken",
    });
  }

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password
  });

  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
})

  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    msg: "User created successfully!",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional()
})

router.put("/", authMiddleware, async (req, res) => {
  const {success} = updateBody.safeParse(req.body);
  if (!success){
    res.json({
      msg: "Error while updating information!"
    })
  }
  
  await User.updateOne({_id: req.userId}, req.body)
  res.json({
    msg: "Updated successfully!"
  })

})

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})

module.exports = router;
