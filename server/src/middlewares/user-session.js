import { removeStore } from "../api/index.js";

const getUniqId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const SESSION_DURATION = 15 * 60 * 1000; // 15 min

const userSession = async (req, res, next) => {
  const { userId, createdAt } = req.session;

  if (userId) {
    console.error("session exists");
    const timeDiff = Date.now() - createdAt;

    console.error("timeDiff", timeDiff);

    if (timeDiff > SESSION_DURATION) {
      console.error("but session expired");

      const result = await removeStore(userId, createdAt);
      const [error, json] = result;

      req.session.userId = getUniqId();
      req.session.createdAt = Date.now();

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
