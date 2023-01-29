import { executeQuery } from "../database/database.js";

const createItem = async (shopping_list_id, name) => {
  await executeQuery(
    "INSERT INTO shopping_list_items (shopping_list_id, name) VALUES ($1, $2);",
    shopping_list_id, name,
  );
};

const findUnCollectedItems = async (shopping_list_id) => {
  let result = await executeQuery(
    "SELECT * FROM shopping_list_items WHERE shopping_list_id = $1 AND collected = false ORDER BY name ASC;",
    shopping_list_id,
  );

  return result.rows;
};

const findCollectedItems = async (shopping_list_id) => {
  let result = await executeQuery(
    "SELECT * FROM shopping_list_items WHERE shopping_list_id = $1 AND collected = true ORDER BY name ASC;",
    shopping_list_id,
  );

  return result.rows;
};

const collectItem = async (id) => {
  await executeQuery(
    "UPDATE shopping_list_items SET collected = true WHERE id = $1;",
    id,
  );
};

export { createItem, findUnCollectedItems, findCollectedItems, collectItem, };