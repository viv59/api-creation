import express from "express";

import { isAdmin, isAuthenticated } from "../middlewares";
import {
    deleteResource,
  getAllResources,
  getResourceByIdController,
  getResourcesByNameController,
  getResourcesByTypeController,
  updateResource,
} from "../controllers/resources";

export default (router: express.Router) => {
  router.get("/resources",isAuthenticated,getAllResources);
  router.get(
    "/resources/name/:name",
    isAuthenticated,
    getResourcesByNameController
  );
  router.get("/resources/:id",isAuthenticated ,getResourceByIdController);
  router.get("/resources/type/:type",isAuthenticated ,getResourcesByTypeController);
  router.put("/resources/:id", isAuthenticated,updateResource);
  router.delete("/resources/:id", isAuthenticated,deleteResource);
};
