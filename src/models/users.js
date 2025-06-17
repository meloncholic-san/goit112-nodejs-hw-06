import mongoose from 'mongoose';


const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email : {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


usersSchema.methods.toJSON = function () {
const obj = this.toObject();
delete obj.password;
return obj;
};

export const UserCollection = mongoose.model('User', usersSchema); // collection name: users

