import rc from "../lib/Raffle.class.js";
import { cSend, getPath, uploadImage } from "../../../util/util.js";
export const insertController = async (req, res) => {
  try {
    const { description, file, name } = req.body;
    if (!file.mimetype.startsWith("image/")) throw new Error("ErrorCODE x91c");

    let _path = getPath("/uploads/ids/" + newFileName);

    let iUp = await uploadImage(file);
    if (!name || name.trim() === "") throw new Error("Image Name is not set");
    // let r = await uc.Insert({
    //     description: description.value,
    //     name: name.value,
    //     file_location: iUp.filename
    // });
    res.send(cSend(_path));
  } catch (error) {
    throw error;
  }
};
