import * as routeMeta from './_';
import {lazy} from "react";

export const NotFoundRoute = {
    path: routeMeta.path,
    Component: lazy(routeMeta.lazy),
}