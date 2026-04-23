import fastifyCaching from "@fastify/caching";
import {
  insertSiteDefaultController,
  getMediaBanner,
  getHighlights,
  deleteHighlightsSiteDefaultsController,
  updateHighlightsController,
  getHighlightsPlayerSide,
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

export const getHighlightsSchema = {
  handler: getHighlights,
  config: {
    cache: {
      privacy: fastifyCaching.privacy.PUBLIC, // allow client/CDN caching
      expiresIn: 3600, // 1 hour
    },
  },
};

export const deleteHighlightsSiteDefaultsSchema = {
  handler: deleteHighlightsSiteDefaultsController,
};

export const updateHighlightsSchema = {
  handler: updateHighlightsController,
};

export const getHighlightsPlayserSideSchema = {
  handler: getHighlightsPlayerSide,
  config: {
    cache: {
      privacy: fastifyCaching.privacy.PUBLIC, // allow client/CDN caching
      expiresIn: 3600, // 1 hour
    },
  },
};
