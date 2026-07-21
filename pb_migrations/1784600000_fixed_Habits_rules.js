/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516474178")

  // Fix auth rules: previous list/view checked @request.body.id (always empty on GET).
  // Multi-relation user_id matches via .id ?= auth id.
  unmarshal({
    "createRule": "@request.auth.id != \"\" && user_id.id ?= @request.auth.id",
    "deleteRule": "user_id.id ?= @request.auth.id",
    "listRule": "user_id.id ?= @request.auth.id",
    "updateRule": "user_id.id ?= @request.auth.id",
    "viewRule": "user_id.id ?= @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516474178")

  unmarshal({
    "createRule": "@request.auth.id != \"\" && user_id = @request.auth.id",
    "deleteRule": "",
    "listRule": "@request.body.id != \"\" && user_id = @request.auth.id",
    "updateRule": "user_id = @request.auth.id",
    "viewRule": "@request.body.id != \"\" && user_id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
