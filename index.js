const core = require('@actions/core');
const pangea = require('pangea-node-sdk')

const token = core.getInput('token');
const config = new pangea.PangeaConfig({ domain: core.getInput('domain')});
const audit = new pangea.AuditService(token, config);

// most @actions toolkit packages have async methods
async function run() {
  const data = {
    message: core.getInput('text'),
  };

  try {
    core.info("Logging: %s", data.message);
    const logResponse = await audit.log(data, {verbose: true});
    core.info("Response: %s", logResponse.result);
    core.setOutput('results', logResponse.result);
  } catch (err) {
    if (err instanceof pangea.PangeaErrors.APIError) {
      core.setFailed(err.summary, err.pangeaResponse);
    } else {
      core.setFailed(err);
    }
  }
}
run();
