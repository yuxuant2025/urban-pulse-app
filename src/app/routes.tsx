import { createBrowserRouter } from "react-router";
import MobileShell from "./layout/MobileShell";
import SignIn from "./screens/SignIn";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import PlaceCompanion from "./screens/PlaceCompanion";
import VisitFlow from "./screens/VisitFlow";
import Discover from "./screens/Discover";
import DiscoverCompanion from "./screens/DiscoverCompanion";
import CityInbox from "./screens/CityInbox";
import CityEmail from "./screens/CityEmail";
import Profile from "./screens/Profile";
import MapScreen from "./screens/Map";
import Chat from "./screens/Chat";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MobileShell,
    children: [
      { index: true, Component: SignIn },
      { path: "onboarding", Component: Onboarding },
      { path: "home", Component: Home },
      { path: "place/:id", Component: PlaceCompanion },
      { path: "visit/:id", Component: VisitFlow },
      { path: "discover", Component: Discover },
      { path: "discover/:id", Component: DiscoverCompanion },
      { path: "inbox", Component: CityInbox },
      { path: "inbox/:id", Component: CityEmail },
      { path: "profile", Component: Profile },
      { path: "map", Component: MapScreen },
      { path: "chat", Component: Chat },
    ],
  },
]);