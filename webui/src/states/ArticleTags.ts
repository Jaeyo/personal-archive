import { atom } from "recoil"
import { ArticleTagCount } from "../models/ArticleTag"

// TODO IMME: remove
export const articleTagsState = atom({
  key: 'articleTagsState',
  default: [] as ArticleTagCount[],
})
