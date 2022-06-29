import { CfnOutput, cfnTagToCloudFormation, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
  aws_ecr,
  aws_s3
 } from 'aws-cdk-lib';

 import { getConfig } from '../config';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class BitirmeCDNBucket extends Stack {
   
    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const config = getConfig(scope); 
    const bucket = new aws_s3.Bucket(this, 'BitirmeCDNBucket', {
    bucketName: `${config.account}-${config.region}-bitirme-cdn-bucket`,
    blockPublicAccess: {
    blockPublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
    ignorePublicAcls: true, 

    }
  });
  new CfnOutput(this, 'BitirmeCDNBucketARN', {
    value: bucket.bucketArn,
    exportName: 'BitirmeCDNBucket',
    


  })
  new CfnOutput(this, 'BitirmeCDNBucketName', {
    value: bucket.bucketName,
    exportName: 'BitirmeCDNBucketName',
    


  })


  }
}
