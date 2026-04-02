
const { response } = require("../../utils/response");
const jwt = require("jsonwebtoken")

exports.ensureWebTokenForAdmin= (req, res, next) =>{
    const x_access_token = req.headers['authorization'];
    
    if (x_access_token) {
        req.token = x_access_token.replace("Bearer ", "");
        verifyJWTForAdmin(req, res, next);
    } else {
        res.status(401).json(response(false, "Unauthorized"));
    }
  }

var verifyJWTForAdmin =(req, res, next) =>{
    jwt.verify(req.token,process.env.ADMINJWTSECRETKEY, async function (err, data) {
        if (err) {
            res?.sendStatus(403);
        } else {
           
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.admin = _data['payload'];
            req.adminId = req.admin.id
            req.email = req.admin.email
           
            if (req.admin.role != 'admin') {
                return res.sendStatus(403);
            }
            next();
        }
    })
}

