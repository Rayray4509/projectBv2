import express from 'express';
import adminRouters from './routers/adminRouters.js';
import apiRouters from './routers/apiRouters.js';
import memberRouters from "./routers/memberRouter.js"
import { sessionSetting } from './config/session.js';
import { passport } from './config/sessionPassport.js';
import {logger} from './config/logger.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(sessionSetting());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouters.router);
app.use("/member", memberRouters.router);
app.use("/admin", adminRouters.router);

// logger.info('test info');
logger.warn('server is running %s',{layer:"server"});
// logger.error('test error %s',{layer:'Model'});

app.listen(port, () => {
    console.log('server lunch');
});


