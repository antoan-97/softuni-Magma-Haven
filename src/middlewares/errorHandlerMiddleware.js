const { getErrorMessage } = require('../utils/errorHelper');
exports.errorHandler = (err,req,res) =>{
    res.render('/404',{ error: getErrorMessage});
}