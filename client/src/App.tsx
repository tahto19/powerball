//@ts-nocheck
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import AdduserMain from "./components/addUser/AdduserMain";
import ErrorPage from "./components/errorPage/ErrorPage";
import SignIn from "./components/signIn/index";
import AppTheme from "@/theme/AppTheme";
import MainLayout from "./layout/MainLayout";

import AppTheme2 from "@/theme/2ndChanceAppTheme";
import MainLayout2 from "./layout/2ndChanceMainLayout";

import Dashboard from "./components/Dashboard/Dashboard";
import Administrator from "./components/Administrator/index";
import GameMaintenance from "./components/GameMaintenance/index";
import RaffleDraw from "./components/RaffleDraw/index";

import Login from "@/components/2ndChance_iFrame/Login/Login";
import LoginButton from "@/components/2ndChance_iFrame/LoginButton";
import WidgetImage from "@/components/2ndChance_iFrame/WidgetImage";
import Inquiry from "@/components/2ndChance_iFrame/Inquiry";

import Toaster_ from "./Global/toaster/Toaster_";
import { getDeviceInfo } from "./utils/util";
import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLoader from "./components/AuthLoader";

import PrizeList from "./components/PrizeList";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { getToken } from "./redux/reducers/token/asyncCalls";
import TicketScanner from "./components/ticketScanner/TicketScanner";
import Costumer from "./components/costumer/Costumer";
import Raffles from "./components/2ndChance_iFrame/Raffles/Raffles";
import Dashboard2 from "./components/2ndChance_iFrame/Dashboard";
import UserProfile from "./components/2ndChance_iFrame/UserProfile";
import ForgotPassword from "./components/2ndChance_iFrame/ForgotPassword";
import ResetPassword from "./components/2ndChance_iFrame/ForgotPassword/ResetPassword";

import ImagePage from "./components/ImagePage/Image";
import ScannerIframe from "./components/2ndChance_iFrame/Scanner/ScannerIframe";
import MyEntriesMain from "./components/2ndChance_iFrame/UserTicketDetails/MyEntriesMain";
import { MyEntries } from "./components/2ndChance_iFrame/UserTicketDetails/MyEntries";
import WinnerDetails from "./components/2ndChance_iFrame/winner/WinnerDetails";
import TicketScannedList from "./components/ticketScanner/TicketScannedList";
import { ExportDialog } from "./Global/ExportDialog/ExportDialog";
import Aplhacode from "./components/2ndChance_iFrame/alphacode/Aplhacode";
import PhoneNumberLogin from "./components/2ndChance_iFrame/Login/PhoneNumberLogin";

const routes = [
  { path: "/dashboard", component: <Dashboard />, title: "Dashboard" },
  {
    path: "/winners",
    component: <WinnerDetails url="getDataAll" />,
    title: "Winners",
  },
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
    path: "/customer",
    component: <Costumer />,
    title: "Customer",
  },
  {
    path: "/alphacode",
    component: <Aplhacode />,
    title: "Alpha Code",
  },
];

const routes2 = [
  {
    path: "/2nd-chance/",
    component: <Dashboard2 />,
    title: "Dashboard",
  },
  {
    path: "/2nd-chance/raffles",
    component: <Raffles />,
    title: "Raffles",
  },
  {
    path: "/2nd-chance/user-profile",
    component: <UserProfile />,
    title: "User Profile",
  },
  {
    path: "/2nd-chance/scanned-list",
    component: <TicketScannedList />,
    title: "Ticket Scanned",
  },
  {
    path: "/2nd-chance/my-entries",
    component: <MyEntries />,
    title: "My Entries",
  },
  {
    path: "/2nd-chance/winners",
    component: <WinnerDetails />,
    title: "Winner list",
  },
  {
    path: "/2nd-chance/scan",
    component: <TicketScanner />,
    title: "Ticket Scanner",
    title: "Ticket Scanner",
  },
];

const skipTokenPaths = ["/cms/iframe/2nd-chance/login-button"];
// Component to handle routing with conditional rendering

function AppRoutes() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const { loading, token, doneLoading } = useAppSelector(
    (state) => state.token
  );

  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return; // already ran once, skip
    hasRun.current = true;

    const isInIframe = window.self !== window.top;
    console.log(window.location);

    // Only call getToken if not in iframe
    // if (!isInIframe && !skipTokenPaths.includes(currentPath)) {
    getDeviceInfo();
    if (loading) dispatch(getToken());
    // }
  }, []);

  // useEffect(() => {
  //   // const loginPages = ["/sign-in", "/cms/", "/cms/sign-in"];
  //   // const isLoginPage = loginPages.includes(location.pathname);
  //   // console.log(loading)
  //   // if (!loading && token && isLoginPage) {
  //   //   nav("/prize-list");
  //   // }

  //   const loginPages = ["/sign-in", "/cms/", "/cms/sign-in"];
  //   const isLoginPage = loginPages.includes(location.pathname);

  //   if (!loading && token && isLoginPage) {
  //     const redirectPath = localStorage.getItem("pb_paths") || "/prize-list";
  //     localStorage.removeItem("pb_paths"); // clean it up
  //     nav(redirectPath);
  //   }
  // }, [loading, token, location.pathname, nav]);
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route element={<AuthLoader />}>
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
      </Route>

      <Route>
        {routes2.map(({ path, component, title }) => (
          <Route
            key={path}
            path={path}
            element={
              <AppTheme2>
                <MainLayout2 title={title}>{component}</MainLayout2>
              </AppTheme2>
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
        path="/scanner"
        element={<ScannerIframe />}
      />
      <Route
        path="/iframe/2nd-chance/login"
        element={<PhoneNumberLogin />}
      />
      <Route
        path="/iframe/2nd-chance/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/iframe/2nd-chance/reset-password"
        element={<ResetPassword />}
      />
      <Route
        path="/iframe/2nd-chance/login-button"
        element={<LoginButton />}
      />
      <Route
        path="/iframe/2nd-chance/inquiry"
        element={<Inquiry />}
      />
      <Route
        path="/iframe/2nd-chance/widget-image"
        element={<WidgetImage />}
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
  const basename = import.meta.env.VITE_ROUTER_BASENAME;
  let currentPath = window.location.pathname;

  return (
    <>
      <Router basename={basename}>
        <AppRoutes />
      </Router>
      {!skipTokenPaths.includes(currentPath) && <Toaster_></Toaster_>}
      {!skipTokenPaths.includes(currentPath) && <ExportDialog></ExportDialog>}
    </>
  );
}

export default App;
