import * as dotenv from "dotenv";

dotenv.config()

export default async ({ headers }) => {
  const token = headers.authorization?.split(" ")[1];
  if (token !== process.env["ADMIN_TOKEN"]) {
    return {
      statusCode: 401,
      data: {
        message: "Unauthorized",
      },
    };
  }
  return {
    data: {
      message: "Password verified",
    },
  };
};
