import { Schema, model } from 'mongoose';

interface IDog {
  name: string;
  age: number;
}

// Create the User schema
const dogSchema = new Schema<IDog>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

// Create the User model
const Dog = model<IDog>('Dog', dogSchema);

export default Dog;