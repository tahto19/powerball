import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AddUser from "./components/AddUser/AddUser";
import AdduserMain from "./components/addUser/AdduserMain";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import SignIn from "./components/SignIn/index";
import AppTheme from '@/theme/AppTheme';
import MainLayout from "./layout/MainLayout";
import Dashboard from "./components/Dashboard/index";
import Administrator from "./components/Administrator/index";


const routes = [
  { path: "/dashboard", component: <Dashboard />, title: "Dashboard" },
  { path: "/administrator", component: <Administrator />, title: "Administrator" },
]
// Component to handle routing with conditional rendering
function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Routes>
            <Route
              path="/"
              element={
                <AppTheme>
                  <SignIn />
                </AppTheme>
              }
            />
            {routes.map(({ path, component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <AppTheme>
                    <MainLayout>{component}</MainLayout>
                  </AppTheme>
                }
              />
            ))}
          </Routes>
        }
      />
      <Route path="/add-user/" element={<AdduserMain />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router basename="/">
      <AppRoutes />
    </Router>
  );
}

export default App;
