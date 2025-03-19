import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AddUser from "./components/AddUser/AddUser";
import AdduserMain from "./components/addUser/AdduserMain";
import ErrorPage from "./components/errorPage/ErrorPage";
import SignIn from "./components/signIn/index";
import AppTheme from '@/theme/AppTheme';

// Component to handle routing with conditional rendering
function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<MainPage />} /> */}
      <Route path="/*" element={
        <AppTheme>
          <Routes>
            <Route path="/" element={<SignIn />} />
          </Routes>
        </AppTheme>
      } />
      <Route path="/add-user/" element={<AddUser />} />
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
