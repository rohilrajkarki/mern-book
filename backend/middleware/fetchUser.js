var jwt = require('jsonwebtoken');
const JWT_SEC = 'ThisIsgreate'//env ma rakhne (hash)

const fetchUser = (req, res, next) => {
    //JWT bata user liyera ani req object ma id add garne
    const token = req.header('auth-token');//thunderclient ma header bata lyako
    if (!token) {
        res.status(401).send({ error: "Token Invalid" })
    }

    try {
        const data = jwt.verify(token, JWT_SEC);
        // console.log(data.user)
        req.user = data.user;
        // console.log(req.user.id)
        next()
    } catch (error) {
        res.status(401).send({ error: " Invalid Token" })

    }
}

module.exports = fetchUser


