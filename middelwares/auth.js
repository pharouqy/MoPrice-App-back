import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodeToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decodeToken.userId;
  try {
    if (!userId) {
      res.status(403).json({ message: "Le userId est invalid !!!" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};