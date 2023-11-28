const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authenticationRoutes = require('./routes/authentication');
const accountSettingRoutes = require('./routes/account-settings');
const userRoutes = require('./routes/user-routes');
const transactionRoutes = require('./routes/transaction-routes');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/project-routes');
const { handleError } = require('./utility/error-handler');
const { maintenanceModeEnabled } = require('./utility/keys');
const Sentry = require('./utility/sentry');

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
var path = require('path');
var dir = path.join(__dirname, 'public');
const utils = require('./utility/wallet-address');

// const swaggerSpec = swaggerJSDoc(options);

require('dotenv').config()

// const Sentry = require("@sentry/node");
// const Tracing = require("@sentry/tracing");

// Sentry.init({
//     dsn: "https://8b10680d26ca41468980fe155bece42f@o473219.ingest.sentry.io/5562421",
//     tracesSampleRate: 1.0,
//   });


app.use(cors());
const passport = require('passport');
const { sendWelcomeMsg } = require('./utility/otpCode');

require('./utility/passport');
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    if (maintenanceModeEnabled)
        res.send(503);
    else
        next();

});

app.use(express.static(dir));
app.use('/api/v1/users', authenticationRoutes);
app.use('/api/v1/users', accountSettingRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/transaction', transactionRoutes);

// app.use('/api-docs', swaggerUi.serve, swa ggerUi.setup(swaggerDocument));
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(function(req, res, next) {
    res.setHeader('X-Frame-Options', 'sameorigin');
    next();
  });

app.use((err, req, res, next) => {
 
    let errObject = {};

    if (process.env.environment == 'prod' || process.env.environment == 'staging') {
        errObject.statusCode = err.statusCode,
            errObject.message = err.message
    }

    else {
        errObject = err;
    }

    Sentry.captureException(err.stackTrace);
    handleError(errObject, res);
});


 //utils.generateTronWalletForAllUser();
// utils.generateTronRandomSeed();
// sendWelcomeMsg('03367005163','Muhammad Obaid' )
app.listen(process.env.PORT, err => {
    if (err) {
        return err;
    }
    console.log(`App listening on PORT` + process.env.PORT);
});




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))