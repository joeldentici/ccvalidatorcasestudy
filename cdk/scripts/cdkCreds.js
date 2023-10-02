const childProcess = require("node:child_process");
const config = require("./creds.json");

console.log(
  childProcess
    .execSync(`cdk ${process.argv.slice(2).join(" ")}`, {
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: config.accessKeyId,
        AWS_SECRET_ACCESS_KEY: config.secretAccessKey,
        AWS_DEFAULT_REGION: config.region,
      },
    })
    .toString()
);
