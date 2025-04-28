import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { request } from "graphql-request";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCommentsFailure,
  FetchCommentsPayload,
  fetchCommentsSuccess,
} from "../slices/comments.slice";
import GetComments from "../../graphql/queries/GetComments.graphql";

export const fetchCommentsEpic = (
  action$: Observable<PayloadAction<FetchCommentsPayload>>
) =>
  action$.pipe(
    ofType("comments/fetchComments"),
    switchMap((action: PayloadAction<FetchCommentsPayload>) => {
      const { url } = action.payload;
      return from(request("/graphql", GetComments, { url })).pipe(
        map((response) => fetchCommentsSuccess(response.comments)),
        catchError((error) => {
          console.error("Error fetching comments:", error);
          return of(fetchCommentsFailure(error.message));
        })
      );
    })
  );

export const commentAddedEpic = (action$) =>
  action$.pipe(
    ofType("comments/subscribeToNewComments"),
    switchMap(() => {
      return from(
        useSubscription({ subscription: CommentAddedSubscription })
      ).pipe(
        map((newComment) => addComment(newComment)),
        catchError((error) => {
          console.error("Error in subscription:", error);
          return [];
        })
      );
    })
  );
