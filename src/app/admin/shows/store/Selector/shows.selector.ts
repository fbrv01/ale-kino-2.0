import { createSelector } from "@ngrx/store";
import { ShowsState } from "../States/shows.state";

const selectShowsState = (state: { ShowsState: ShowsState }) =>
  state.ShowsState;

export const selectShowsList = createSelector(
  selectShowsState,
  (state) => state.showsList
);
