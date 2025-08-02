const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["important", "normal", "not important"],
      default: "normal",
    },
    dueDate: {
      type: Date,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

todoSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = { Todo };
