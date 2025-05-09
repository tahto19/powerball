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
export const auditTrailSave = async (req, pay) => {
  try {
    const toJSON = pay;
    const keysToCheckOfItsOnlyFetch = ["sort", "filter"];
    const hasAllKeys = keysToCheckOfItsOnlyFetch.every(
      (key) => key in req.body
    );
    // save audit trail here if not fetch kind of post

    if (!hasAllKeys) {
      let changes = pay;
      // let targetId = toJSON.data;
      let status = 0;
      let typeOfRequest = switchMethod(req.method);
      let path = req.url;

      return await at.Insert({
        changes,
        // targetId,
        status,
        typeOfRequest,
        path,
        performedBy: req.user_id,
      });
    }

    // console.log();
    // AuditTrail;
  } catch (err) {
    console.log(err);
  }
};

export const updateAuditTrail = async (req, pay) => {
  try {
    const toJSON = JSON.parse(pay);
    const keysToCheckOfItsOnlyFetch = ["sort", "filter"];
    const hasAllKeys = keysToCheckOfItsOnlyFetch.every(
      (key) => key in req.body
    );
    if (!hasAllKeys) {
      let changes = req.method.toLowerCase() !== "post" ? req.body : null;
      let targetId = toJSON.data;
      let status = 1;

      console.log({
        targetId,
        status,
      });
      let query = {
        targetId,
        status,
        id: req.audit_trail,
      };
      if (changes !== null) {
        query["changes"] = changes;
      }
      return await at.Edit(query);
    }
  } catch (err) {
    console.log(err);
  }
};
export const updateErrorAuditTrail = async (req, error) => {
  try {
    const toJSON = JSON.parse(error);
    const keysToCheckOfItsOnlyFetch = ["sort", "filter"];
    // const hasAllKeys = keysToCheckOfItsOnlyFetch.every(
    //   (key) => key in req.body
    // );
    const hasAllKeys = false;
    console.log(req.audit_trail);
    if (!hasAllKeys) {
      let errorDetails = toJSON;
      let status = 2;

      let query = {
        errorDetails: errorDetails.message,
        status,
        id: req.audit_trail,
      };

      return await at.Edit(query);
    }
  } catch (err) {
    console.log(err);
  }
};
