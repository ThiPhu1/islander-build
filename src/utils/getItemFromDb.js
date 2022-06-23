import { items } from "src/pages/landing/db"

export const getItemFromDb = (query) => {
  // TODO: Get item from db using its category and code
  const categoryObj = getCategoryObjFromDb({category: query?.category});
  const item = categoryObj?.data?.find(item => query?.code===item?.code)
  if (!item) {return null;}
  return {
    ...item,
    gridLevel: item?.gridLevel || categoryObj?.gridLevel || 0,
    category: categoryObj?.name
  }
}

export const getCategoryObjFromDb = (query) => {
  // TODO: get items from a category
  return items?.find(item => query?.category===item?.name);
}