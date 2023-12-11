# Log text to Pangea Secure Audit Log

Use this action to log text to the Pangea Secure Audit log service.
To use this action, a Pangea account is required.

To get a Pangea account [Sign up for free](https://l.pangea.cloud/GitHubActionsAuditRepo)

## How it works

Pangea is a collection of security services, all API-based, that can quickly and easily be added to any cloud application, embedded in the runtime code. 
Pangea provides app builders with a wide selection of security services to enable easily embedding security into their applications. 
Similar in nature to AWS for Compute APIs, Twilio for Communications APIs, or Stripe for Billing APIs, now there is Pangea for Security APIs.

## Set up Pangea

To configure Pangea:

1. Configure Pangea Secure Audit Log following [the configuration guide](https://l.pangea.cloud/GitHubActionsAuditRepo-configure).
2. When you create your token in the guide, make sure it has access to Secure Audit Log
3. Save your Pangea token and Pangea domain as secrets in your github repo /settings/secrets/actions

## Inputs

There are three required input parameters:
1. The text to pass to the message field of the Pangea Secure Audit Log entry
2. The Pangea token that has access to the Pangea Secure Audit Log service
3. The Pangea domain for your pangea Secure Audit Log service

```yml
with:
  text: "New pull request was opened for ${{github.repository}}"
  token: ${{secrets.PANGEA_TOKEN}}
  domain: ${{secrets.PANGEA_DOMAIN}}
```

## Usage

Minimal example

```yml
name: "Log Pull Request"
on:
  pull_request:
    types: [opened]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: pangeacyber/pangea-github-action-audit@1.0.1
      with:
        text: "New pull request was opened for ${{github.repository}}"
        token: ${{secrets.PANGEA_TOKEN}}
        domain: ${{secrets.PANGEA_DOMAIN}}
```

## License

[MIT](LICENSE)
