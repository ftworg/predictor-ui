import { configure, observable, action, computed } from "mobx";
import { createContext } from "react";
import moment, { Moment } from "moment";
import { Line, Pie } from "@antv/g2plot";
import { TrainingStatus } from "../models/training-status.enum";
import { IPredictionOutput } from "../models/prediction-output.model";
import { DashboardStatus } from "../../app/models/training-status.enum";
// import { stat } from "fs";

configure({ enforceActions: "always" });

class PredictionStore {
  constructor() {
    this.reset();
  }

  @action
  reset = () => {
    this.criteria = 0;
    this.dateInput = [
      moment(new Date(2020, 1, 3)),
      moment(new Date(2020, 1, 5)),
    ];
    this.categories = [];
    this.predictionOutput = undefined;
    this.tableLoading = false;
    this.showResult = false;
    this.showForm = true;
    this.branchList = [];
    this.treeData = [];
    this.linePlot = null;
    this.piePlotQuantity = null;
    this.piePlotRevenue = null;
    this.FileUploadStatus = TrainingStatus.Pending;
    this.PipelineInitiatedStatus = TrainingStatus.Pending;
    this.TrainingCompletedStatus = TrainingStatus.Pending;
    this.ModelReadyStatus = TrainingStatus.Pending;
    this.tableData = [];
    this.insightData = [];
    this.StartedStatus = DashboardStatus.Incomplete;
    this.PipelineInitiated = DashboardStatus.Incomplete;
    this.TrainingStarted = DashboardStatus.Incomplete;
    this.TrainingComplete = DashboardStatus.Incomplete;
    this.ModelsDeployed = DashboardStatus.Incomplete;
    this.nextdateparamter = String;
    this.replaceOptions = [];
    this.timeStarted = undefined;
    this.LastUploadDetail = undefined;
    this.replaceOption = undefined;
    this.timePipelineInitiated = undefined;
    this.timeTrainingStarted = undefined;
    this.timeTrainingComplete = undefined;
    this.timeModelsDeployed = undefined;
    this.Lasttimestamp = "";
    this.LastEntryDate = undefined;
    this.modelVersion = undefined;
  };

  @observable
  criteria: number = 0;

  @observable
  dateInput: Moment[] = [
    moment(new Date(2020, 1, 3)),
    moment(new Date(2020, 1, 5)),
  ];

  @observable
  categories: string[] = [];

  @observable
  predictionOutput: any;

  @observable
  tableLoading: boolean = false;

  @observable
  showResult: boolean = false;

  @observable
  showForm: boolean = true;

  @observable
  branchList: { key: number; name: string }[] = [];

  @observable
  treeData: any[] = [];

  @observable
  linePlot: Line | null = null;

  @observable
  piePlotQuantity: Pie | null = null;

  @observable
  piePlotRevenue: Pie | null = null;

  @observable
  FileUploadStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  tableData: any[] = [];

  @observable
  insightData: any[] = [];

  @observable
  PipelineInitiatedStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  TrainingCompletedStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  ModelReadyStatus: TrainingStatus = TrainingStatus.Pending;

  @observable
  StartedStatus: DashboardStatus = DashboardStatus.Incomplete;

  @observable
  PipelineInitiated: DashboardStatus = DashboardStatus.Incomplete;

  @observable
  TrainingStarted: DashboardStatus = DashboardStatus.Incomplete;

  @observable
  TrainingComplete: DashboardStatus = DashboardStatus.Incomplete;

  @observable
  ModelsDeployed: DashboardStatus = DashboardStatus.Incomplete;

  @observable
  replaceOptions = [];

  @observable
  timeStarted = undefined;

  @observable
  LastUploadDetail = undefined;

  @observable
  replaceOption: number | undefined = undefined;

  @observable
  nextdateparamter = String;

  @observable
  timePipelineInitiated = undefined;

  @observable
  timeTrainingStarted = undefined;

  @observable
  timeTrainingComplete = undefined;

  @observable
  timeModelsDeployed = undefined;

  @observable
  Lasttimestamp = "";

  @observable
  LastEntryDate = undefined;

  @observable
  modelVersion = undefined;

