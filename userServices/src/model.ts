import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  id:string;
  username: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    playlist: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const userModel =  mongoose.model<IUser>("User", UserSchema);
export default userModel