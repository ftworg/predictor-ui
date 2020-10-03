import React, { useContext, useEffect } from "react";
import { Home } from "../../features/Home/Home";
import { Switch, Route } from "react-router-dom";
import Login from "../../features/Login/Login";
import { LoadingComponent } from "./LoadingComponent";
import ProtectedRoute from "../auth/ProtectedRoute";
import AppStore from "../stores/app.store";
import { observer } from "mobx-react-lite";
import { message, notification, PageHeader, Layout, Typography } from "antd";
import { SessionExpired } from "../../features/SessionExpired/SessionExpired";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const App = () => {
  const { isAuthenticated } = useContext(AppStore);

  return (
    <React.Fragment>
      <div className="noDisplay">
        <Layout style={{ height: "100vh", padding: 15 }}>
          <Content style={{ background: "#fff", height: "100%" }}>
            <div>
              <PageHeader
                title="Predictor UI"
                subTitle="A Sales Prediction Tool"
              />
              <div className="center">
                <Title className="title">Not Compatible</Title>
                <Text style={{ opacity: 0.5 }}>
                  The app will work only on large screens. We're working on
                  making it responsive. Please bare with us.
                </Text>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
      <div className="mainApp">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/loader" component={LoadingComponent} />
          <Route exact path="/session" component={SessionExpired} />
          <ProtectedRoute
            path="/"
            component={Home}
            isAuthenticated={() => isAuthenticated}
            redirectPath={"/login"}
          />{" "}
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default observer(App);
