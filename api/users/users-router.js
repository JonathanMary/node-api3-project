const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const users = require("./users-model");
const posts = require("../posts/posts-model");
// The middleware functions also need to be required
const { logger, validateUserId, validateUser, validatePost } = require("../middleware/middleware.js");
const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
    users.get()
         .then(users => {
           res.status(200).json(users);
         })
         .catch(next)
});

router.get('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post('/', logger, validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(next)
});

router.put('/:id', logger, validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const id = req.params.id;
  const body = req.body;
  users.update(id, body)
  .then(() => {
    res.status(200).json({id: parseInt(id), ...body});
  })
  .catch(next)
});

router.delete('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  users.remove(req.params.id)
  .then(() => {
    res.status(200).json(req.user)
  })
  .catch(next)
});

router.get('/:id/posts', logger, validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  console.log("USING THE GOOD ONE")
  posts.get()
       .then(posts => {
         const filterPosts = posts.filter(post => {
          return post.user_id === parseInt(req.params.id);
        });
         res.status(200).json(filterPosts);
       })
       .catch(next)
});

router.post('/:id/posts', logger, validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  posts.insert(req.body)
       .then(post => {
         console.log("POST posts-model: ", res)
         res.status(200).json(post);
       })
       .catch(next)
});

// do not forget to export the router
module.exports = router;