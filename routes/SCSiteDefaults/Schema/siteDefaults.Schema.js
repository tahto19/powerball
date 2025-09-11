import {
  insertSiteDefaultController,
  getMediaBanner,
} from "../Controller/siteDefaults.Controller.js";

export const insertSiteDefaultsSchema = {
  handler: insertSiteDefaultController,
};

export const getMediaBannerSchema = {
  handler: getMediaBanner,
};
