import { CfnOutput, cfnTagToCloudFormation, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
  aws_ecr
 } from 'aws-cdk-lib';

 import { getConfig } from '../config';

 
export class BitirmeBackendECRClusterStack extends Stack {
   
  ecrRepo: aws_ecr.Repository;  
    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    
    this.ecrRepo = new aws_ecr.Repository(this, 'BitirmeBackendECRRepository', {
    repositoryName: 'bitirme-backend',
    removalPolicy: RemovalPolicy.RETAIN,
     });

    new CfnOutput(this,'BitirmeBackendECRRepositoryARN', {
        exportName:'BitirmeBackendECRRepositoryARN',
        value: this.ecrRepo.repositoryArn,

    } );
  
  }
}
