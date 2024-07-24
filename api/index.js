const userRoute = require('./userApi')
const authRoute = require('./authApi')
const buildingRoute = require('./buildingApi')
const reviewRoute = require('./reviewApi')
const smallUnitRoute = require('./smallUnitApi')

const mountRouts = (app) => {
    app.use("/api/v1/users", userRoute);
    app.use("/api/v1/auth", authRoute);
    app.use("/api/v1/buildings", buildingRoute);
    app.use("/api/v1/reviews", reviewRoute);
    app.use("/api/v1/smallUnits", smallUnitRoute);
}

module.exports = mountRouts;