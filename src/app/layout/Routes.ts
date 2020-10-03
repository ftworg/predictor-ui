import Dashboard from "../../features/Dashboard/Dashboard";
import Prediction from "../../features/Prediction/Prediction";
import FileUpload from "../../features/Upload/FileUpload";
import { SignUpForm } from "../../features/SignUp/SignUpForm";
import { LoadingComponent } from "./LoadingComponent";
import Accuracy from "../../features/Accuracy/Accuracy";
import Compare from "../../features/Compare/Compare";
import Inventory from "../../features/Inventory/Inventory";
import Manage from "../../features/Manage/Manage";

export const Routes: {
  [id: string]: { component: React.FC<any>; navKey: string };
} = {
  "/": { component: Dashboard, navKey: "1" },
  "/predict": { component: Prediction, navKey: "2" },
  "/compare": { component: Compare, navKey: "7" },
  "/upload": { component: FileUpload, navKey: "3" },
  "/user/create": { component: SignUpForm, navKey: "5" },
  "/accuracy": { component: Accuracy, navKey: "6" },
  "/loader": {
    component: LoadingComponent,
    navKey: "",
  },
  "/inventory": { component: Inventory, navKey: "8" },
  "/manage": { component: Manage, navKey: "9" },
};
