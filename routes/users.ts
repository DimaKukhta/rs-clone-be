import { Router, json } from 'express';
import * as dataBase from '../db/database';
import * as md5 from 'md5';

const router = Router();
router.get('/', async (req, res, next) => {
  const allUsers = await dataBase.getAllUsers();

  res.json(allUsers);
});

router.get('/:login', async (req, res, next) => {
  const user = await dataBase.getUser(req.params.login)
  res.
    status(user ? 200 : 404)
    .json(user ?? { statusCode: 404 });
});

router.post('/', async (req, res, next) => {
  const arrayOfUsers = await dataBase.getAllUsers(req.body.login);
  if (arrayOfUsers.length === 0) {
    const user = {
      ...req.body,
      'history': []
    };
    user.password = md5(user.password);
    const newUser = await dataBase.createUser(user);
    res.json(newUser);
  } else {
    res.json({
      statusCode: 300
    });
  }
});

router.put('/:login', async (req, res, next) => {
  const user = await dataBase.updateUser(req.params.login, req.body);
  res
    .status(user ? 200 : 400)
    .json(user ?? {
      statusCode: 404
    });
});

router.get('/history/:login', async (req, res, next) => {
  const user = await dataBase.getUserHistory(req.params.login);
  res
    .status(user ? 200 : 400)
    .json(user.history ?? {
      statusCode: 404
    });
});

router.get('/authorization/:login/:password', async (req, res, next) => {
  const password = md5(req.params.password);
  const user = await dataBase.getUserByKey(req.params.login, password);
  res
    .status(user ? 200 : 400)
    .json(user ?? {
      statusCode: 404
    });
})

export default router;
