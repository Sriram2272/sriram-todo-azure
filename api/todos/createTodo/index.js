// api/todos/createTodo/index.js
const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  const conn = process.env.COSMOS_CONNECTION || "";
  if (!conn) {
    context.res = { status: 500, body: { error: "COSMOS_CONNECTION not configured" } };
    return;
  }

  const client = new CosmosClient(conn);
  const container = client.database("todo-db").container("todos");

  try {
    const todo = {
      title: req.body && req.body.title ? req.body.title : "Untitled",
      completed: false,
      createdAt: new Date().toISOString()
    };
    const { resource } = await container.items.create(todo);
    context.res = { status: 201, body: resource };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
