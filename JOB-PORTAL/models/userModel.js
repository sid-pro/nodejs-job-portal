import mongoose from "mongoose";
import validator from "validator"; // node package just like JOI to validate inputed properties
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
const Schema = mongoose.Schema;

// schema
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "Name is required"],
    },
    last_name: {
      type: String
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
); // whenver new user is created time is taken automatically. handle both createdAt aand updatedAt

// this also works
// const User = mongoose.model("User",userSchema);
// export default User;

// this keyword refer to the user which is already present in the database

// middleware for hashing the password before saving the data
userSchema.pre("save", async function () {
  // Check if password is modified to avoid re-hashing if not modified
  if (!this.isModified("password")) {
    return;
  }
  // cannot use fat arrow functions here
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password function
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// internally this is how compare function works to compar password with the hash password
// use same salt that is in DB with the plain text and than compare
// async function bcryptCompare(plaintextPassword, hashedPasswordWithSalt) {
//     // Extract salt from hashed password
//     const salt = extractSaltFromHashedPassword(hashedPasswordWithSalt);

//     // Hash plaintext password with the same salt
//     const hashOfPlaintext = await hashFunction(plaintextPassword, salt);

//     // Compare the two hashes
//     if (hashOfPlaintext === hashedPasswordWithSalt) {
//       return true; // Passwords match
//     } else {
//       return false; // Passwords do not match
//     }
//   }

// we can save this token in local storage or in DB here we are using localStorage
userSchema.methods.createJWT = async function () {
  const token = JWT.sign(
    { userId: this._id, email: this.email, name: this.first_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN.toString() }
  );
  return token;
};

// export User model to use in other files of application
export default mongoose.model("User", userSchema);
