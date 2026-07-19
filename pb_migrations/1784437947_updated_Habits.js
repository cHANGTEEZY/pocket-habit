/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516474178")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && user_id = @request.auth.id",
    "deleteRule": "",
    "listRule": "@request.body.id != \"\" && user_id = @request.auth.id",
    "updateRule": "user_id = @request.auth.id",
    "viewRule": "@request.body.id != \"\" && user_id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516474178")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
