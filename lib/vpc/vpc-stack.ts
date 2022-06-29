import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ec2,
} from 'aws-cdk-lib';

export class BitirmeVpcStack extends Stack {

  get availabilityZones(): string[] {
    return ['eu-central-1a', 'eu-central-1b']
  }

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new aws_ec2.Vpc(this, 'BitirmeVpc', {
      vpcName: 'bitirme-cloud-vpc',
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'publicSubnet',
          subnetType: aws_ec2.SubnetType.PUBLIC,
          cidrMask: 20,
        },
        {
          name: 'privateSubnet',
          subnetType: aws_ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 20,
        }
      ]
    });

  }
}
