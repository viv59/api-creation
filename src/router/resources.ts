import express from "express";

import { isAdmin, isAuthenticated } from "../middlewares";
import {
  borrowResource,
  createResourceController,
  deleteResource,
  getAllResources,
  getResourceByIdController,
  getResourcesByLocationController,
  getResourcesByNameController,
  getResourcesByTypeController,
  returnResource,
  updateResource,
} from "../controllers/resources";
import {
  validateResourceBorrowReturn,
  validateResourceCreation,
  validateResourceId,
  validateResourceUpdate,
} from "../middlewares/resourceValidators";

export default (router: express.Router) => {
  router.post(
    "/createresource",
    isAuthenticated,
    isAdmin,
    validateResourceCreation,
    createResourceController
  );
  router.get("/resources", isAuthenticated, getAllResources);
  router.get(
    "/resources/name/:name",
    isAuthenticated,
    getResourcesByNameController
  );
  router.get(
    "/resources/:id",
    isAuthenticated,
    validateResourceId,
    getResourceByIdController
  );
  router.get(
    "/resources/type/:type",
    isAuthenticated,
    getResourcesByTypeController
  );
  router.get(
    "/resources/location/:location",
    isAuthenticated,
    getResourcesByLocationController
  );
  router.patch(
    "/resources/:id",
    isAuthenticated,
    isAdmin,
    validateResourceUpdate,
    updateResource
  );
  router.delete(
    "/resources/:id",
    isAuthenticated,
    isAdmin,
    validateResourceId,
    deleteResource
  );

  router.post(
    "/resources/borrow/:resourceId",
    isAuthenticated,
    validateResourceBorrowReturn,
    borrowResource
  );
  router.post(
    "/resources/return/:resourceId",
    isAuthenticated,
    validateResourceBorrowReturn,
    returnResource
  );
};
