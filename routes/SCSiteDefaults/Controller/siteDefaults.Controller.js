import { cSend, getPath, uploadImage2 } from "../../../util/util.js";
import fs from "fs";
import sdc from "../lib/SiteDefault.class.js";

export const insertSiteDefaultController = async (req, res) => {
  try {
    const { id, description, file, name, category, winnerId, sequence } =
      req.body;
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
      sequence,
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

export const getHighlights = async (req, res) => {
  const a = await sdc.FetchAll(
    [["id", "ASC"]],
    [{ filter: "highlights", field: "category", type: "string" }],
  );
  res.send(cSend(a));
};

export const deleteHighlightsSiteDefaultsController = async (req, res) => {
  const { id } = req.body;
  const a = await sdc.Delete(id);
  res.send(cSend(a));
};

export const updateHighlightsController = async (req, res) => {
  try {
    const { list } = req.body;

    await Promise.all(
      list.map((x) =>
        sdc.Update({
          id: x.id,
          sequence: x.sequence,
        }),
      ),
    );

    res.send(cSend({ success: "success" }));
  } catch (err) {
    throw err;
  }
};

export const getHighlightsPlayerSide = async (req, res) => {
  const a = await sdc.FetchAll(
    [["id", "ASC"]],
    [{ filter: "highlights", field: "category", type: "string" }],
    ["file_location", "sequence"],
  );
  res.send(cSend(a));
};
