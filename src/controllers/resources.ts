import express from "express";
import {
  createResource,
  deleteResourceById,
  getAllResourceLocations,
  getAllResourceNames,
  getAllResourceTypes,
  getResourceById,
  getResources,
  getResourcesByLocation,
  getResourcesByName,
  getResourcesByType,
  ResourceModel,
  updateResourceById,
} from "../db/resources";
import { get, isEmpty } from "lodash";
import mongoose from "mongoose";
import { UserModel } from "../db/users";
import { validationResult } from "express-validator";

export const getAllResources = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const resources = await getResources();
    return res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400).send("Error fetching resources");
  }
};

export const getResourceByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const resource = await getResourceById(id);

    if (!resource) {
      return res.sendStatus(404).send("Resource not found");
    }

    return res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400).send("Error fetching resource by ID");
  }
};

export const deleteResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const deletedResource = await deleteResourceById(id);

    if (!deletedResource) {
      return res.sendStatus(404).send("Resource not found");
    }

    return res.status(200).json(deletedResource);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400).send("Error deleting resource");
  }
};

export const updateResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, type, description, availability, location } = req.body;

    if (
      !name &&
      !type &&
      !description &&
      !availability &&
      !location === undefined
    ) {
      return res.sendStatus(400);
    }

    const resource = await getResourceById(id);

    if (!resource) {
      return res.sendStatus(404).send("Resource not found");
    }

    const updatedResource = await updateResourceById(id, {
      name,
      type,
      description,
      availability,
      location,
    });

    return res.status(200).json(updatedResource).end();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server Error");
  }
};

export const getResourcesByNameController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name } = req.params;
    const resources = await getResourcesByName(name);

    if (resources.length === 0) {
      const availableNames = await getAllResourceNames();
      return res.status(404).json({
        message: `Resource name not found. Available names are: ${availableNames.join(
          ", "
        )}`,
      });
    }

    return res.status(200).json(resources);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Error fetching resources by name");
  }
};

export const getResourcesByTypeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { type } = req.params;
    const resources = await getResourcesByType(type);

    if (resources.length === 0) {
      const availableTypes = await getAllResourceTypes();
      return res.status(404).json({
        message: `Resource type not found. Available types are: ${availableTypes.join(
          ", "
        )}`,
      });
    }

    return res.status(200).json(resources);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).send("Error fetching resources by type");
  }
};
export const createResourceController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, description, availability, location } = req.body;

    // Validate the request body
    if (
      !name ||
      !type ||
      !description ||
      availability === undefined ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a resource with the same name already exists
    const existingResources = await getResourcesByName(name);
    if (existingResources.length > 0) {
      return res.status(400).json({ message: "Resource already exists" });
    }

    // Create the new resource
    const resource = await createResource({
      name,
      type,
      description,
      availability,
      location,
    });

    return res.status(200).json(resource);
  } catch (error) {
    console.error("Error creating resource:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const borrowResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = get(req, "identity._id") as string;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { resourceId } = req.params;

    if (!resourceId || !userId) {
      return res
        .status(400)
        .json({ message: "Missing resource ID or user ID" });
    }

    const resource = await ResourceModel.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (resource.availability === false) {
      return res
        .status(400)
        .json({ message: "Resource is not available for borrowing" });
    }

    resource.checkedOutBy = userObjectId;
    resource.availability = false;
    await resource.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { checkedOutResources: resource._id },
    });

    return res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const returnResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = get(req, "identity._id") as string;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { resourceId } = req.params;

    if (!userId || !resourceId) {
      return res
        .status(400)
        .json({ message: "Missing user ID or resource ID" });
    }

    const resource = await ResourceModel.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (
      !resource.checkedOutBy ||
      resource.checkedOutBy.toString() !== userObjectId.toString()
    ) {
      return res
        .status(400)
        .json({ message: "Resource is not checked out by this user" });
    }

    resource.checkedOutBy = null;
    resource.availability = true;
    await resource.save();

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { checkedOutResources: resource._id },
    });

    return res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getResourcesByLocationController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { location } = req.params;
    const resources = await getResourcesByLocation(location);

    if (resources.length === 0) {
      const availableLocations = await getAllResourceLocations();
      return res.status(404).json({
        message: `Resource location not found. Available locations are: ${availableLocations.join(
          ", "
        )}`,
      });
    }

    return res.status(200).json(resources);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching resources by location");
  }
};
