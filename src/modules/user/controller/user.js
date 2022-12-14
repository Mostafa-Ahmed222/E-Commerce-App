import userModel from "../../../../DB/model/User.model.js";
import asyncHandler from "../../../services/handelError.js";
import { findById, updateOne } from "../../../../DB/DBMethods.js";
import bcrypt from 'bcryptjs';

export const updatePassword = asyncHandler(async (req, res, next)=>{
    const {oldPassword, newPassword} = req.body
    const user = await findById({model: userModel,filter: req.authUser._id})
    const match = bcrypt.compareSync(oldPassword, user.password)
    if (!match) {
        return next(new Error("old password not match with current password", {cause: 409}))
    } else {
        const hash = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND))
        await updateOne({model: userModel,filter: {_id: req.authUser._id},data: {password : hash}})
        return res.status(200).json({message: 'Done'})
    }
})
export const softDelete = asyncHandler(async (req, res, next)=>{
    await updateOne({model: userModel,filter: {_id: req.authUser._id, isDeleted: false},data: {
        isDeleted: true
    }})
    return res.status(200).json({message : 'Done'})
})
export const getUserById = asyncHandler(async (req, res, next)=>{
    const {id}= req.params
    const user = await findById({model: userModel,filter: id,select: "-password"})
    if (user) {
        return res.status(200).json({message: 'Done', user})
    }
    return next(new Error('user Not found', {cause : 404}))
})
export const blockUser = asyncHandler(async (req, res, next)=>{
    const {id}= req.params
    const user = await findById({model: userModel,filter: id, select: "-password"})
    if (!user) {
        return next(new Error('user Not found', {cause : 404}))
    } else {
        if (user.Blocked) {
            return next(new Error('user already blocked', {cause : 409}))
        } else {
            await updateOne({model: userModel, filter: {_id: id},data: {Blocked : true}})
            return res.status(200).json({message: 'Done'})
        }
    }
})