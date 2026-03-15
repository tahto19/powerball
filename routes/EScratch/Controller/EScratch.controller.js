import axiosClient from "../../../util/axiosClient.js";
import "dotenv/config";
import { eScratchErrorStatus, cSend } from "../../../util/util.js";
import ec from "../lib/EScratch.class.js";
export const EScratchController = async (req, res) => {
  try {
    const { credits } = req.body;

    if (credits && Number(credits)) {
      const toGems = Number(credits) * 20;
      let mobileNumber = "";
      const user = await ec.FetchOne([
        { field: "id", filter: req.user_id, type: "number" },
      ]);

      if (user?.dataValues?.mobileNumber) {
        mobileNumber = user.dataValues.mobileNumber;
      } else {
        throw new Error("ErrorCODE x811");
      }

      const url = process.env.ESCRATCH_BASE_URL;
      const default_headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ESCRATCH_TOKEN}`, // default auth header
      };
      const r = await axiosClient.post(
        url + "/vendor/api/credits-sso",
        { mobile: mobileNumber, credits: Number(toGems) },
        {
          headers: default_headers,
        },
      );
      console.log("============", r.data);
      if (r.data.m === "ok") {
        // if successfull, proceed to updating entries count
        const ticketDetails = await ec.FetchTicketDetails([
          {
            field: "user_id",
            filter: req.user_id,
            type: "number",
          },
          {
            field: "active",
            filter: true,
            type: "boolean",
          },
          {
            field: "entries_used",
            compare: "entries",
            type: "column_less_than",
          },
        ]);

        let totalEntries = 0;
        let totalEntriesUsed = 0;

        for (let details of ticketDetails.list) {
          let row = details.toJSON();
          totalEntries += row.entries;
          totalEntriesUsed += row.entries_used;
        }

        let totalUsedEntries = totalEntriesUsed + Number(credits);

        if (totalEntries < totalUsedEntries) {
          throw new Error("You do not have enough points"); //total used entries exceeds the total entries (entries that user have)
        }

        let tobeused = Number(credits);
        for (let details of ticketDetails.list) {
          let row = details.toJSON();

          if (tobeused <= 0) break;
          let remaining = row.entries - row.entries_used;

          if (remaining <= 0) continue;
          let consume = Math.min(remaining, tobeused);

          row.entries_used += consume;
          tobeused -= consume;

          await ec.Edit({
            id: row.id,
            active: row.entries_used === row.entries ? false : true,
            entries_used: row.entries_used,
          });
        }
      }
      res.send(cSend(r.data));
    } else {
      throw new Error("ErrorCODE x810");
    }
  } catch (err) {
    if (err?.response?.data?.m) {
      const m = eScratchErrorStatus(err?.response?.data?.m);
      throw new Error(m.toString());
    } else {
      throw err;
    }
  }
};
