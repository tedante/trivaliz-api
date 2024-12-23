import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { UserDocument, UserSchema } from '../user/user.schema';

dotenv.config();

const seedRolesAndUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    });

    // Register the User schema
    const UserModel = mongoose.model<UserDocument>('User', UserSchema);

    // Clear existing users data
    await UserModel.deleteMany({});

    // Create users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      users.push({
        username: `user${i + 1}`,
        password: hashedPassword,
        email: `user${i + 1}@yopmail.com`,
        country: 'Indonesia',
      });
    }

    await mongoose.model<UserDocument>('User').insertMany(users);

    console.log('Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRolesAndUsers();