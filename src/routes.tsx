import {createBrowserRouter, Navigate} from "react-router";
import App from "./App.tsx";
import {HomepageRoute} from "@/pages/homepage";
import {NotFoundRoute} from "@/pages/404";
import {MovieDetailsRoute} from "@/pages/movie-details";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            HomepageRoute,
            {
                path: '/movie',
                element: <Navigate to="/" replace />,
            },
            MovieDetailsRoute,
            NotFoundRoute,
            {
                path: '*',
                element: <Navigate to="/404" replace />,
            },
        ]
    },
]);