const ApiError = require('../utils/api_error');

const checkForeignKey = (Model, idFieldName) => async (req, res, next) => {
  const id = req.body[idFieldName] || req.params[idFieldName];
  
  if (!id) {
    return next(new ApiError(`${idFieldName} is required`, 400));
  }

  const document = await Model.findById(id);
  if (!document) {
    return next(new ApiError(`No document found with ID: ${id}`, 404));
  }

  next();
};

module.exports = checkForeignKey;
