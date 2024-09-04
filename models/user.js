import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userShcema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userShcema.plugin(uniqueValidator);

export default model("User", userShcema);
