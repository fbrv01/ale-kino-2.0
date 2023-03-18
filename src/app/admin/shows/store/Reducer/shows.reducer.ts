/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from "@ngrx/store";
import { ShowsAPIActions } from "../Actions/shows.actions";
import { initialShowsState } from "../States/shows.state";

export const showsReducer = createReducer(
  initialShowsState,

  on(ShowsAPIActions.addNewShowingSuccess, (state, action) => {
    return { ...state, showsList: [...state.showsList, action] };
  }),
  on(ShowsAPIActions.getAllShowingsSuccess, (state, { showsList }) => ({
    ...state,
    showsList: [...showsList],
  }))
);
