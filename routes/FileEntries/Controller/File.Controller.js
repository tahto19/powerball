import fc from "../lib/File.Class.js";
import { cSend, getPath, uploadImage2 } from "../../../util/util.js";
import fs from "fs";
import uc from "../../User/lib/User.class.js";

export const insertImageController = async (req, res) => {
  try {
    const { description, file, name, category, winnerId } = req.body;
    if (!file.mimetype.startsWith("image/")) throw new Error("ErrorCODE x91c");

    let iUp = await uploadImage2(file);
    console.log("===============", iUp);

    if (!name || name.trim() === "") throw new Error("Image Name is not set");

    let query = {
      winnerId,
      description: description,
      name: name,
      file_location: iUp.filename,
      type: "image",
      mimetype: file.mimetype,
      category: category && category !== "" ? category : "",
    };

    if (category && category === "user-image") {
      query["user_id"] = req.user_id;
    }

    let r = await fc.InsertImage(query);

    res.send(cSend(r));
  } catch (error) {
    throw error;
  }
};

export const updateImageController = async (req, res) => {
  try {
    console.log("Route - req.body:", req.body);
    const { id, description, file, name } = req.body;
    let query;
    query = {
      id: id,
      description: description,
      name: name,
    };

    console.log(file);

    if (file && file.mimetype && file.mimetype.startsWith("image/")) {
      let iUp = await uploadImage2(file);
      query = {
        ...query,
        file_location: iUp.filename,
        mimetype: file.mimetype,
      };
    }

    if (!name || name.trim() === "") throw new Error("Image Name is not set");

    let r = await fc.UpdateImage(query);
    res.send(cSend(r));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getController = async (req, res) => {
  const { limit = 10, offset = 0, sort = [], filter } = req.body;

  const new_offset = limit * offset; // Calculate offset
  console.log(req.body);
  const newSort = sort.length > 0 ? sort : [["id", "ASC"]];
  let a = await fc.Fetch(new_offset, limit, newSort, filter);

  res.send(cSend(a));
};

export const serveImageController = async (req, res) => {
  const { id } = req.params;
  if (id === "undefined" || id === undefined || !id) {
    throw new Error("id is undefined");
  } else {
    /** Check Raffle ID */
    const findImage = await fc.FetchOne([
      { filter: id, field: "id", type: "number" },
    ]);
    if (findImage === null) throw new Error("ErrorCODE x72");
    /** END Check */
    let _path = getPath(
      "/uploads/image_page/" + findImage.dataValues.file_location
    );

    // Check if file exists
    if (!fs.existsSync(_path)) {
      res.code(404).send("Image not found");
      return;
    }

    try {
      const buffer = fs.readFileSync(_path);
      res.header("Content-Type", findImage.dataValues.mimetype || "image/jpeg"); // or your mimetype
      res.header("Content-Length", buffer.length);
      res.raw.writeHead(200); // needed to finalize headers for raw response
      res.raw.end(buffer); // send buffer manually
    } catch (err) {
      // console.error("Error reading file:", err);
      res.code(500).send("Error reading image");
    }
  }
};
