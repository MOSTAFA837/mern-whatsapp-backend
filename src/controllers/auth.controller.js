import createHttpError from "http-errors";
import { createUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;

    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    const access_token = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.json({
      message: "register success.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        token: access_token,
      },
    });

    res.send(req.body);
  } catch (error) {
    next(error);
  }
};