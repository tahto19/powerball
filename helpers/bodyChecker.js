const bodyChecker = (req, res, done) => {
  let formHeader = req.headers["content-type"].includes("multipart/form-data;");
  if (req.method === "POST" && !req.body && !formHeader)
    throw new Error("ErrorCODE X2");
  if (req.method === "PUT" && !req.body && !formHeader)
    throw new Error("ErrorCODE X3");
  if (req.method === "DELETE" && !req.body && !formHeader)
    throw new Error("ErrorCODE X4");

  done();
};

export default bodyChecker;
