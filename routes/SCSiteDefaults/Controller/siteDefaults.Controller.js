import { cSend, getPath, uploadImage2 } from "../../../util/util.js";
import fs from "fs";
import sdc from "../lib/SiteDefault.class.js";

export const insertSiteDefaultController = async (req, res) => {
  try {
    const { id, description, file, name, category, winnerId } = req.body;
    let type = "";

    if (file.mimetype.startsWith("image/")) type = "image";
    if (file.mimetype.startsWith("video/")) type = "video";

    let iUp = await uploadImage2(file, null, type);

    const new_name = name.trim() === "" ? file.filename : name;

    let query = {
      winnerId,
      description: description,
      name: new_name,
      file_location: iUp.filename,
      type: type,
      mimetype: file.mimetype,
      category: category && category !== "" ? category : "",
    };

    if (category && category === "user-image") {
      query["user_id"] = req.user_id;
    }

    let r;
    if (id && id > 0) {
      query["id"] = id;
      r = await sdc.Update(query);
    } else {
      r = await sdc.Insert(query);
    }

    res.send(cSend(r));
  } catch (err) {
    throw err;
  }
};

export const getMediaBanner = async (req, res) => {
  const a = await sdc.FetchOne([
    { filter: "media-banner", field: "category", type: "string" },
  ]);
  res.send(cSend(a));
};
