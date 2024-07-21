import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      "book",
      "ebook",
      "journal",
      "magazine",
      "newspaper",
      "dvd",
      "cd",
      "audiobook",
      "map",
      "atlas",
      "microform",
      "manuscript",
      "archive",
      "database",
      "computer",
      "tablet",
      "study_room",
      "conference_room",
      "multimedia_kit",
      "artwork",
      "exhibit",
      "game",
      "puzzle",
    ],
  },
  location: { type: String, required: true },
  availability: { type: Boolean, default: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const ResourceModel = mongoose.model("Resource", ResourceSchema);

export const getResources = () => ResourceModel.find();

export const getResourcesByName = (name: string) =>
  ResourceModel.find({ name });

export const getResourceById = (id: string) => ResourceModel.findById(id);

export const createResource = (values: Record<string, any>) =>
  new ResourceModel(values).save().then((resource) => resource.toObject());

export const deleteResourceById = (id: string) =>
  ResourceModel.findOneAndDelete({ _id: id });

export const updateResourceById = (id: string, values: Record<string, any>) =>
  ResourceModel.findByIdAndUpdate(id, values, { new: true }).then((resource) =>
    resource.toObject()
  );

export const getResourcesByType = (type: string) =>
  ResourceModel.find({ type });

export const getResourcesByLocation = (location: string) =>
  ResourceModel.find({ location });

export const getAllResourceNames = async () => {
  const names = await ResourceModel.distinct("name");
  return names;
};

export const getAllResourceTypes = async () => {
  const types = await ResourceModel.distinct("type");
  return types;
};

export const getAllResourceLocations = async () => {
  const locations = await ResourceModel.distinct("location");
  return locations;
};
