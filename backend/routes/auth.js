const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const fetchUser = require('../middleware/fetchUser')

const JWT_SEC = 'ThisIsgreate'//env ma rakhne (hash)

//Route1: Create User using : POST "/api/auth". No login required
router.post('/createuser',
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    async (req, res) => {
        // const user = User(req.body)
        // user.save()
        // res.send(req.body)
        //validation part
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // User.create({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password,
        // }).then(user => res.json(user))
        //     .catch(err => {
        //         // console.log(err)
        //         res.json({ error: 'Please enter unique email', message: err.message })
        //     })

        //email exists or not
        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ error: "Sorry user with email exists" });
            }
            const salt = bcrypt.genSaltSync(10);
            const secPassword = bcrypt.hashSync(req.body.password, salt);
            user = await User.create({ //async await use garda .then chaiiyena
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
            })
            const data = {
                theuser: {
                    id: user.id
                }
            }
            var token = jwt.sign(data, JWT_SEC);//sign synchronous method ho so await parena
            //yo token use garera mathiko data wala data feri nikalna sakinxa ani JWT_SEC-
            //le chaii token alter garya xakinaii herna paiiyo
            // console.log(token)
            res.json(token)
        } catch (error) { // in case aaru error aauta crash nahos so
            res.status(500).send("some error occured")
        }
    })

//Route2: Authenticate User using : POST "/api/auth". No login required
router.post('/login',
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Invalid credentials (mail)" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ error: "Worng Password" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            // console.log(data)
            const authtoken = jwt.sign(data, JWT_SEC);
            res.json({ authtoken })

        } catch (error) {
            console.log(error)
            res.status(500).send("some error occured")
        }
    });

//Route1: Get logged In User details : POST "/api/getuser". 
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        // console.log(req.user)
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")//password bahek aaru select
        // console.log(user)
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send("some error occured")
    }
})

module.exports = router
