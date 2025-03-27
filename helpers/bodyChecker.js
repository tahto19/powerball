const bodyChecker = (req, res, done) => {
  console.log(req.method);
  let formHeader = req.headers["content-type"]?.includes(
    "multipart/form-data;"
  );
  if (req.method === "POST" && !req.body && !formHeader)
    throw new Error("ErrorCODE X2");
  if (req.method === "PUT" && !req.body && !formHeader)
    throw new Error("ErrorCODE X3");
  if (req.method === "DELETE" && !req.body && !formHeader)
    throw new Error("ErrorCODE X4");
  if (req.method.includes(acceptedMethods)) throw new Error("ErrorCODE X41");
  done();
};
const acceptedMethods = ["POST", "DELETE", "PUT", "POST"];
export default bodyChecker;
