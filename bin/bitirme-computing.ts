#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '../lib/config';
import { BitirmeECSClusterStack } from '../lib/ecs';
import { BitirmeBackendECRStack } from '../lib/ecr';
import { ECSFargateStack } from '../lib/ecs';
import { BitirmeServicesEnvBucketStack, BitirmeCDNBucket} from '../lib/s3';

const app = new cdk.App();
const conf = getConfig(app);
const env = {
  account: conf.account,
  region: conf.region,
};

new BitirmeECSClusterStack(app, 'BitirmeECSClusterStack', { env });
const ecrStack = new BitirmeBackendECRStack(app, 'BitirmeBackendECRStack', { env });

new ECSFargateStack(app, 'BitirmeECSFargateStack', { ecrStack: ecrStack.ecrRepo });
new BitirmeServicesEnvBucketStack(app, 'BitirmeServicesEnvBucketStack', { env });
new BitirmeCDNBucket(app, 'BitirmeCDNBucket', { env });