import express from "express";

import { isAdmin, isAuthenticated } from "../middlewares";
import {
  borrowResource,
  createResourceController,
  deleteResource,
  getAllResources,
  getResourceByIdController,
  getResourcesByNameController,
  getResourcesByTypeController,
  returnResource,
  updateResource,
} from "../controllers/resources";

export default (router: express.Router) => {
  router.post(
    "/createresource",
    isAuthenticated,
    isAdmin,
    createResourceController
  );
  router.get("/resources", isAuthenticated, getAllResources);
  router.get(
    "/resources/name/:name",
    isAuthenticated,
    getResourcesByNameController
  );
  router.get("/resources/:id", isAuthenticated, getResourceByIdController);
  router.get(
    "/resources/type/:type",
    isAuthenticated,
    getResourcesByTypeController
  );
  router.patch("/resources/:id", isAuthenticated, isAdmin, updateResource);
  router.delete("/resources/:id", isAuthenticated, isAdmin, deleteResource);

  router.post("/resources/borrow/:resourceId",isAuthenticated,borrowResource);
  router.post("/resources/return/:resourceId",isAuthenticated,returnResource)
};
