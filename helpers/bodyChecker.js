const bodyChecker = (req, res, done) => {
  if (req.method === "POST" && !req.body) throw new Error("ErrorCODE X2");
  if (req.method === "PUT" && !req.body) throw new Error("ErrorCODE X3");
  if (req.method === "DELETE" && !req.body) throw new Error("ErrorCODE X4");

  done();
};

export default bodyChecker;
