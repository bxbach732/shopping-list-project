import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listService from "../services/listServices.js";
import * as requestUtils from "../utils/requestUtils.js";
import * as itemService from "../services/itemServices.js";
import { executeQuery } from "../database/database.js";

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const addList = async (request) => {
  const formData = await request.formData();
  const name = formData.get("name");

  await listService.create(name);

  return requestUtils.redirectTo("/lists");
};

const viewLists = async (request) => {
  const data = {
    lists: await listService.findAllActiveLists(),
  };

  return new Response(await renderFile("lists.eta", data), responseDetails);
};

const viewList = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");

  const data = {
    list: await listService.findById(urlParts[2]),
    unCollectedItems: await itemService.findUnCollectedItems(urlParts[2]),
    collectedItems: await itemService.findCollectedItems(urlParts[2]),
  };

  return new Response(await renderFile("list.eta", data), responseDetails);
};

const viewMain = async (request) => {
  const data = {
    listCount: await executeQuery("SELECT * FROM shopping_lists;"),
    itemCount: await executeQuery("SELECT * FROM shopping_list_items;"),
  }
  return new Response(await renderFile("main.eta", data), responseDetails);
}

const deactiveList = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  await listService.deactiveById(urlParts[2]);

  return await requestUtils.redirectTo("/lists");
};


export { addList, viewLists, viewList, viewMain, deactiveList };