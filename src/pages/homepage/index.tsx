import * as routeMeta from './_';
import {lazy} from "react";

export const HomepageRoute = {
    path: routeMeta.path,
    Component: lazy(routeMeta.lazy),
}