const users = require("../users/users-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`request method: ${req.method}, request url: ${req.url}, timestamp: ${new Date()}`)
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const id = req.params.id;
  try {
    const getId = await users.getById(id);
    if (!getId) {
      res.status(404).json({ message: "user not found" });
    } else {
      req.user = getId;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { body } = req;
  try {
    if(Object.keys(body).length === 0){
      res.status(400).json({ message: "missing user data" });
    } else if (!body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { body } = req.body;
  try {
    if(Object.keys(body).length === 0) {
      res.status(400).json({ message: "missing post data" });
    } else if(!body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}