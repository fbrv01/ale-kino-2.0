import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Showing } from "src/app/shared/interfaces/showing.type";

export const ShowsActions = createActionGroup({
  source: "Showings",
  events: {
    "add new showing": props<Showing>(),
    "get all showings": emptyProps(),
  },
});
export const ShowsAPIActions = createActionGroup({
  source: "Showings API",
  events: {
    ["add new showing success"]: props<Showing>(),
    ["add new showing failure"]: emptyProps(),
    ["get all showings success"]: props<{ showsList: Showing[] }>(),
    ["get all showings failure"]: emptyProps(),
  },
});
