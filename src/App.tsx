import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage, ServicesPage, ServiceDetailPage, LoginPage, RegisterPage, ApplicationsListPage, ApplicationDetailPage, ProfilePage } from "./pages";
import { ROUTES } from "./Routes";
import { NavbarComp } from "./components/Navbar";
import { dest_root } from "./target_config";

function App() {
  // В DEV basename должен быть пустым, иначе при открытии "/" Router не сматчит и будет белый экран.
  const basename = import.meta.env.DEV ? "" : dest_root;

  return (
    <BrowserRouter basename={basename}>
      <NavbarComp />
      <div className="app-container">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
          <Route path={`${ROUTES.SERVICES}/:id`} element={<ServiceDetailPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.APPLICATIONS} element={<ApplicationsListPage />} />
          <Route path={`${ROUTES.APPLICATIONS}/:id`} element={<ApplicationDetailPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

