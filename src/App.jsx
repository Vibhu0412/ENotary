import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//landing page
const LandingPage = lazy(() => import('./pages/auth/landing-page'));

const Ecommerce = lazy(() => import('./pages/dashboard/ecommerce'));
const CrmPage = lazy(() => import('./pages/dashboard/crm'));
const ProjectPage = lazy(() => import('./pages/dashboard/project'));
const BankingPage = lazy(() => import('./pages/dashboard/banking'));
const OrganizationModel = lazy(() =>
  import('./pages/dashboard/organization-model')
);

const Login = lazy(() => import('./pages/auth/login'));
const Login2 = lazy(() => import('./pages/auth/login2'));
const Login3 = lazy(() => import('./pages/auth/login3'));
const Register = lazy(() => import('./pages/auth/register'));
const Register2 = lazy(() => import('./pages/auth/register2'));
const SigneeSignup = lazy(() => import('./pages/auth/SigneeSignup'));
const NotarySignup = lazy(() => import('./pages/auth/NotarySignup'));
const NotaryAdditionalForm = lazy(() =>
  import('./pages/auth/NotaryAdditionalForm')
);
const OrganizationSignup = lazy(() =>
  import('./pages/auth/OrganizationSignup')
);

const TermsAndCondition = lazy(() => import('./pages/TermsAndCondition'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const SetAdminPassword = lazy(() => import('./pages/auth/SetAdminPassword'));
// const TermsAndCondition = lazy(() => import('./pages/TermsAndCondition'));
// // const ResetPass = lazy(() => import('./pages/auth/reset-password'));
// const ForgotPass = lazy(() => import('./pages/auth/forgot-password'));
// const ForgotPass2 = lazy(() => import('./pages/auth/forgot-password2'));
// const ForgotPass3 = lazy(() => import('./pages/auth/forgot-password3'));
const LockScreen = lazy(() => import('./pages/auth/lock-screen'));
const LockScreen2 = lazy(() => import('./pages/auth/lock-screen2'));
const LockScreen3 = lazy(() => import('./pages/auth/lock-screen3'));
const Error = lazy(() => import('./pages/404'));
const NotaryTagging = lazy(() => import('./pages/NotaryTagging'));
// const Meeting = lazy(() => import("./pages/meeting"));
import Meeting from './pages/Meeting';
import Layout from './layout/Layout';

// components pages
const Button = lazy(() => import('./pages/components/button'));
const Dropdown = lazy(() => import('./pages/components/dropdown'));
const Badges = lazy(() => import('./pages/components/badges'));
const Colors = lazy(() => import('./pages/components/colors'));
const Typography = lazy(() => import('./pages/components/typography'));
const Alert = lazy(() => import('./pages/components/alert'));
const Progressbar = lazy(() => import('./pages/components/progress-bar'));
const Card = lazy(() => import('./pages/components/card'));
const Image = lazy(() => import('./pages/components/image'));
const Placeholder = lazy(() => import('./pages/components/placeholder'));
const Tooltip = lazy(() => import('./pages/components/tooltip-popover'));
const Modal = lazy(() => import('./pages/components/modal'));
const Carousel = lazy(() => import('./pages/components/carousel'));
const Pagination = lazy(() => import('./pages/components/pagination'));
const TabsAc = lazy(() => import('./pages/components/tab-accordion'));
const Video = lazy(() => import('./pages/components/video'));

// forms components
const InputPage = lazy(() => import('./pages/forms/input'));
const TextareaPage = lazy(() => import('./pages/forms/textarea'));
const CheckboxPage = lazy(() => import('./pages/forms/checkbox'));
const RadioPage = lazy(() => import('./pages/forms/radio-button'));
const SwitchPage = lazy(() => import('./pages/forms/switch'));
const InputGroupPage = lazy(() => import('./pages/forms/input-group'));
const InputlayoutPage = lazy(() => import('./pages/forms/input-layout'));
const InputMask = lazy(() => import('./pages/forms/input-mask'));
const FormValidation = lazy(() => import('./pages/forms/form-validation'));
const FileInput = lazy(() => import('./pages/forms/file-input'));
const FormRepeater = lazy(() => import('./pages/forms/form-repeater'));
const FormWizard = lazy(() => import('./pages/forms/form-wizard'));
const SelectPage = lazy(() => import('./pages/forms/select'));
const Flatpicker = lazy(() => import('./pages/forms/date-time-picker'));

// chart page
const AppexChartPage = lazy(() => import('./pages/chart/appex-chart'));
const ChartJs = lazy(() => import('./pages/chart/chartjs'));
const Recharts = lazy(() => import('./pages/chart/recharts'));

// map page
const MapPage = lazy(() => import('./pages/map'));

// table pages
const BasicTablePage = lazy(() => import('./pages/table/table-basic'));
const TanstackTable = lazy(() => import('./pages/table/ApprovalTable'));

// utility pages
const InvoicePage = lazy(() => import('./pages/utility/invoice'));
const InvoiceAddPage = lazy(() => import('./pages/utility/invoice-add'));
const InvoicePreviewPage = lazy(() =>
  import('./pages/utility/invoice-preview')
);
const InvoiceEditPage = lazy(() => import('./pages/utility/invoice-edit'));
const PricingPage = lazy(() => import('./pages/utility/pricing'));
const BlankPage = lazy(() => import('./pages/utility/blank-page'));
const ComingSoonPage = lazy(() => import('./pages/utility/coming-soon'));
const UnderConstructionPage = lazy(() =>
  import('./pages/utility/under-construction')
);
const BlogPage = lazy(() => import('./pages/utility/blog'));
const BlogDetailsPage = lazy(() => import('./pages/utility/blog/blog-details'));
const FaqPage = lazy(() => import('./pages/utility/faq'));
const Settings = lazy(() => import('./pages/utility/settings'));
const Profile = lazy(() => import('./pages/utility/profile'));
const IconPage = lazy(() => import('./pages/icons'));
const ChangelogPage = lazy(() => import('./pages/changelog'));

// widget pages
const BasicWidget = lazy(() => import('./pages/widget/basic-widget'));
const StatisticWidget = lazy(() => import('./pages/widget/statistic-widget'));
import Approval from './pages/table/ApprovalTable';
import Dashboard from './pages/dashboard';
import Appointment from './pages/table/AppointmentTable';
import NotaryValidity from './pages/table/NotaryValidityTable';
import Organization from './pages/table/OrganizationTable';
import User from './pages/table/UserTable';
import ApproveDetails from './pages/ApprovalDetailsForm';
import NotificationPage from './pages/table/NotificationTable';

// app page
const TodoPage = lazy(() => import('./pages/app/todo'));
const EmailPage = lazy(() => import('./pages/app/email'));
const ChatPage = lazy(() => import('./pages/app/chat'));
const ProjectPostPage = lazy(() => import('./pages/app/projects'));
const ProjectDetailsPage = lazy(() =>
  import('./pages/app/projects/project-details')
);
import { SERVER_URL, WEBSOKET_URL, APRYSE_LICENCE_KEY } from './envVariables';

const KanbanPage = lazy(() => import('./pages/app/kanban'));
const CalenderPage = lazy(() => import('./pages/app/calender'));

import Loading from '@/components/Loading';

function App() {
  return (
    <main className="App relative">
      <Routes>
        <Route
          path="/org-login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/notary-login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signee-login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/admin-login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <LandingPage />
            </Suspense>
          }
        />
        <Route
          path="/login2"
          element={
            <Suspense fallback={<Loading />}>
              <Login2 />
            </Suspense>
          }
        />
        <Route
          path="/login3"
          element={
            <Suspense fallback={<Loading />}>
              <Login3 />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loading />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/register2"
          element={
            <Suspense fallback={<Loading />}>
              <Register2 />
            </Suspense>
          }
        />
        <Route
          path="/organization-signup"
          element={
            <Suspense fallback={<Loading />}>
              <OrganizationSignup />
            </Suspense>
          }
        />
        <Route
          path="/signee-signup"
          element={
            <Suspense fallback={<Loading />}>
              <SigneeSignup />
            </Suspense>
          }
        />
        <Route
          path="/notary-signup"
          element={
            <Suspense fallback={<Loading />}>
              <NotarySignup />
            </Suspense>
          }
        />
        <Route
          path="/notaryform"
          element={
            <Suspense fallback={<Loading />}>
              <NotaryAdditionalForm />
            </Suspense>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<Loading />}>
              <ResetPassword />
            </Suspense>
          }
        />
        <Route
          path="/set-password"
          element={
            <Suspense fallback={<Loading />}>
              <SetAdminPassword />
            </Suspense>
          }
        />
        <Route
          path="/lock-screen"
          element={
            <Suspense fallback={<Loading />}>
              <LockScreen />
            </Suspense>
          }
        />
        <Route
          path="/lock-screen2"
          element={
            <Suspense fallback={<Loading />}>
              <LockScreen2 />
            </Suspense>
          }
        />
        <Route
          path="/lock-screen3"
          element={
            <Suspense fallback={<Loading />}>
              <LockScreen3 />
            </Suspense>
          }
        />
        <Route path="approvedetails" element={<ApproveDetails />} />

        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="notaryvalidity" element={<NotaryValidity />} />
          <Route path="orgadmin" element={<Organization />} />
          <Route path="user" element={<User />} />
          <Route path="approval" element={<Approval />} />
          <Route path="approvedetails/:userid" element={<ApproveDetails />} />
          <Route path="ecommerce" element={<Ecommerce />} />
          <Route path="crm" element={<CrmPage />} />
          <Route path="project" element={<ProjectPage />} />
          <Route path="banking" element={<BankingPage />} />
          <Route path="organization-model" element={<OrganizationModel />} />
          {/* App pages */}
          <Route path="todo" element={<TodoPage />} />
          <Route path="email" element={<EmailPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="projects" element={<ProjectPostPage />} />
          <Route path={'projects/:id'} element={<ProjectDetailsPage />} />
          <Route path="project-details" element={<ProjectDetailsPage />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="calender" element={<CalenderPage />} />
          {/* Components pages */}
          <Route path="button" element={<Button />} />
          <Route path="dropdown" element={<Dropdown />} />
          <Route path="badges" element={<Badges />} />
          <Route path="colors" element={<Colors />} />
          <Route path="typography" element={<Typography />} />
          <Route path="alert" element={<Alert />} />
          <Route path="progress-bar" element={<Progressbar />} />
          <Route path="card" element={<Card />} />
          <Route path="image" element={<Image />} />
          <Route path="Placeholder" element={<Placeholder />} />
          <Route path="tooltip-popover" element={<Tooltip />} />
          <Route path="modal" element={<Modal />} />
          <Route path="carousel" element={<Carousel />} />
          <Route path="Paginations" element={<Pagination />} />
          <Route path="tab-accordion" element={<TabsAc />} />
          <Route path="video" element={<Video />} />
          <Route path="input" element={<InputPage />} />
          <Route path="textarea" element={<TextareaPage />} />
          <Route path="checkbox" element={<CheckboxPage />} />
          <Route path="radio-button" element={<RadioPage />} />
          <Route path="switch" element={<SwitchPage />} />
          <Route path="input-group" element={<InputGroupPage />} />
          <Route path="input-layout" element={<InputlayoutPage />} />
          <Route path="input-mask" element={<InputMask />} />
          <Route path="form-validation" element={<FormValidation />} />
          <Route path="file-input" element={<FileInput />} />
          <Route path="form-repeater" element={<FormRepeater />} />
          <Route path="form-wizard" element={<FormWizard />} />
          <Route path="select" element={<SelectPage />} />
          <Route path="date-time-picker" element={<Flatpicker />} />
          <Route path="appex-chart" element={<AppexChartPage />} />
          <Route path="chartjs" element={<ChartJs />} />
          <Route path="recharts" element={<Recharts />} />
          <Route path="map" element={<MapPage />} />
          <Route path="table-basic" element={<BasicTablePage />} />
          <Route path="react-table" element={<TanstackTable />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="invoice-add" element={<InvoiceAddPage />} />
          <Route path="invoice-preview" element={<InvoicePreviewPage />} />
          <Route path="invoice-edit" element={<InvoiceEditPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="blank-page" element={<BlankPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog-details" element={<BlogDetailsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="basic" element={<BasicWidget />} />
          <Route path="statistic" element={<StatisticWidget />} />
          <Route path="icons" element={<IconPage />} />
          <Route path="changelog" element={<ChangelogPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Route>

        <Route path="/organization" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="orgadmin" element={<Organization />} />
          <Route path="user" element={<User />} />
          <Route path="banking" element={<BankingPage />} />
          <Route path="ecommerce" element={<Ecommerce />} />
          <Route path="calender" element={<CalenderPage />} />
          <Route path="blank-page" element={<BlankPage />} />
          <Route path="crm" element={<CrmPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="email" element={<EmailPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route path="meeting" element={<Meeting />} />
        {/* <Route path="tag" element={<NotaryProcess />} /> */}
        <Route path="/notary" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="orgadmin" element={<Organization />} />
          <Route path="user" element={<User />} />
          <Route path="calender" element={<CalenderPage />} />
          <Route path="blank-page" element={<BlankPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="tagging" element={<NotaryTagging />} />
        </Route>

        <Route path="/signee" element={<Layout />}>
          {/* <Route path="meeting" element={<Meeting />} /> */}
          <Route path="calender" element={<CalenderPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="appointment" element={<Appointment />} />
          {/* <Route path="meeting" element={<Meeting />} /> */}
          <Route path="meeting" element={<Meeting />} />
          <Route path="calender" element={<CalenderPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="orgadmin" element={<Organization />} />
          <Route path="user" element={<User />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="blank-page" element={<BlankPage />} />
          <Route path="todo" element={<TodoPage />} />
        </Route>

        <Route
          path="/404"
          element={
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          }
        />
        <Route
          path="/coming-soon"
          element={
            <Suspense fallback={<Loading />}>
              <ComingSoonPage />
            </Suspense>
          }
        />
        <Route
          path="/under-construction"
          element={
            <Suspense fallback={<Loading />}>
              <UnderConstructionPage />
            </Suspense>
          }
        />
        <Route path="profile" element={<Profile />} />
        <Route path="termsandcondition" element={<TermsAndCondition />} />
      </Routes>
    </main>
  );
}

export default App;
