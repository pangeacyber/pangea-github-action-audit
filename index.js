const core = require('@actions/core');
const github = require('@actions/github');
const pangea = require('pangea-node-sdk');

const token = core.getInput('token');
const config = new pangea.PangeaConfig({ domain: core.getInput('domain')});
const audit = new pangea.AuditService(token, config);
const context = github.context;

// most @actions toolkit packages have async methods
async function run() {
  const data = {
    action: context.workflow +"/"+context.job+"/"+context.action,
    actor: context.actor,
    target: context.eventName,
    message: core.getInput('text'),
    source: "GitHub Action",
  };

  try{
    core.info('Message text to be logged: '+data.message);
    const logResponse = await audit.log(data, {verbose: true});
    core.info('Response: '+JSON.stringify(logResponse.result));
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
