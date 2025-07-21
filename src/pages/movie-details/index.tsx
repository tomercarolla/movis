import * as routeMeta from './_';
import {lazy} from "react";

export const MovieDetailsRoute = {
    path: routeMeta.path,
    Component: lazy(routeMeta.lazy),
}