  @computed
  get lineData() {
    const lineData: { year: string; sales: number }[] = [];

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((item: any) => {
        Object.keys(item.predicion).forEach((key) => {
          if (key !== "total") {
            const data = lineData.find((pd) => pd.year === key);
            if (!data) {
              lineData.push({
                year: key,
                sales: Math.round(item.predicion[key].revenue),
              });
            } else {
              data.sales += Math.round(item.predicion[key].revenue);
            }
          }
        });
      });
    });

    return lineData;
  }

  @computed
  get pieDataQuantity() {
    const pieData: { type: string; value: number }[] = [];

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((item: any) => {
        const data = pieData.find((pd) => pd.type === item.super_category);
        if (!data) {
          pieData.push({
            type: item.super_category,
            value: item.predicion["total"].quantity,
          });
        } else {
          data.value += item.predicion["total"].quantity;
        }
      });
    });

    return pieData;
  }

  @computed
  get totalQuantity() {
    let totalQ = 0;

    const result = this.predictionOutput as IPredictionOutput;

    if (!result) {
      return 0;
    }

    result.branches.forEach((branch) => {
      branch.data.forEach((data) => {
        totalQ += data.predicion["total"].quantity;
      });
    });

    return totalQ;
  }

  @computed
  get totalRevenue() {
    let totalR = 0;

    const result = this.predictionOutput as IPredictionOutput;

    if (!result) {
      return 0;
    }

    result.branches.forEach((branch) => {
      branch.data.forEach((data) => {
        totalR += data.predicion["total"].revenue;
      });
    });

    return Number.parseFloat(totalR.toFixed(2)).toLocaleString("en-IN");
  }

  @computed
  get pieDataRevenue() {
    const pieData: { type: string; value: number }[] = [];

    const result = this.predictionOutput as IPredictionOutput;

    result.branches.forEach((branch) => {
      branch.data.forEach((item: any) => {
        const data = pieData.find((pd) => pd.type === item.super_category);
        if (!data) {
          pieData.push({
            type: item.super_category,
            // value: Number.parseFloat(
            //   item.predicion["total"].revenue.toFixed(2)
            // ),
            value: Math.round(item.predicion["total"].revenue),
          });
        } else {
          data.value += Math.round(item.predicion["total"].revenue);
        }
      });
    });

    return pieData;
  }

  @action
  setTableData = (data: any[]) => {
    this.tableData = data;
  };

  @action
  setInsightData = (data: any[]) => {
    this.insightData = data;
  };

  @action
  setFileUploaded = (status: TrainingStatus) => {
    this.FileUploadStatus = status;
  };

  @action
  setPipelineInit = (status: TrainingStatus) => {
    this.PipelineInitiatedStatus = status;
  };

  @action
  setTrainingCompleted = (status: TrainingStatus) => {
    this.TrainingCompletedStatus = status;
  };

  @action
  setModelReady = (status: TrainingStatus) => {
    this.ModelReadyStatus = status;
  };

  @action
  setLinePlot = (linePlot: Line) => {
    this.linePlot = linePlot;
  };

  @action
  setPiePlotQuantity = (piePlot: Pie) => {
    this.piePlotQuantity = piePlot;
  };

  @action
  setPiePlotRevenue = (piePlot: Pie) => {
    this.piePlotRevenue = piePlot;
  };

  @action
  setCategories = (value: string[]) => {
    this.categories = value;
  };

  @action
  setStoreCriteria = (value: number) => {
    this.criteria = value;
  };

  @action
  setDateInput = (value: Moment[]) => {
    this.dateInput = value;
  };

  @action
  setPredictionOutput = (value: any) => {
    this.predictionOutput = value;
  };

  @action
  setTableLoading = (value: boolean) => {
    this.tableLoading = value;
  };

  @action
  setShowResult = (value: boolean) => {
    this.showResult = value;
  };

  @action
  toggleShowForm = (value: boolean) => {
    this.showForm = value;
  };

  @action
  setTreeData = (value: any[]) => {
    this.treeData = value;
  };

  @action
  setBranchList = (value: { key: number; name: string }[]) => {
    this.branchList = value;
  };

  @action
  setStarted = (status: DashboardStatus) => {
    this.StartedStatus = status;
  };

  @action
  setPipelineInitiated = (status: DashboardStatus) => {
    this.PipelineInitiated = status;
  };

  @action
  setTrainingStarted = (status: DashboardStatus) => {
    this.TrainingStarted = status;
  };

  @action
  setTrainingComplete = (status: DashboardStatus) => {
    this.TrainingComplete = status;
  };

  @action
  setModelsDeployed = (status: DashboardStatus) => {
    this.ModelsDeployed = status;
  };

  @action
  setreplaceOptions = (replaceOpti: []) => {
    this.replaceOptions = replaceOpti;
  };

  @action
  settimeStarted = (timstamp: any) => {
    this.timeStarted = timstamp;
  };

  @action
  setLastUploadDetail = (lastUplo: any) => {
    this.LastUploadDetail = lastUplo;
  };

  @action
  setreplaceOption = (repl: number) => {
    this.replaceOption = repl;
  };

  @action
  setnextDateparameter = (nextd: any) => {
    this.nextdateparamter = nextd;
  };

  @action
  settimePipelineInitiated = (times: any) => {
    this.timePipelineInitiated = times;
  };

  @action
  settimeTrainingStarted = (times: any) => {
    this.timeTrainingStarted = times;
  };

  @action
  settimeTrainingComplete = (times: any) => {
    this.timeTrainingComplete = times;
  };

  @action
  settimeModelsDeployed = (times: any) => {
    this.timeModelsDeployed = times;
  };

  @action
  setLasttimestamp = (times: any) => {
    this.Lasttimestamp = times;
  };

  @action
  setLastEntryDate = (lastdate: any) => {
    this.LastEntryDate = lastdate;
  };

  @action
  setmodelVersion = (version: any) => {
    this.modelVersion = version;
  };
}

export default createContext<PredictionStore>(new PredictionStore());
