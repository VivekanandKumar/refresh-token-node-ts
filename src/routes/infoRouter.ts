import express from 'express';
import { showWelcome } from '../controller/user';


const Router = express.Router();

Router.get('/', showWelcome);

export default Router;