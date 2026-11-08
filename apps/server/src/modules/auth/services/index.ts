import bcrypt from "bcryptjs";
import { prisma } from "../../../config/post_db.js";
import type { loginDto, registerDto } from "../../../types/auth.types.js";
import { encodeHash } from "../../../utils/jwt.js";

export class AUTH_ERROR extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AUTH_ERROR";
  }
}

export async function registerUser(params: registerDto) {
  const userExists = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (userExists) throw new AUTH_ERROR("User already exists!");

  const passwordHash = await bcrypt.hash(params.password, 10);
  const createdUser = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      passwordHash,
    },
  });

  console.log("Resgiter servcice")
  console.log(createdUser)

  return encodeHash({ email: createdUser.email, id: createdUser.id });
}

export async function loginUser(params: loginDto) {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (!user) throw new AUTH_ERROR("User does not exist!");

  const validPassword = await bcrypt.compare(params.password, user.passwordHash);
  if (!validPassword) throw new AUTH_ERROR("Unauthenticated user");

  return encodeHash({ email: user.email, id: user.id });
}

export async function logoutUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AUTH_ERROR("User id invalid");

  return user;
}

export async function findUserByEmail(mail: string) {
  return prisma.user.findUnique({ where: { email: mail } });
}
