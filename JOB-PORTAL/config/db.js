import mongoose from 'mongoose';

const connectDb = async() =>{
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connected to MongoDb Database',mongoose.connection.host);
    } catch (error) {
        console.log('Error connecting',error);
    }
}

export default connectDb;