import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.json('khong tim thay')
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.PORT, (err, user) => {
        if (err) return res.json('loi')
        req.user = user
        next()
    })
}

export default verifyToken