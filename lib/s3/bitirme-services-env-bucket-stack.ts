import { CfnOutput, cfnTagToCloudFormation, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
  aws_ecr,
  aws_s3
 } from 'aws-cdk-lib';

 import { getConfig } from '../config';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class BitirmeServicesEnvBucketStack extends Stack {
   
    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const config = getConfig(scope); 
    const env_bucket = new aws_s3.Bucket(this, 'BitirmeServicesEnvBucket', {
    bucketName: `${config.account}-${config.region}-bitirme-services-env-bucket`,
    blockPublicAccess: {
    blockPublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
    ignorePublicAcls: true, 

    }
  });
  new CfnOutput(this, 'BitirmeServicesEnvBucketARN', {
    value: env_bucket.bucketArn,
    exportName: 'BitirmeServicesEnvBucketARN',
    


  })
  new CfnOutput(this, 'BitirmeServicesEnvBucketName', {
    value: env_bucket.bucketName,
    exportName: 'BitirmeServicesEnvBucketName',
    


  })


  }
}
