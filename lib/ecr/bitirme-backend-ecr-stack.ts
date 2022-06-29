import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ecr
} from 'aws-cdk-lib';

export class BitirmeBackendECRStack extends Stack {

  ecrRepo: aws_ecr.Repository;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ecrRepo = new aws_ecr.Repository(this, 'BitirmeBackendECRRepository', {
      repositoryName: 'bitirme-backend',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, 'BitirmeBackendECRRepositoryARN', {
      exportName: 'BitirmeBackendECRRepositoryARN',
      value: this.ecrRepo.repositoryArn,
    });
    
  }
}
