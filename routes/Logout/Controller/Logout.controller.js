export const LogoutController = async (req, res) => {
  try {
    res
      .clearCookie("cookie_pb_1271", {
        domain: "",
        path: "/",
        secure: true,
        httpOnly: true,
      })
      .send({ result: "success", message: "Logged out!" });
  } catch (err) {
    throw err;
  }
};
