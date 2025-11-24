import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import RegisterPage from "../pages/RegisterPage";
import CreateOrganisationPage from "../pages/Organisation/CreateOrganisationPage";
import RequireAuth from "../components/RequireAuth";
import RequireOrganisation from "../components/RequireOrganisation";
import EmployeesPage from "../pages/Employees/EmployeesPage";
import CreateEmployeePage from "../pages/Employees/CreateEmployeePage";
import EditEmployeePage from "../pages/Employees/EditEmployeePage";
import EmployeeDetailPage from "../pages/Employees/EmployeeDetailPage";
import TeamsPage from "../pages/Teams/TeamsPage";
import CreateTeamPage from "../pages/Teams/CreateTeamPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/setup-organisation" element={<CreateOrganisationPage />} />
      <Route
  path="/employees"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <EmployeesPage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>


      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
     <Route
  path="/dashboard"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <DashboardPage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>
<Route
  path="/employees/create"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <CreateEmployeePage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>
<Route
  path="/employees/edit/:id"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <EditEmployeePage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>
<Route
  path="/employees/:id"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <EmployeeDetailPage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>
<Route
  path="/teams"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <TeamsPage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>
<Route
  path="/teams/create"
  element={
    <RequireAuth>
      <RequireOrganisation>
        <CreateTeamPage />
      </RequireOrganisation>
    </RequireAuth>
  }
/>






    </Routes>
  );
}
