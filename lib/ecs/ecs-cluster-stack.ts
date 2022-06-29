import { RemovalPolicy, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ecs,
  aws_ec2,
} from 'aws-cdk-lib';
import { getConfig } from '../config';

export class BitirmeECSClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: conf.vpcId,
      availabilityZones: conf.availabilityZones,
      publicSubnetIds: conf.publicSubnetIds,
    });

    const cluster = new aws_ecs.Cluster(this, 'BitirmeCloudECSCluster', {
      clusterName: 'bitirme-cloud-cluster',
      vpc,
    });

    const clusterSg = new aws_ec2.SecurityGroup(this, 'BitirmeCloudECSClusterSecurityGroup', {
      vpc,
      allowAllOutbound: true,
      securityGroupName: 'Bitirme-cloud-ecs-cluster-sg'
    });

    clusterSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(80), 'allow access from anywhere to http port');
    clusterSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(443), 'allow access from anywhere to https port');

    cluster.connections.addSecurityGroup();

    new CfnOutput(this, 'BitirmeCloudECSClusterARN', {
      exportName: 'BitirmeCloudECSClusterARN',
      value: cluster.clusterArn
    });

    new CfnOutput(this, 'BitirmeCloudECSClusterName', {
      exportName: 'BitirmeCloudECSClusterName',
      value: cluster.clusterName
    });

    new CfnOutput(this, 'BitirmeCloudECSClusterSgId', {
      exportName: 'BitirmeCloudECSClusterSgId',
      value: clusterSg.securityGroupId
    });

  }
}
