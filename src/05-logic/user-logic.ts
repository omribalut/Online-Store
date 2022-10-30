import cyber from "../01-utils/cyber";
import ErrorModel from "../03-models/error-model";
import { RoleModel } from "../03-models/role-model";
import { IUserModel, UserModel } from "../03-models/user-model";
import cartLogic from "../05-logic/cart-logic";
//REGISTER 1

async function registerStepOne(user: IUserModel): Promise<IUserModel>{
    const emailTaken = await isEmailTaken(user.email)
    if(emailTaken.length !== 0){
        throw new ErrorModel(400, `Email ${user.email} is already taken.`)
    }
    const idTaken = await isIdTaken(user.id)
    if(idTaken.length !== 0){
        throw new ErrorModel(400, `ID ${user.id} is already taken.`)
    }
    return user;
}

async function registerStepTwo(user: IUserModel): Promise<string>{
    user.password = cyber.hash(user.password)
    const errors = user.validateSync();
    if (errors) throw new ErrorModel(400, errors.message);
    user.role = RoleModel.User
    const newUser = await user.save()
    newUser.password = null
    const token = cyber.getNewToken(user)
    await cartLogic.createCartOrGet(newUser._id)
    return token
}

//LOGIN

async function login(user: IUserModel): Promise<string>{
    user.password = cyber.hash(user.password)
    const userDetails = await UserModel.find({email: user.email, password: user.password})
    if(userDetails.length === 0){
        throw new ErrorModel(401, "Incorrect email or password")
    }
    const oneUser = userDetails[0]
    oneUser.password = null
    const token = cyber.getNewToken(oneUser)
    await cartLogic.createCartOrGet(oneUser._id)
    return token
}

//VALID EMAIL

async function isEmailTaken(email: string): Promise<IUserModel[]>{
    const existEmail = await UserModel.find({email}).exec()
    return existEmail
}

//VALID ID

async function isIdTaken(id: string): Promise<IUserModel[]>{
    const existId = await UserModel.find({id}).exec()
    return existId
}

export default {
    registerStepOne,
    registerStepTwo,
    login
}