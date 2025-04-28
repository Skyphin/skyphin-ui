import { combineEpics } from "redux-observable";
import { commentAddedEpic, fetchCommentsEpic } from "./comments.epic";

export const rootEpic = combineEpics(fetchCommentsEpic, commentAddedEpic);
