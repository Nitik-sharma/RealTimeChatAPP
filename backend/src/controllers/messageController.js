import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId, io } from "../lib/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModels.js";


export const getUserForSidebar = async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
         console.log("Error in getUserForSidebar", error.message);
        res.status(500).json({ message: "Internal server error !!" });

    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const message = await Message.find({
            $or: [
                {
                    senderId:myId,receiverId:userToChatId
                },
                {
                    senderId:userToChatId,receiverId:myId
                }
            ]
        })
        res.status(200).json(message);
    } catch (error) {
        console.log("Error in getmessage controller", error.message);
        res.status(500).json({ message: "Internal server error !!" });
    }
}


export const sendmessage =async (req,res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        
        let imageUrl;

        if (image) {
            console.log("Upoading image");
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
            
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            

        })
       

        await newMessage.save();

        // todo:realtime functionality goes here > socket.io
        const receiverSocketId = getReciverSocketId(receiverId)
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage);

       


    } catch (error) {
        console.log("Error in sendMessage controler ", error.message);
         res.status(500).json({ message: "Internal server error !!" });

    }
}