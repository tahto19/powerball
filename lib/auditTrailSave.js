// import AuditTrail from "../models/AuditTrail.js";
import at from "../routes/AuditTrail/lib/AuditTrail.class.js";
const switchMethod = (d) => {
  switch (d.toLowerCase()) {
    case "post":
      return 1;
    case "put":
      return 2;
    case "delete":
      return 3;
  }
};
const auditTrailSave = async (req, pay) => {
  try {
    const toJSON = JSON.parse(pay);
    const keysToCheckOfItsOnlyFetch = ["sort", "filter"];
    const hasAllKeys = keysToCheckOfItsOnlyFetch.every(
      (key) => key in req.body
    );
    // save audit trail here if not fetch kind of post

    if (!hasAllKeys) {
      console.log(toJSON, req.body);
      let changes = req.method.toLowerCase() !== "post" ? pay : null;
      let targetId = toJSON.data;
      let status = 1;
      let typeOfRequest = switchMethod(req.method);
      let path = req.url;
      console.log({
        changes,
        targetId,
        status,
        typeOfRequest,
        path,
        performedBy: req.user_id,
      });
      //   await at.Insert({
      //     changes,
      //     targetId,
      //     status,
      //     typeOfRequest,
      //     path,
      //     performedBy: req.user_id,
      //   });
    }

    // console.log();
    // AuditTrail;
  } catch (err) {
    console.log(err);
  }
};

export default auditTrailSave;
