import { Schema, Document, createConnection, ConnectOptions, model, set } from 'mongoose';

const connectionString = process.env.MONGODB_URI;
console.log('connectionString', connectionString);

const connection = createConnection(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true
} as ConnectOptions);

export interface IBlogPost {
  author: string
  title: string
  body: string
}

export interface IBlogPostDocument extends IBlogPost, Document {
  id: string
  created: Date
}

const BlogPostSchema = new Schema({
  id: Schema.Types.ObjectId,
  author: String,
  title: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

BlogPostSchema.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 

export const BlogPost = model<IBlogPostDocument>('BlogPost', BlogPostSchema);

connection.model('BlogPost', BlogPostSchema);

export default connection;
