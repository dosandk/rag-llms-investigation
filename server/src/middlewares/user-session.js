import { removeStore } from "../api/index.js";

const getUniqId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const SESSION_DURATION = 15 * 60 * 1000; // 15 min

const userSession = async (req, res, next) => {
  const { userId, createdAt } = req.session;

  if (userId) {
    console.error("session exists");

    if (Date.now() - createdAt > SESSION_DURATION) {
      console.error("but session expired");

      const result = await removeStore(userId, createdAt);
      const [error, json] = result;

      if (error) {
        return next({ error });
      }

      console.log("session was removed", json);
    }
  } else {
    console.error("session created");

    req.session.userId = getUniqId();
    req.session.createdAt = Date.now();
  }

  next();
};

export default userSession;
