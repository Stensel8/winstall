import mongoose from "mongoose";

const PackLikeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    packId: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

PackLikeSchema.index({ userId: 1, packId: 1 }, { unique: true });
PackLikeSchema.index({ packId: 1 });

export default mongoose.models.PackLike ??
  mongoose.model("PackLike", PackLikeSchema);
