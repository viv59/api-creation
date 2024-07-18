import express from "express";
import {
  createResource,
  deleteResourceById,
  getResourceById,
  getResources,
  getResourcesByName,
  getResourcesByType,
  updateResourceById,
} from "../db/resources";

export const getAllResources = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const resources = await getResources();
    return res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getResourceByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const resource = await getResourceById(id);

    if (!resource) {
      return res.sendStatus(404);
    }

    return res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const deleteResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedResource = await deleteResourceById(id);

    if (!deletedResource) {
      return res.sendStatus(404);
    }

    return res.status(200).json(deletedResource);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const updateResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
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
      return res.sendStatus(404);
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
    return res.sendStatus(400);
  }
};

export const getResourcesByNameController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name } = req.params;
    const resources = await getResourcesByName(name);
    return res.status(200).json(resources);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getResourcesByTypeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { type } = req.params;
    const resources = await getResourcesByType(type);
    return res.status(200).json(resources);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
