import fastifyCaching from "@fastify/caching";
import {
  insertSiteDefaultController,
  getMediaBanner,
} from "../Controller/siteDefaults.Controller.js";

export const insertSiteDefaultsSchema = {
  handler: insertSiteDefaultController,
};

export const updateSiteDefaultsSchema = {
  handler: insertSiteDefaultController,
};

export const getMediaBannerSchema = {
  handler: getMediaBanner,
  config: {
    cache: {
      privacy: fastifyCaching.privacy.PUBLIC, // allow client/CDN caching
      expiresIn: 3600, // 1 hour
    },
  },
};
