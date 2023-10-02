# Credit Card Validator Case Study

I implemented the credit card validator case study application using the following:

- React + MUI for the frontend/ui
- tRPC for the API

It can be ran locally or deployed to AWS using CDK

## Set Up Dependencies

```bash
yarn install
cd cdk
npm install
```

## Running Locally

It can be ran locally by running the individual UI / API:

```bash
yarn ui:dev &
yarn api:dev
```

## Deploying

### Credentials

Place credentials in a `creds.json` file under `cdk/scripts` that looks like:

```json
{
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": "us-west-2"
}
```

Update the account id in `cdk/bin/cdk.ts` to the AWS account id you are deploying to.

### Execution

First build the UI/API

```bash
yarn api:build
yarn ui:build
```

Then run the CDK deployment

```bash
cd cdk
npm run cdk "deploy --require-approval never"
```

## Public Deployment

https://cdkstack-ccvalidatorfrontendbucket0419c219-1prl8rhyl1s8e.s3.us-west-2.amazonaws.com/index.html
