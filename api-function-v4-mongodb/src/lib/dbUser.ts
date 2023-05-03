import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  age: number;
}

// Create the User schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

// Create the User model
const User = model<IUser>('User', userSchema);

export default User;