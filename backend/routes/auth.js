const express = require('express');
const User = require('../model/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

var JWT_SECRET = 'Iamaverygoodbo$y';

//Route-1 : Create a user using post "api/auth/createuser". No login Required

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 5 charercters').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
], async (req, res) => {
    success = false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email alredy exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error")
    }
})


//Route-2 : Authenticate  a user using post "api/auth/login". No login Required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be black').exists()
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ error: "Email does not exist" })
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            success = false
            return res.status(400).json({ success, error: "Enter correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error")
    }
})


//Route-3 : Get logged in user details using post "api/auth/getuser". Login Required

router.post('/getuser',fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId);
        res.send(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

    module.exports = router;