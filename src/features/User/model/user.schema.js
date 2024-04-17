import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        );
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function (mobileNumber) {
        return /^\d{10}$/.test(mobileNumber);
      },
      message: (props) => `${props.value} is not a valid mobile number`,
    },
  },
  bio: String,
  createdAt: {
    type: String,
    default: () => new Date().toLocaleDateString(),
  },
  //   updatedAt: new Date().toLocaleDateString,
});
