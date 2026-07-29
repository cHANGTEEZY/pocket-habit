/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\" && user = @request.auth.id",
    "deleteRule": "user = @request.auth.id",
    "listRule": "user = @request.auth.id",
    "updateRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation3789201847",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_2516474178",
        "help": "",
        "hidden": false,
        "id": "relation4910284756",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "habit",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "Calendar day of the log (YYYY-MM-DD).",
        "hidden": false,
        "id": "date5029384756",
        "max": "",
        "min": "",
        "name": "date",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "bool6138495067",
        "name": "completed",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "number7249506178",
        "max": null,
        "min": 0,
        "name": "count",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "When the habit was checked off.",
        "hidden": false,
        "id": "date8350617289",
        "max": "",
        "min": "",
        "name": "completed_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text9461728390",
        "max": 500,
        "min": 0,
        "name": "note",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_habitlogs001",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_habit_logs_user_habit_date` ON `habit_logs` (`user`, `habit`, `date`)"
    ],
    "name": "habit_logs",
    "system": false,
    "type": "base"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_habitlogs001");
  return app.delete(collection);
});
