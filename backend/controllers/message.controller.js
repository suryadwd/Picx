import Conversation from "../models/conversation.model"
import User from "../models/user.model"
import Message from "../models/message.model"


export const sendMessage = async (req, res) => {
  try {
    
    const senderId = req.user._id

    const receverId = req.params.id

    const {message} = req.body

    const sender = await User.findById(senderId)
    if(!sender) return res.status(404).json({message:"Sender is invalid"})

    const recever = await User.findById(receverId)
    if(!recever) return res.status(404).json({message:"recever is invalid"})
    
    let conversation = await Conversation.findOne({participants:{$all:[senderId,receverId]}})


    if(!conversation)   {
      conversation = await Conversation({participants:[senderId,receverId]})
      await conversation.save()
    }

    const newMessage = await Message({senderId,receverId,messages:message})
    await newMessage.save()

    if(newMessage){
      conversation.message.push(newMessage._id)
    }

    return res.status(201).json({
      success:true,newMessage
    })

  } catch (error) {
    return res.status(500).json({message:error.message})
  }

}

export const getMessage = async (req, res) => {
  
  try {
    
    const senderId = req.user._id
    const receiverId = req.params.id

    const conversation = await Conversation.find({participants:{$all:[senderId,receiverId]}})

    if(!conversation) return res.status(200).json({success:true, message:[]})

    return res.status(200).json({success:true, message:conversation.messages})

  } catch (error) {
    return res.status(500).json({message:error.message})
  }

}