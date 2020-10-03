import React, { useEffect, useState, useContext } from "react";
import { Upload, message, Spin } from "antd";
import { InboxOutlined, ClockCircleOutlined } from "@ant-design/icons";
import PredictionStore from "../../app/stores/prediction.store";
import { Services } from "../../app/api/agent";
import moment from "moment";
import { DashboardStatus } from "../../app/models/training-status.enum";

const { Dragger } = Upload;

export const UploadButtons = () => {
  const {
    settimePipelineInitiated,
    settimeTrainingStarted,
    settimeTrainingComplete,
    settimeModelsDeployed,
    setnextDateparameter,
    settimeStarted,
    setreplaceOption,
    setLastUploadDetail,
    setStarted,
    setPipelineInitiated,
    setTrainingStarted,
    setTrainingComplete,
    setModelsDeployed,
    setreplaceOptions,
    replaceOption,
  } = useContext(PredictionStore);

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [nextUpload, setNextUpload] = useState("");

  const props = {
    name: "file",
    accept: ".xls",
    multiple: false,
    data: { replaceOption },
    action: Services.UploadService.FileUploadURL,
    headers: { "x-auth-token": localStorage.getItem("x-auth-token") ?? "" },
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        console.log(info);
      } else {
        setLoading(true);
        setStarted(DashboardStatus.Incomplete);
      }
      if (status === "done") {
        setTimeout(() => {
          setLoading(false);
          setDisabled(true);
          let next = moment().add(1, "week").toObject();
          setNextUpload(`${next.date}/${next.months + 1}/${next.years}`);
          setStarted(DashboardStatus.Complete);
          message.success(`${info.file.name} file uploaded successfully.`);
          setPipelineInitiated(DashboardStatus.Incomplete);
          setTimeout(() => {
            setPipelineInitiated(DashboardStatus.Complete);
            setTrainingStarted(DashboardStatus.Incomplete);
            setTrainingComplete(DashboardStatus.Incomplete);
            setModelsDeployed(DashboardStatus.Incomplete);
          }, 2000);
        }, 3000);
      } else if (status === "error") {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };

  let mounted = true;

  useEffect(() => {
    allowUpload();

    return () => {
      mounted = false;
    };
  }, [replaceOption]);

  const allowUpload = async () => {
    setLoading(true);
    try {
      const result = await Services.UploadService.allowUpload();
      // console.log(result);
      let nextDate = String(result.nextUpload);
      let timestamp = result.lastTrainingDetails["stages"][0]["time"];
      settimeStarted(
        new Date(timestamp * 1000).toISOString().slice(0, 19).replace("T", " ")
      );
      let nextDatepara = nextDate.split("/");
      setnextDateparameter(
        String(
          nextDatepara[2] +
            "-" +
            nextDatepara[1] +
            "-" +
            Number(Number(nextDatepara[0]) + 1)
        )
      );
      if (mounted) {
        setDisabled(!result.allowUpload);
        setNextUpload(result.nextUpload);
        setreplaceOptions(result.replaceOptions);
        setLoading(false);
        if (result.lastTrainingDetails["stages"][0]["status"] === "Incomplete")
          setStarted(DashboardStatus.Incomplete);
        else {
          setStarted(DashboardStatus.Complete);
          let timestamp = result.lastTrainingDetails["stages"][0]["time"];
          settimeStarted(
            new Date(timestamp * 1000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          );
        }
        if (result.lastTrainingDetails["stages"][1]["status"] === "Incomplete")
          setPipelineInitiated(DashboardStatus.Incomplete);
        else {
          setPipelineInitiated(DashboardStatus.Complete);
          let timestamp = result.lastTrainingDetails["stages"][1]["time"];
          settimePipelineInitiated(
            new Date(timestamp * 1000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          );
        }

        if (result.lastTrainingDetails["stages"][2]["status"] === "Incomplete")
          setTrainingStarted(DashboardStatus.Incomplete);
        else {
          setTrainingStarted(DashboardStatus.Complete);
          let timestamp = result.lastTrainingDetails["stages"][2]["time"];
          settimeTrainingStarted(
            new Date(timestamp * 1000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          );
        }

        if (result.lastTrainingDetails["stages"][3]["status"] === "Incomplete")
          setTrainingComplete(DashboardStatus.Incomplete);
        else {
          setTrainingComplete(DashboardStatus.Complete);
          let timestamp = result.lastTrainingDetails["stages"][3]["time"];
          settimeTrainingComplete(
            new Date(timestamp * 1000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          );
        }

        if (result.lastTrainingDetails["stages"][4]["status"] === "Incomplete")
          setModelsDeployed(DashboardStatus.Incomplete);
        else {
          setModelsDeployed(DashboardStatus.Complete);
          let timestamp = result.lastTrainingDetails["stages"][4]["time"];
          settimeModelsDeployed(
            new Date(timestamp * 1000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          );
        }
        setLastUploadDetail(result.lastTrainingDetails["lastUpdateBefore"]);
        setreplaceOption(
          result.replaceOptions.findIndex(
            (r: string) => r === result.lastTrainingDetails["replaceOption"]
          )
        );
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Dragger {...props} disabled={disabled}>
      <Spin spinning={loading}>
        {disabled ? (
          <div>
            <p className="ant-upload-drag-icon">
              <ClockCircleOutlined />
            </p>
            <p className="ant-upload-text">Next Upload Date - {nextUpload}</p>
            <p className="ant-upload-hint">
              Please bare with us, due to technical reasons, we allow uploading
              data only after 7 days from previous upload
            </p>
          </div>
        ) : (
          <div>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload (.xls)
            </p>
            <p className="ant-upload-hint">
              Please bare with us, due to technical reasons, we allow uploading
              data only after 7 days from previous upload
            </p>
          </div>
        )}
      </Spin>
    </Dragger>
  );
};
