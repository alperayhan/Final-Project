# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

This repo contains only source files. The files are under these directories : lib, bin
# For VPC Stack Deploy 
cdk synth --app "npx ts-node bin/bitirme.ts" BitirmeVpcStack
cdk deploy --app "npx ts-node bin/bitirme.ts" BitirmeVpcStack

#For ECS Stack Deploy
cdk synth --app "npx ts-node bin/bitirme-computing.ts" BitirmeECSClusterStack
cdk deploy --app "npx ts-node bin/bitirme-computing.ts" BitirmeECSClusterStack

#For ECR Stack Deploy
cdk synth --app "npx ts-node bin/bitirme-computing.ts" BitirmeBackendECRClusterStack
cdk deploy --app "npx ts-node bin/bitirme-computing.ts" BitirmeBackendECRClusterStack

#For CDN Stack Deploy
cdk synth --app "npx ts-node bin/bitirme.ts" BitirmeCDNStack
cdk deploy --app "npx ts-node bin/bitirme.ts" BitirmeCDNStack

#For ECS-Fargate Stack Deploy
cdk synth --app "npx ts-node bin/bitirme-computing.ts" BitirmeECSFargateStack
cdk deploy --app "npx ts-node bin/bitirme-computing.ts" BitirmeECSFargateStack

#For S3 Buckets Deploy

cdk synth --app "npx ts-node bin/bitirme-computing.ts" BitirmeServicesEnvBucketStack
cdk deploy --app "npx ts-node bin/bitirme-computing.ts" BitirmeServicesEnvBucketStack

cdk synth --app "npx ts-node bin/bitirme-computing.ts" BitirmeCDNBucket
cdk deploy --app "npx ts-node bin/bitirme-computing.ts" BitirmeCDNBucket

