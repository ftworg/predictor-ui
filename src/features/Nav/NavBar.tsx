import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import { Layout, Menu, Button, message, Tooltip, Tag } from "antd";
import { Routes } from "../../app/layout/Routes";
import { observer } from "mobx-react-lite";
import AppStore from "../../app/stores/app.store";
import { Services } from "../../app/api/agent";
import dashboardStore from "../../app/stores/dashboard.store";
import PredictionStore from "../../app/stores/prediction.store";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
  DesktopOutlined,
  InfoCircleOutlined,
  AreaChartOutlined,
  BlockOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const { Sider } = Layout;

interface IProps {
  handleLogout: () => void;
  currentPath: string;
  routeNav: (route: string) => void;
}

const NavBar: React.FC<IProps> = ({ handleLogout, currentPath, routeNav }) => {
  const { Lasttimestamp, setLasttimestamp } = useContext(PredictionStore);
  const [collapsed, setState] = useState(true);

  useEffect(() => {
    loadModelTrainingDateTime();
  }, []);

  const toggle = () => {
    setState(!collapsed);
  };

  const loadModelTrainingDateTime = async () => {
    try {
      const modelDetails = await Services.PredictionService.getModelDetails();
      setLasttimestamp(modelDetails["time"]);
    } catch (error) {
      message.error("Server Error. Please try again later.");
    }
  };

  return (
    <Layout>
      <Header className="header" style={{ padding: 0, background: "#fff" }}>
        <div className="logo">
          <Button onClick={toggle}>
            {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </Button>{" "}
          &nbsp; Predictor UI
        </div>

        <Menu mode="horizontal">
          <Menu.Item
            key="4"
            disabled
            style={{ cursor: "text" }}
            className="right"
          >
            <Tooltip title="Last Model Training">
              <Tag key={0} color="blue">
                <span>
                  Last Training - {Lasttimestamp.slice(0, 19).replace("T", " ")}
                </span>
              </Tag>
            </Tooltip>
          </Menu.Item>
        </Menu>
      </Header>

      <Layout className="site-layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            display: collapsed ? "none" : "block",
            width: "30",
            position: "absolute",
            color: "#f0f5ff",
          }}
          className="MenuButton"
        >
          <Menu
            theme="light"
            mode="inline"
            className="menuitem"
            onSelect={toggle}
            selectedKeys={
              Object.keys(Routes).includes(currentPath)
                ? [Routes[currentPath].navKey]
                : []
            }
          >
            <Menu.Item
              onClick={() => routeNav("/")}
              key="1"
              icon={<DesktopOutlined />}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              onClick={() => routeNav("/predict")}
              key="2"
              icon={<AreaChartOutlined />}
            >
              Predict
            </Menu.Item>
            <Menu.Item
              onClick={() => routeNav("/compare")}
              key="7"
              icon={<BlockOutlined />}
            >
              Compare
            </Menu.Item>
            <Menu.Item
              onClick={() => routeNav("/upload")}
              key="3"
              icon={<UploadOutlined />}
            >
              Upload
            </Menu.Item>
            <Menu.Item
              onClick={() => routeNav("/inventory")}
              key="8"
              icon={<FolderAddOutlined />}
            >
              Inventory
            </Menu.Item>
            <Menu.Item
              onClick={() => routeNav("/manage")}
              key="9"
              icon={<InfoCircleOutlined />}
            >
              Manage
            </Menu.Item>
            <Menu.Item key="5" className="right" disabled>
              <Button type="primary" onClick={handleLogout} htmlType="submit">
                Logout
              </Button>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default observer(NavBar);
