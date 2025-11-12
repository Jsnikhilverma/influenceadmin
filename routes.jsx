import {
  HomeIcon,
  ArchiveBoxArrowDownIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import Home from "./src/pages/dashboard/home"; // Fixed path
import Leads from "./src/pages/dashboard/users/Users"; // Fixed path
import PrivateRoute from "@/components/PrivateRoute";
// import MainCetogory from "@/pages/dashboard/urban-cetogory/Main-cetogory";
// import AddProduct from "@/pages/dashboard/urban-addProduct/AddProduct";
import Order from "@/pages/dashboard/orders/Order";
import { TicketIcon } from "lucide-react";
import Transaction from "@/pages/dashboard/transaction/Transaction";
// import BannerPage from "@/pages/dashboard/banners/BannerPage";
import ContactUsQueries from "@/pages/dashboard/Query/query"
import Susbscriber from "@/pages/dashboard/subscriber/Subscriber";
// import ClientDetail from "@/pages/dashboard/subscriber/ClientDetail";
import AdminStats from "@/pages/dashboard/stats/AdminStats";
import CollaborationRequests from "@/pages/dashboard/requests/CollaborationRequests";
// import ClientProjects from "@/pages/dashboard/projects/ClientProjects";
// import ProjectBids from "@/pages/dashboard/projects/ProjectBids";
// import QueryDetail from "@/pages/dashboard/Query/QueryDetail";
import Brands from "@/pages/dashboard/brands/Brands";
import KycList from "@/pages/dashboard/kyc/KycList";
import Payments from "@/pages/dashboard/payments/Payments";
import Setting from "@/pages/dashboard/Setting";

const iconClass = "w-5 h-5 text-inherit";

export const routes = [
  {
    layout: "dashboard",

    pages: [
      {
        icon: <HomeIcon className={iconClass} />,
        name: "Dashboard",
        path: "/home", // Fixed path
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },

      {
        icon: <ArchiveBoxArrowDownIcon className={iconClass} />,
        name: "All Influencers",
        path: "/all-users", // Fixed path
        element: (
          <PrivateRoute>
            <Leads />
          </PrivateRoute>
        ),
      },
        {
        icon: <UsersIcon className={iconClass} />,
        name: "All Client",
        path: "/all-client", // Fixed path
        element: (
          <PrivateRoute>
            <Susbscriber />
          </PrivateRoute>
        ),
      },
      {
        icon: <TagIcon className={iconClass} />,
        name: "Admin Analytics",
        path: "/analytics",
        element: (
          <PrivateRoute>
            <AdminStats />
          </PrivateRoute>
        ),
      },
      {
        icon: <TagIcon className={iconClass} />,
        name: "KYC",
        path: "/kyc",
        element: (
          <PrivateRoute>
            <KycList />
          </PrivateRoute>
        ),
      },
      {
        icon: <TagIcon className={iconClass} />,
        name: "Payments",
        path: "/payments",
        element: (
          <PrivateRoute>
            <Payments />
          </PrivateRoute>
        ),
      },
      {
        icon: <TagIcon className={iconClass} />,
        name: "Collab Requests",
        path: "/collaboration-requests",
        element: (
          <PrivateRoute>
            <CollaborationRequests />
          </PrivateRoute>
        ),
      },
      // {
      //   name: "Collab Request Detail",
      //   path: "/collaboration-requests/:id",
      //   element: (
      //     <PrivateRoute>
      //       <CollaborationRequestDetail />
      //     </PrivateRoute>
      //   ),
      // },
      {
        icon: <TagIcon className={iconClass} />,
        name: "Brands",
        path: "/brands",
        element: (
          <PrivateRoute>
            <Brands />
          </PrivateRoute>
        ),
      },

      {
        icon: <ArchiveBoxArrowDownIcon className={iconClass} />,
        name: "Queries",
        path: "/queries", // Fixed path
        element: (
          <PrivateRoute>
            <ContactUsQueries />
          </PrivateRoute>
        ),
      },

      {
        icon: <UsersIcon className={iconClass} />,
        name: "All projects",
        path: "/order", // Main path for "All Users" without any element
        subPages: [
          {
            name: "Projects",
            path: "/order/all",
            element: (
              <PrivateRoute>
                {" "}
                <Order />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        icon: <TicketIcon className={iconClass} />,
        name: "Transaction",
        path: "/transaction", // Fixed path
        element: (
          <PrivateRoute>
            {" "}
            <Transaction />
          </PrivateRoute>
        ),
      },
      {
        icon: <TicketIcon className={iconClass} />,
        name: "Setting",
        path: "/setting", // Fixed path
        element: (
          <PrivateRoute>
            {" "}
            <Setting />
          </PrivateRoute>
        ),
      },
    ],
  },
];

export default routes;
