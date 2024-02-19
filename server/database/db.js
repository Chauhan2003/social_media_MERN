import mongoose from "mongoose";

const Connection = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database is Connected`);
    } catch(err){
        console.log(`Database error: ${err.message}`);
    }
}

export default Connection;