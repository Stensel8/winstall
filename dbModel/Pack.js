import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const VISIBILITY = ["public", "unlisted", "private"];
export const STATUS = ["active", "archived"];

const PackSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: VISIBILITY,
      default: "private",
    },
    status: {
      type: String,
      enum: STATUS,
      default: "active",
    },
    apps: [
      {
        _id: false,
        appId: {
          type: String,
          required: true,
        },
        appName: {
          type: String,
          required: true,
        },
        appVersion: {
          type: String,
          default: "",
        },
        icon: String,
        publisher: String,
        installOptions: {
          type: {
            scope: String,
            interactive: Boolean,
            silent: Boolean,
            force: Boolean,
            override: String,
            log: String,
            location: String,
          },
          default: undefined,
          _id: false,
        },
      },
    ],
    stats: {
      likeCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  { timestamps: { createdAt: true, updatedAt: true }, versionKey: false }
);

PackSchema.index({ userId: 1, status: 1, createdAt: -1 });
PackSchema.index({ visibility: 1, status: 1, createdAt: -1 });
PackSchema.index({ visibility: 1, status: 1, "stats.likeCount": -1 });
PackSchema.index({ "apps.appId": 1, visibility: 1, status: 1 });
PackSchema.index({ name: "text", description: "text" });

export default mongoose.models.Pack ?? mongoose.model("Pack", PackSchema);
