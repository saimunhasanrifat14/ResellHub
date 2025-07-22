module.exports = (role) => {
  return (req, res, next) => {
     console.log("USER:", req.user); // 👈 Add this line
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};