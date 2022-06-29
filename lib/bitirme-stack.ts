import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
  aws_s3,
  
 } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class BitirmeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Resource Pyhsical ID
    const buck = new aws_s3.Bucket(this, 'TuzluS3', {
    bucketName: 'vay',
    removalPolicy: RemovalPolicy.DESTROY
    });
    new CfnOutput(this, 'BitirmeS3Arn',{
    value: buck.bucketArn,
    exportName: 'BitirmeS3Arn'

    });
  }
}
