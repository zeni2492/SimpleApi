import * as uuid from "uuid";
import * as Hashing from "password-hash";
import {sign} from 'jsonwebtoken'
import {USER_DATA} from "../Models/DataTypes";
import {Response,Request} from "express";
import {User} from '../Models/User'


const CreateJWT  =(email:string,role:string,userid:string): string =>{
    return sign(
        {
            email:email,
            role:role,
            userid:userid,
        },
        process.env.JWTSECRET as string,
        { expiresIn: "30m" }
    );
}
class UserAuthController {
    async registerUser(req : Request,res : Response): Promise<void> {
        try {
            const {email, password,fullName,dateOfBirth,regAdmin} = req.body;

            if (!email || !password || !fullName ) {
                res.status(400).json({
                    error: "Please enter a valid data",
                })
                return
            }

            const existingUser = await User.findOne({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                console.log("Existing user found:");
                res.status(400).json({
                    error: "User with this email already exists"
                });
                return;
            }

            const hashedPassword: string = Hashing.generate(password);

            const newUser = await User.create({
                userid: uuid.v4(),
                email: email,
                password: hashedPassword,
                fullName: fullName,
                dateOfBirth: dateOfBirth,
                role: regAdmin ? "admin" : "user",
                status: "active",
            })

            res.status(200).send(newUser)
        }
        catch(err){
            console.log(err)
            res.status(400).send({
                error: "User Registration failed",
            })
        }
    }

    async loginUser(req : Request,res : Response): Promise<void> {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                res.status(400).json({
                    error: "Please fill all fields",
                })
                return;
            }

            const existingUser = await User.findOne({
                where: {
                    email: email
                }
            })

            if (!existingUser) {
                res.status(400).json({
                    error: "User with this email does not exist",
                })
                return
            }

            const decryptedpass= Hashing.verify(password,existingUser.dataValues.password)

            if (!decryptedpass) {
                res.status(400).json({
                    error: "Passwords do not match",
                })
                return
            }
                const token = CreateJWT(
                    existingUser.dataValues.userid,
                    existingUser.dataValues.role,
                    existingUser.dataValues.email,
                )
            res.status(200).send({
                token: token
            })

        }
        catch (err){
            console.log(err)
            res.status(400).json({
                error: "Failed to login",
            })
        }
    }
}

export default new UserAuthController();