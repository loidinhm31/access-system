const express = require("express");

const UserService = require('../services/UserService');

const router = new express.Router();

const auth = require('../middleware/auth');

router.post('/users/signup', async (req, res) => {
    try {
        const userToken = await UserService.prototype.createUser(req.body);
        res.status (201).send({userToken});
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const userToken = await UserService.prototype.loginUser(req.body.sso, req.body.password);
        res.status(200).send(userToken);
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        await UserService.prototype.logoutUser(req);
        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/clear', auth, async (req, res) => {
    try {
        await UserService.prototype.clearTokens(req.user);
    } catch (e) {
        res.status(500).send();
    }
})


router.get('/users/me', auth,  async (req, res) => {
    const user = req.user;

    res.send({
        sso: user.sso,
        username: user.username,
        name: user.firstName + ' ' + user.lastName
    });
})

router.get('/users/:sso', auth,  async (req, res) => {
    const sso = req.params.sso;

    try {
        const user = await UserService.prototype.getOneUser();
        res.send({
            sso: user.sso,
            username: user.username,
            name: user.firstName + ' ' + user.lastName
        });
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:sso', async (req, res) => {
   try {
       const user = await UserService.prototype.updateUser(req.params.sso);
       res.send(user);
   } catch (e) {
       res.status(500)
           .send({
               message: e.message
           });
   }
})


module.exports = router;
