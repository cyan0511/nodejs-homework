import {model, Schema} from "mongoose";

// Shape of the database/datatype
const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
            required: [true, "Set email for contact"],
        },
        phone: {
            type: String,
            required: [true, "Set phone for contact"],
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    {versionKey: false}
);

//MongoDB collection name = "contacts"
export const Contact = model("contacts", contactSchema);
