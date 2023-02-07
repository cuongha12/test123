import jwt from 'jsonwebtoken';
import db from "../models";
import bcrypt from 'bcrypt'

export const readUser = () => new Promise(async (resolve, reject) => {
    try {

        const response = await db.User.findAndCountAll()
        resolve({
            err: response[1] ? 0 : 1,
            mess: response[1] ? 'that bai' : 'thanh cong',
            response
        })
    } catch (error) {
        reject(error)
    }
});

export const createUser = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { email: data.email },
            defaults: {
                ...data, password: bcrypt.hashSync(data.password, 10)
            }
        })
        return resolve({
            err: response[1] ? 0 : 1,
            mess: response[1] ? 'Register success' : 'Email is used',
            response
        })
    } catch (error) {
        reject(error)
    }
});

export const loginUser = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email: data.email },
            raw: true
        })
        const isChecked = response && bcrypt.compareSync(data.password, response.password)
        if (isChecked === null) {
            const token = isChecked ? jwt.sign({ response }, process.env.PORT, { expiresIn: '24h' }) : null
            return resolve({
                err: token ? 0 : 1,
                mess: token === null || token === undefined ? "Email chưa được đăng kí" : "",
            })
        } else {
            delete response.password
            const token = isChecked ? jwt.sign({ response }, process.env.PORT, { expiresIn: '24h' }) : null
            resolve({
                err: token ? 0 : 1,
                mess: token ? 'Login success' : response ? "Password is wrong" : "Email đã được đăng ký",
                token: token ? `Bearer ${token}` : token,
                data: token ? response : ''
            })
        }
    } catch (error) {
        reject(error)
    }
});


export const logoutUser = (res) => new Promise(async (resolve, reject) => {
    try {
        res.clearCookie("token", {
            secure: true,
            sameSite: "none"
        })
        return resolve({
            mess: 'Logout success',
        })
    } catch (error) {
        reject(error)
    }
});


export const updateUser = (data, id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.update(data, {
            where: { id: id },
        })
        return resolve({
            err: response[1] ? 0 : 1,
            mess: response[1] ? 'Register success' : 'Email is used',
            response
        })
    } catch (error) {
        reject(error)
    }
});

export const deleteUser = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.destroy({ where: { id: id } })
        return resolve({
            err: response[1] ? 0 : 1,
            mess: response[1] ? 'Register success' : 'Email is used',
            response
        })
    } catch (error) {
        reject(error)
    }
});

