import { Showing } from "src/app/shared/interfaces/showing.type";

export interface ShowsState {
  showsList: Showing[];
}

export const showsFeatureKey = "ShowsState";

export const initialShowsState: ShowsState = {
  showsList: [],
};
