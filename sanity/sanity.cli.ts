import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "qq73zwqn",
    dataset: "production",
  },
  deployment: {
    appId: "qrrna90n0y88aeq9b70jlysk",
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
});
