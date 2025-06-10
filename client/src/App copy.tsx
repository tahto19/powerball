//@ts-nocheck
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import AdduserMain from "./components/addUser/AdduserMain";
import ErrorPage from "./components/errorPage/ErrorPage";
import SignIn from "./components/signIn/index";
import AppTheme from "@/theme/AppTheme";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Administrator from "./components/Administrator/index";
import GameMaintenance from "./components/GameMaintenance/index";
import RaffleDraw from "./components/RaffleDraw/index";

import Login from "@/components/2ndChance_iFrame/Login/Login";

import Toaster_ from "./Global/toaster/Toaster_";
import { getDeviceInfo } from "./utils/util";
import { useEffect, useRef } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import PrizeList from "./components/PrizeList";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { getToken } from "./redux/reducers/token/asyncCalls";
import TicketScanner from "./components/ticketScanner/TicketScanner";
import Costumer from "./components/costumer/Costumer";
import Raffles from "./components/2ndChance_iFrame/Raffles/Raffles";
import ImagePage from "./components/ImagePage/Image";
import ScannerIframe from "./components/2ndChance_iFrame/Scanner/Scanner";

const routes = [
  { path: "/dashboard", component: <Dashboard />, title: "Dashboard" },
  {
    path: "/administrator",
    component: <Administrator />,
    title: "Administrator",
  },
  {
    path: "/images",
    component: <ImagePage />,
    title: "Images",
  },
  {
    path: "/raffle-draw",
    component: <RaffleDraw />,
    title: "Raffle Draw",
  },
  {
    path: "/prize-list",
    component: <PrizeList />,
    title: "Prize List",
  },
  {
    path: "/game-maintenance",
    component: <GameMaintenance />,
    title: "Game Maintenance",
  },
  {
    path: "/scan",
    component: <TicketScanner />,
    title: "Ticket Scanner",
  },
  {
    path: "/MyScan",
    component: <TicketScanner />,
    title: "My Ticket",
  },
  {
    path: "/costumer",
    component: <Costumer />,
    title: "Costumer",
  },
];

// Component to handle routing with conditional rendering
function AppRoutes() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const { loading, token, doneLoading } = useAppSelector(
    (state) => state.token
  );
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return; // already ran once, skip
    hasRun.current = true;
    getDeviceInfo();
    if (loading) dispatch(getToken());
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (
      !loading &&
      token !== "" &&
      token &&
      (currentPath === "/sign-in" ||
        currentPath === "/cms/" ||
        currentPath === "/cms/sign-in")
    ) {
      nav("/prize-list");
    }
  }, [loading]);
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route
        path="/sign-in"
        element={
          <AppTheme>
            <SignIn />
          </AppTheme>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to="/sign-in"
            replace
          />
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {routes.map(({ path, component, title }) => (
          <Route
            key={path}
            path={path}
            element={
              <AppTheme>
                <MainLayout title={title}>{component}</MainLayout>
              </AppTheme>
            }
          />
        ))}
      </Route>

      {/* Iframe Routes */}
      <Route
        path="/iframe/add-user"
        element={<AdduserMain />}
      />
      <Route
        path="/iframe/2nd-chance/raffles"
        element={<Raffles />}
      />
      <Route
        path="/iframe/2nd-chance/scan"
        element={<ScannerIframe />}
      />
      <Route
        path="/iframe/2nd-chance/login"
        element={<Login />}
      />

      {/* Catch-All Error Page */}
      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>
  );
}

function App() {
  return (
    <>
      <Router basename="/">
        <AppRoutes />
      </Router>
      <Toaster_></Toaster_>
    </>
  );
}

export default App;
