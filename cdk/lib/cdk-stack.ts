import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendBucket = new cdk.aws_s3.Bucket(
      this,
      "CCValidatorFrontendBucket",
      {
        publicReadAccess: true,
        blockPublicAccess: new cdk.aws_s3.BlockPublicAccess({
          blockPublicAcls: false,
          ignorePublicAcls: false,
          blockPublicPolicy: false,
          restrictPublicBuckets: false,
        }),
      }
    );

    const lambdaFunction = new cdk.aws_lambda.Function(
      this,
      "CCValidatorLambdaFunction",
      {
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
        code: cdk.aws_lambda.Code.fromAsset("../lambdadist"),
        handler: "handler.handler",
      }
    );

    const api = new cdk.aws_apigateway.LambdaRestApi(this, "CCValidatorAPI", {
      handler: lambdaFunction,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
      },
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, "DeployFrontendFiles", {
      sources: [
        cdk.aws_s3_deployment.Source.asset("../dist"),
        cdk.aws_s3_deployment.Source.data(
          "config.js",
          `window.config = { apiEndpoint: '${api.url.substring(
            0,
            api.url.length - 1
          )}' };`
        ),
      ],
      destinationBucket: frontendBucket,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
