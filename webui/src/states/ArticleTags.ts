import { atom } from "recoil"
import { ArticleTagCount } from "../models/ArticleTag"

export const articleTagsState = atom({
  key: 'articleTagsState',
  default: [] as ArticleTagCount[],
})
