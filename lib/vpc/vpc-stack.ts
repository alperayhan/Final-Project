import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
  aws_ec2
 } from 'aws-cdk-lib';
import { PrincipalBase } from 'aws-cdk-lib/aws-iam';

export class BitirmeVpcStack extends Stack {
    get availabilityZones(): string[] {
        return ['eu-central-1a']
    }  

    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

   new aws_ec2.Vpc(this, 'BitirmeVPC',{
    vpcName: 'bitirme-vpc',
    cidr: '10.0.0.0/16',
    subnetConfiguration: [
    {
        name: 'publicSubnet',
        subnetType: aws_ec2.SubnetType.PUBLIC,
        
    },
    {
        name:'PrivateSubnet',
        subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
        
    }
    ]


   });
  }
}
