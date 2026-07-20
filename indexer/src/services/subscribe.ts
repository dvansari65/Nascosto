import prisma from "../../lib/prisma";

export const subscribe = async (email: string | null) => {
  try {
    if (!email) {
      throw new Error("Email not found!");
    }
    const result = await prisma.subscribe.create({
      data: {
        email,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const totalSubscribed = async () => {
  try {
    const count = await prisma.subscribe.count();
    return count;
  } catch (error) {
    throw error;
  }
};
