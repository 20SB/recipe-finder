import { eq } from "drizzle-orm";
import postgresdb from "../../config/db";
import { users } from "../../models/schema";
import { compare, hash } from "../../helpers/auth";
import { RegisterUser } from "../../helpers/interfaces";

export default class User {
  static async userById(id: number) {
    try {
      const user = await postgresdb.query.users.findFirst({ where: eq(users.id, id) });
      if (!user) throw new Error("User not found");
      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
      };
    } catch (error: any) {
      throw new Error(`Error While getting User Data: ${error.message}`);
    }
  }
  static async registerUser(userInput: RegisterUser) {
    try {
      // find existing user
      const existingUser = await postgresdb.query.users.findFirst({ where: eq(users.email, userInput.email) });

      // if user exists throw error
      if (existingUser) throw new Error("User already exists");

      // else create user
      let user = await postgresdb
        .insert(users)
        .values({
          name: userInput.name,
          email: userInput.email,
          password: await hash(userInput.password),
          avatar: userInput.avatar,
        })
        .returning();

      return {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        avatar: user[0].avatar,
      };
    } catch (error: any) {
      throw new Error(`Error While Registering User: ${error.message}`);
    }
  }

  static async loginUser(email: string, password: string) {
    try {
      // check user in db
      console.log("email", email)
      const user = await postgresdb.query.users.findFirst({ where: eq(users.email, email) });
      if (!user) {
        throw new Error("User not found");
      }

      // check password
      const isPasswordMatch = await compare(password, user.password);
      if (user.password !== password && !isPasswordMatch) {
        throw new Error("Invalid password");
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message || "Error While Logging User in DB");
    }
  }
}
