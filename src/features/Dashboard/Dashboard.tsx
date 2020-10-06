import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import {
  Row,
  Col,
  Statistic,
  Card,
  PageHeader,
  Button,
  Tag,
  Spin,
  message,
  Select,
} from "antd";
import moment from "moment";
import { Services } from "../../app/api/agent";
import predictionStore from "../../app/stores/prediction.store";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import dashboardStore from "../../app/stores/dashboard.store";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import PredictionStore from "../../app/stores/prediction.store";
import { DashboardStatus } from "../../app/models/training-status.enum";
const { Option } = Select;

var zad = 0;
var ed = 0;
var result1: any;
// var nextDateparamete : any;

const options: {
  id: number;
  quantity: number;
  revenue: number;
  value: any;
}[] = [];

const Dashboard: React.FC<RouteComponentProps> = ({ history }) => {
  const [quatotal, setqua] = useState(0);
  const [revtotal, setrev] = useState(0);
  const [, setModelTraining] = useState({
    time: "",
    lastEntryDate: {
      year: 0,
      month: 0,
      date: 0,
    },
    version: "",
  });

  const { setPredictionOutput, setShowResult } = useContext(predictionStore);

  const {
    timeStarted,
    LastUploadDetail,
    replaceOption,
    nextdateparamter,
    LastEntryDate,
    modelVersion,
    setStarted,
    setPipelineInitiated,
    setTrainingStarted,
    setTrainingComplete,
    setModelsDeployed,
    settimeStarted,
    setLastUploadDetail,
    setreplaceOption,
    setnextDateparameter,
    setLasttimestamp,
    setLastEntryDate,
    setTreeData,
    generateCatInput,
    setmodelVersion,
  } = useContext(PredictionStore);

  const {
    setUploadDetails,
    setTmrData,
    setAccData,
    tmrData,
    accData,
  } = useContext(dashboardStore);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getNextDayPrediction = async () => {
      try {
        const input = {
          from_dashboard: true,
          criteria: 2,
          branch: [],
          category: [],
          years: [],
        };

        const result = await Services.PredictionService.getPrediction(input);
        var branches = result["branches"];
        var count = 1;
        var quatota = 0;
        var revtota = 0;
        branches.forEach((bran: { [x: string]: any }) => {
          var branch = bran["data"];
          var qua = 0,
            rev = 0;

          branch.forEach((item: any) => {
            qua += item["predicion"]["total"]["quantity"];
          });

          branch.forEach((item: any) => {
            rev += item["predicion"]["total"]["revenue"];
          });
          options.push({
            id: count,
            quantity: qua,
            revenue: rev,
            value: bran["branch"],
          });
          quatota += qua;
          revtota += rev;
          count++;
        });
        options.push({
          id: 0,
          quantity: quatota,
          revenue: revtota,
          value: "Total",
        });
        setqua(quatota);
        setrev(revtota);

        const modelDetails = await Services.PredictionService.getModelDetails();
        setModelTraining(modelDetails);
        var y = modelDetails["lastEntryDate"]["year"];
        var m = modelDetails["lastEntryDate"]["month"] - 1;
        var d = modelDetails["lastEntryDate"]["date"];
        setLastEntryDate(new Date(y, m, d).toDateString());
        setmodelVersion(modelDetails["version"]);
        setLasttimestamp(modelDetails["time"]);
        if (mounted) {
          setPredictionOutput(result);
          setTmrData(result);
        }
      } catch (error) {
        message.error("Unable to connect to server. Try again later.");
        if (mounted) setLoading(false);
      }
    };

    const getAccData = async () => {
      try {
        const result = await Services.PredictionService.getAccuracy();
        zad = Number.parseFloat(result.z_acc_diff);
        ed = Number.parseFloat(result.error_diff);

        if (mounted) {
          setAccData(result);
        }
        result1 = await Services.PredictionService.getUploadDetails();
        if (mounted) {
          setUploadDetails(result1);
          var nextDate = String(result1.nextUpload);

          var nextDatepara = nextDate.split("/");
          setnextDateparameter(
            String(
              nextDatepara[2] +
                "-" +
                nextDatepara[1] +
                "-" +
                Number(Number(nextDatepara[0]) + 1)
            )
          );
          if (
            result1.lastTrainingDetails["stages"][0]["status"] === "Incomplete"
          )
            setStarted(DashboardStatus.Incomplete);
          else {
            setStarted(DashboardStatus.Complete);
            var timestamp = result1.lastTrainingDetails["stages"][0]["time"];
            settimeStarted(
              new Date(timestamp * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            );
          }
          if (
            result1.lastTrainingDetails["stages"][1]["status"] === "Incomplete"
          )
            setPipelineInitiated(DashboardStatus.Incomplete);
          else {
            setPipelineInitiated(DashboardStatus.Complete);
            var timestamp = result1.lastTrainingDetails["stages"][0]["time"];
            settimeStarted(
              new Date(timestamp * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            );
          }

          if (
            result1.lastTrainingDetails["stages"][2]["status"] === "Incomplete"
          )
            setTrainingStarted(DashboardStatus.Incomplete);
          else {
            setTrainingStarted(DashboardStatus.Complete);
            var timestamp = result1.lastTrainingDetails["stages"][0]["time"];
            settimeStarted(
              new Date(timestamp * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            );
          }

          if (
            result1.lastTrainingDetails["stages"][3]["status"] === "Incomplete"
          )
            setTrainingComplete(DashboardStatus.Incomplete);
          else {
            setTrainingComplete(DashboardStatus.Complete);
            var timestamp = result1.lastTrainingDetails["stages"][0]["time"];
            settimeStarted(
              new Date(timestamp * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            );
          }

          if (
            result1.lastTrainingDetails["stages"][4]["status"] === "Incomplete"
          )
            setModelsDeployed(DashboardStatus.Incomplete);
          else {
            setModelsDeployed(DashboardStatus.Complete);
            var timestamp = result1.lastTrainingDetails["stages"][0]["time"];
            settimeStarted(
              new Date(timestamp * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            );
          }

          setLastUploadDetail(result1.lastTrainingDetails["lastUpdateBefore"]);
          setreplaceOption(result1.lastTrainingDetails["replaceOption"]);
        }
      } catch (error) {
        message.error("Unable to connect to server. Try again later.");
        if (mounted) setLoading(false);
      }
    };

    const getData = async () => {
      setLoading(true);
      if (!tmrData) {
        await getNextDayPrediction();
        if (!accData) {
          await getAccData();
        }
      } else {
        setPredictionOutput(tmrData);
      }
      setLoading(false);
    };

    getData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleMoreClick = () => {
    setShowResult(true);
    history.push("/predict");
  };

  const onclickhandle = (e: any, a: any) => {
    console.log(e + " " + a.rev + " " + a.qua);
    setqua(a.qua);
    setrev(a.rev);
  };
  var nextdate = new Date();
  nextdate.setDate(nextdate.getDate() + 1);

  return (
    <Spin spinning={loading}>
      <div className="dashboard container">
        <Card className="grid-item grid-item-1" style={{ textAlign: "center" }}>
          <PageHeader
            className="site-page-header"
            title="Tomorrow's Prediction"
            style={{ padding: 0 }}
            tags={<Tag color="blue">{nextdate.toDateString()}</Tag>}
          />
          <br />
          <Select
            onChange={onclickhandle}
            defaultValue="Total"
            size="large"
            style={{ width: 400 }}
          >
            {options.map(
              (v: {
                id: number;
                quantity: number;
                revenue: number;
                value: string;
              }) => (
                <Option
                  value={v.value}
                  qua={v.quantity}
                  key={v.id}
                  rev={v.revenue}
                >
                  {v.value}
                </Option>
              )
            )}
          </Select>
          <br />
          <div>
            <div className="statistics">
              <Statistic
                title="Quantity"
                suffix="Units"
                value={quatotal}
                className="stat-item"
              />

              <Statistic
                title="Revenue"
                prefix="₹"
                precision={2}
                value={revtotal}
                className="stat-item"
              />
            </div>
          </div>

          <Button
            type="primary"
            onClick={handleMoreClick}
            style={{ position: "absolute", bottom: 0, right: 0, margin: 20 }}
          >
            More
          </Button>
        </Card>
        <Card className="grid-item grid-item-2" style={{ padding: 0 }}>
          <div>
            <PageHeader
              className="site-page-header"
              title="Model"
              style={{ padding: 0 }}
            />
            <div>
              Last Entry Date - <Tag color="blue"> {LastEntryDate} </Tag> <br />
              Version - <strong>{modelVersion}</strong>
            </div>
            <div className="site-statistics-demo-card">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Error"
                    suffix="%"
                    precision={2}
                    value={
                      accData === undefined
                        ? Number.parseFloat("0.00")
                        : Number.parseFloat(accData.error_perc)
                    }
                    valueStyle={{ fontSize: 32 }}
                    className="stat-item"
                  />
                  <Statistic
                    title=""
                    value={
                      accData === undefined
                        ? Number.parseFloat("0.00")
                        : Math.abs(Number.parseFloat(accData.error_diff))
                    }
                    precision={2}
                    valueStyle={
                      ed < 0
                        ? { color: "#3f8600", fontSize: 16 }
                        : { color: "#cf1322", fontSize: 16 }
                    }
                    prefix={
                      ed < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />
                    }
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Accuracy"
                    suffix="%"
                    precision={2}
                    value={
                      accData === undefined
                        ? Number.parseFloat("0.00")
                        : Math.abs(Number.parseFloat(accData.z_acc))
                    }
                    valueStyle={{ fontSize: 32 }}
                    className="stat-item"
                  />

                  <Statistic
                    title=""
                    value={
                      accData === undefined
                        ? Number.parseFloat("0.00")
                        : Number.parseFloat(accData.z_acc_diff)
                    }
                    precision={2}
                    valueStyle={
                      zad > 0
                        ? { color: "#3f8600", fontSize: 16 }
                        : { color: "#cf1322", fontSize: 16 }
                    }
                    prefix={
                      zad < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />
                    }
                    suffix="%"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Card>

        <Card className="grid-item grid-item-3">
          <PageHeader
            className="site-page-header"
            title="Training Details"
            style={{ padding: 0 }}
          />
          <br />

          <div
            style={{
              position: "absolute",
              top: "27%",
              left: "15%",
              fontSize: 16,
            }}
          >
            Next Training -{" "}
            <span>
              <Tag color="blue">
                {new Date(String(nextdateparamter)).toDateString()}
              </Tag>
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              top: "39%",
              left: "15%",
              fontSize: 16,
            }}
          >
            Updated Before - <span> </span>
            <strong> {LastUploadDetail}</strong>
          </div>
          <div
            style={{
              position: "absolute",
              top: "51%",
              left: "15%",
              fontSize: 16,
            }}
          >
            Replace Option - <span> </span>
            <strong> {replaceOption}</strong>
          </div>
          <span />
          <div
            style={{
              position: "absolute",
              top: "63%",
              left: "15%",
              fontSize: 16,
            }}
          >
            Status -{" "}
            <span>
              {" "}
              <strong> Started </strong>
              <Tag color="green">{timeStarted}</Tag>
            </span>
          </div>
          <span />
        </Card>
      </div>
    </Spin>
  );
};

export default observer(Dashboard);
