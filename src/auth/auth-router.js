const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post('/login', jsonParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  console.log({ user_name, password });

  for (const [key, value] of Object.entries(loginUser)) {
    if (value === null || value === undefined) {
      return res.status(400).json({ error: `Missing ${key} in request body` });
    }
  }

  AuthService.getUserByUserName(req.app.get('db'), loginUser.user_name)
    .then((dbUser) => {
      if (!dbUser) {
        return res
          .status(400)
          .json({ error: 'Incorrect username or password' });
      }
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((match) => {
        if (!match) {
          return res
            .status(400)
            .json({ error: 'Incorrect username or password' });
        }
        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };
        res.send({ authToken: AuthService.createJWT(sub, payload) });
      });
    })
    .catch(next);
});

module.exports = authRouter;
