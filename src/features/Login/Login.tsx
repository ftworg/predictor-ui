import React, { useContext, useEffect } from "react";
import "./Login.css";
import {
  Layout,
  PageHeader,
  Form,
  Button,
  Input,
  Checkbox,
  notification,
} from "antd";
import { RouteComponentProps } from "react-router-dom";
import AppStore from "../../app/stores/app.store";
import { observer } from "mobx-react-lite";

const { Content, Footer } = Layout;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { gcpLogin, loggingIn, isAuthenticated } = useContext(AppStore);

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, []);

  const onFinish = async (values: any) => {
    const success = await gcpLogin(values.email, values.password);

    if (success) {
      history.push("/");
      notification["success"]({
        message: "Login Successful",
        description:
          "Welcome back to Predictor UI. Hope our predictions help you in managing your business. Help us improve our predictions by uploading your past sales record",
      });
    }
  };

  return (
    <Layout style={{ height: "100vh", padding: 15 }}>
      <Content style={{ background: "#fff", height: "100%" }}>
        <div
          style={{
            padding: 20,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PageHeader title="Predictor UI" subTitle="A Sales Prediction Tool" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "80%",
              justifyContent: "center",
            }}
          >
            <Form
              style={{ width: 400 }}
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address!",
                  },
                ]}
              >
                <Input type="email" placeholder="example@xyz.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password type="password" placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                style={{ textAlign: "left" }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loggingIn}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default observer(Login);
