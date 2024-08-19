const getUniqId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const SESSION_DURATION = 1 * 60 * 1000; // 1min

const userSession = (req, res, next) => {
  const { userId, createdAt } = req.session;

  if (userId) {
    console.error("session exists");
    // if (Date.now - createdAt > SESSION_DURATION) {
    //   console.error("remove session");
    // }
  } else {
    console.error("session created");
    req.session.userId = getUniqId();
    req.session.createdAt = Date.now();
  }

  next();
};

export default userSession;
