
import cron from "node-cron";
import { exec } from "child_process";

console.log("VoC Scheduler started");

cron.schedule("0 2 * * 1", () => {

  console.log("Running weekly VoC pipeline...");

  exec("node agent/agent.js", (error, stdout, stderr) => {

    if (error) {
      console.error("Error running pipeline:", error);
      return;
    }
    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

   console.log("Weekly pipeline finished");
  });
});