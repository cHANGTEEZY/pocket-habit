/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");
    const avatar = collection.fields.getByName("avatar");
    if (!avatar || avatar.type !== "file") {
      return;
    }

    // maxSize 0 can reject uploads; set an explicit 5MB limit.
    /** @type {core.FileField} */
    const fileField = avatar;
    fileField.maxSize = 5_242_880;
    fileField.mimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");
    const avatar = collection.fields.getByName("avatar");
    if (!avatar || avatar.type !== "file") {
      return;
    }

    /** @type {core.FileField} */
    const fileField = avatar;
    fileField.maxSize = 0;

    return app.save(collection);
  },
);
