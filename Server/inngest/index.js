// Server/inngest/index.js
import { Inngest } from "inngest";
import User from "../models/User.js";

/* -------- CREATE A CLIENT TO SEND AND RECEIVE EVENTS -------- */
export const inngest = new Inngest({ id: "loopin-app" });

/* -------- INNGEST FUNCTION TO SAVE USER DATA TO A DATABASE -------- */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    /* ---- CHECK AVAILABILITY OF USERNAME ---- */
    const user = await User.findOne({ username });

    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
      username,
    };

    await User.create(userData);
  }
);

/* -------- INNGEST FUNCTION TO UPDATE USER DATA TO A DATABASE -------- */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, updatedUserData);
  }
);

/* -------- INNGEST FUNCTION TO DELETE USER DATA TO A DATABASE -------- */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);

/* -------- CREATE AN EMPTY ARRAY WHERE WE'LL EXPORT FUTURE INNGEST FUNCTIONS -------- */
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
