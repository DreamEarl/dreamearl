import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "qq73zwqn",
    dataset: "production",
  },
  deployment: {
    appId: "qrrna90n0y88aeq9b70jlysk",
    autoUpdates: true,
  },
});
