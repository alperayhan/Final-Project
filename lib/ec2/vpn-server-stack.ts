import { RemovalPolicy, Stack, StackProps, CfnOutput, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
  aws_ec2
 } from 'aws-cdk-lib';
import { PrincipalBase } from 'aws-cdk-lib/aws-iam';
import { InstanceSize, Vpc, VpcEndpoint } from 'aws-cdk-lib/aws-ec2';

export class BitirmeVPNServer extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpcId = scope.node.tryGetContext('vpcId');
    const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'BitirmeVPC', {
        availabilityZones: ['eu-central-1a', 'eu-central-1b'],
        vpcId: vpcId,
        publicSubnetIds : ['subnet-0c6588e8b9527962e','subnet-08248a0d23a139f55'],
      
   })

   const machineSg = new aws_ec2.SecurityGroup(this, 'BitirmeVPNServerSG', {
    vpc,
    allowAllOutbound: true,
    securityGroupName: 'bitirme-vpn-server-sg'

   })
   
   machineSg.addEgressRule(aws_ec2.Peer.anyIpv4(),aws_ec2.Port.tcp(22),'allow access to ssh port anywhere')

    new aws_ec2.Instance(this, 'BitirmeVPNServer', {
        instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T3, InstanceSize.MICRO),
        vpc,
        machineImage: aws_ec2.MachineImage.latestAmazonLinux({}),
        keyName: 'Patika2',
        securityGroup: machineSg


    })

  }
}
