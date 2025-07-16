import {Response,Request} from "express";
import {User} from "../Models/User";
import {where} from "sequelize";

class UserFilterController {
    async GetAllUsers(req: Request, res: Response) {
        try {
            const userId = req.userId
            const Role = req.Role

            if (!Role) {
                res.status(404).send({
                    error: "Role not found"
                })
            }

            if (Role !== 'admin'){
                res.status(404).send({
                    error: 'You do not have permission to perform this action'
                })
            }

            const data = await User.findAll()
            console.log(Role)
            res.status(200).json({
                status: "success",
                data: data
            })
        }
        catch(err) {
            res.status(500).json({
                status: "error",
                error: err
            })
        }
    }

    async GetUser(req: Request, res: Response) {
        try {
            const Role = req.Role
            const userId = req.userId
            const {ID} = req.body

            if (!Role) {
                res.status(404).send({
                    error: "Wrong headers"
                })
            }

            if (Role !== 'admin'){
                const user = await User.findOne({where: {userID: userId}})
                if (!user) {
                    return res.status(404).json({
                        error: "User not found"
                    });
                }
                res.status(200).json({
                    status: "success",
                    data: user
                })
            }

            if (!ID) {
                return res.status(400).json({ // 400 Bad Request
                    error: "Missing userID parameter"
                });
            }

            const user = await User.findOne({
                where: {userID: ID}
            })

            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                });

            }
            res.status(200).json({
                status: "success",
                data: user
            })
            return
        }
        catch (error) {
            console.error("GetUser error:", error);
            return res.status(500).json({
                status: "error",
                error: "Internal server error"
            });
        }
    }

    async BlockUser(req: Request, res: Response) {
        try {
            const Role = req.Role;
            const currentUserId = req.userId;
            const { userID } = req.body;

            if (!Role) {
                return res.status(401).json({ error: "Authentication required" });
            }

            if (Role !== 'admin') {
                const currentUser = await User.findByPk(currentUserId);
                if (!currentUser) {
                    return res.status(404).json({ error: "User not found" });
                }

                currentUser.dataValues.status = 'blocked';
                await currentUser.save();

                return res.status(200).json({
                    status: "success",
                    message: "Your account has been blocked"
                });
            }

            if (!userID) {
                return res.status(400).json({
                    error: "Missing userID parameter"
                });
            }

            const userToBlock = await User.findOne({
                where: { userID: userID }
            });

            if (!userToBlock) {
                return res.status(404).json({ error: "User not found" });
            }

            if (userToBlock.dataValues.userID === req.userId) {
                return res.status(403).json({
                    error: "Admins cannot block themselves"
                });
            }

            userToBlock.dataValues.status = 'inactive';
            await userToBlock.save();

            return res.status(200).json({
                status: "success",
                message: "User blocked successfully"
            });
        }
        catch (error) {
            console.error("BlockUser error:", error);
            return res.status(500).json({
                status: "error",
                error: "Internal server error"
            });
        }
    }
}

export default new UserFilterController();