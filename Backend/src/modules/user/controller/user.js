import userModel from "../../../../DB/model/User.model.js";
import asyncHandler from "../../../services/handelError.js";
import { findById, updateOne } from "../../../../DB/DBMethods.js";
import bcrypt from 'bcryptjs';

export const updatePassword = asyncHandler(async (req, res, next)=>{
    const {oldPassword, newPassword} = req.body
    const user = await findById(userModel, req.authUser._id)
    const match = bcrypt.compareSync(oldPassword, user.password)
    if (!match) {
        next(new Error("old password not match with current password", {cause: 409}))
    } else {
        const hash = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND))
        await updateOne(userModel, {_id: req.authUser._id}, {password : hash})
        res.status(200).json({message: 'Done'})
    }
})
export const softDelete = asyncHandler(async (req, res, next)=>{
    await updateOne(userModel, {_id: req.authUser._id, isDeleted: false}, {
        isDeleted: true
    })
    res.json({message : 'Done'})
})
export const getUserById = asyncHandler(async (req, res, next)=>{
    const {id}= req.params
    const user = await findById(userModel, id, "-password")
    user? res.status(200).json({message: 'Done', user}) :
     next(new Error('user Not found', {cause : 404}))
})
export const blockUser = asyncHandler(async (req, res, next)=>{
    const {id}= req.params
    const user = await findById(userModel, id, "-password")
    if (!user) {
        next(new Error('user Not found', {cause : 404}))
    } else {
        if (user.Blocked) {
            next(new Error('user already blocked', {cause : 409}))
        } else {
            await updateOne(userModel,{_id: id}, {Blocked : true})
            res.status(200).json({message: 'Done'})
        }
    }
})