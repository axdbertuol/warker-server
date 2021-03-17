const mongoose = require("mongoose");

const cidadeSchema = new mongoose.Schema(
  {
    nome: { type: String, unique: true, required: true },
    postos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posto" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

cidadeSchema.pre("save", function (next) {
  const cidade = this;

  next();
});

mongoose.model("Cidade", cidadeSchema);
