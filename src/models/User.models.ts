import { IUser } from "@/types/User.types";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface UserDocument extends Omit<IUser, "_id">, mongoose.Document {
  comparePassword(comparedPassword: string): boolean;
}


const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    trim: true,
    required: [true , "Name is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true , "Email is required"],
    unique: [true , "Email must be unique, please choose another one."],
  },
  password: {
    type: String,
    required: [true , "Password is required"],
    minlength: [6 , "Password must be at least 6 characters"],
  },
  mobile: {
    type: String,
    required: [true , "Mobile number is required"],
    unique: [true , "Mobile number must be unique, please choose another one."],
    minlength: [10 , "Mobile number must be at least 10 digits"],
    maxlength: [10 , "Mobile number must be at most 10 digits"],
  }

},{
  timestamps: true,
});

userSchema.pre("save", function (): void {
  if(!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = function (comparedPassword: string): boolean {
  return bcrypt.compareSync(comparedPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;