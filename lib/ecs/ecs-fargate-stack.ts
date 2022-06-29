import { RemovalPolicy, Stack, StackProps, CfnOutput, Fn, aws_cloud9 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_ec2,
  aws_s3,
  aws_ecs,
  aws_iam,
  aws_elasticloadbalancingv2,
  aws_ssm,
  aws_certificatemanager,
  aws_route53,
  aws_route53_targets,
  aws_cloudwatch
} from 'aws-cdk-lib';
import { CommonStackProps } from '../common-stack-props';
import { getConfig } from '../config';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

export class ECSFargateStack extends Stack {
  constructor(scope: Construct, id: string, props?: CommonStackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    if (props?.ecrStack) {

      const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
        vpcId: conf.vpcId,
        availabilityZones: conf.availabilityZones,
        publicSubnetIds: conf.publicSubnetIds,
      });
      
      const clusterSg = aws_ec2.SecurityGroup.fromSecurityGroupId(this, 'BitirmeCloudECSClusterSg', Fn.importValue('BitirmeCloudECSClusterSgId'));

      const cluster = aws_ecs.Cluster.fromClusterAttributes(this, 'BitirmeCloudECSCluster', {
        clusterArn: Fn.importValue('BitirmeCloudECSClusterARN'),
        clusterName: Fn.importValue('BitirmeCloudECSClusterName'),
        vpc,
        securityGroups: [clusterSg]
      });

      const envBucket = aws_s3.Bucket.fromBucketAttributes(this, 'BitirmeServicesEnvBucket', {
        bucketArn: Fn.importValue('BitirmeServicesEnvBucketARN'),
        bucketName: Fn.importValue('BitirmeServicesEnvBucketName'),
      });

      const executionRole = new aws_iam.Role(this, 'BitirmeBackendFargateServiceIAMRole', {
        roleName: 'BitirmeBackendFargateServiceIAMRole',
        assumedBy: new aws_iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      executionRole.addToPolicy(new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        resources: [ '*' ],
        actions: [
          's3:*'
        ]
      }));

      const taskDef = new aws_ecs.FargateTaskDefinition(this, 'BitirmeBackendFargateServiceTaskDef', {
        family: 'BitirmeBackendFargateServiceTaskDef',
        cpu: 512,
        memoryLimitMiB: 1024,
        executionRole,
      });

      taskDef.addContainer('BitirmeBackendServiceContainer', {
        containerName: 'bitirme-backend-service',
        image: aws_ecs.ContainerImage.fromEcrRepository(props.ecrStack, 'latest'), 
        memoryReservationMiB: 512,
        portMappings: [
          {
            containerPort: 8080,
          }
        ],
        environment: {
            DB_PASSWORD: aws_ssm.StringParameter.fromStringParameterName(this, 'DB_PASSWORD', '/app/DB_PASSWORD').stringValue,
        }

      });

      const serviceSg = new aws_ec2.SecurityGroup(this, 'BitirmeBackendECSFargateSecurityGroup', {
        vpc,
        allowAllOutbound: true,
        securityGroupName: 'bitirme-backend-ecs-farget-sg'
      });

      const service = new aws_ecs.FargateService(this, 'BitirmeBackendFargateService', {
        serviceName: 'bitirme-backend-service',
        cluster,
        taskDefinition: taskDef,
        desiredCount: 3,
        securityGroups: [serviceSg],
        assignPublicIp: true,
        
     
      });
    
      
      const autoscale = service.autoScaleTaskCount({
        minCapacity: 1,
        maxCapacity: 8,
      });
      
     
      const albSg = new aws_ec2.SecurityGroup(this, 'ALBsg', {
        securityGroupName: 'bitirme-cloud-alb-sg',
        vpc,
        allowAllOutbound: true,
      });


      albSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(80), 'allow access from anywhere to http port');
      albSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(443), 'allow access from anywhere to https port');

      serviceSg.addIngressRule(albSg, aws_ec2.Port.tcpRange(49153, 65535), 'allow access container ports from ALB');
      
      const serviceAlb = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this, 'BitirmeBackendALB', {
        loadBalancerName: 'bitirme-cloud-alb',
        vpc,
        internetFacing: true,
        securityGroup: albSg
      }); 
      
      
      const serviceTargetGroup = new aws_elasticloadbalancingv2.ApplicationTargetGroup(this, 'ServiceTargetGroup', {
        healthCheck: {
          enabled: true,
          path: '/',
          port: '8080',
          protocol: aws_elasticloadbalancingv2.Protocol.HTTP,
          healthyHttpCodes: '200',
        },
        port: 80,
        protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
        targetGroupName: 'bitirme-backend-tg',
        targetType: aws_elasticloadbalancingv2.TargetType.IP,
        targets: [service],
        vpc,
        
      });
      

     
      serviceAlb.addListener('httpListener', {
        port: 80,
        protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
        defaultTargetGroups: [serviceTargetGroup]
       
      });
    }

  }
}
      
