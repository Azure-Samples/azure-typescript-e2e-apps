import mongoose, { Connection } from 'mongoose';

const connectionString = process.env.MONGODB_URI;
console.log('connectionString', connectionString);

const connection = mongoose.createConnection(connectionString, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// BlogPost
const Schema = mongoose.Schema;
// @ts-ignore
const ObjectId = Schema.ObjectId;

const BlogPostSchema = new Schema({
  id: ObjectId,
  author: String,
  title: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

export const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

connection.model('BlogPost', BlogPostSchema);

export default connection;