import express, { NextFunction, Request, Response } from "express";
import { UserModel } from "../03-models/user-model";
import logic from "../05-logic/user-logic";

const router = express.Router();

router.post("/auth/register/1", async (request: Request, response: Response, next: NextFunction) => {
    try {
       const user = new UserModel(request.body)
       const userAfterVal = await logic.registerStepOne(user)
       response.json(userAfterVal)
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/auth/register/2", async (request: Request, response: Response, next: NextFunction) => {
    try {
       const user = new UserModel(request.body)
       const token = await logic.registerStepTwo(user)
       response.status(201).json(token)
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
       const user = new UserModel(request.body)
       const token = await logic.login(user)
       response.json(token)
    }
    catch (err: any) {
        next(err);
    }
});



export default router;