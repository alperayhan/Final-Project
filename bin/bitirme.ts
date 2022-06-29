
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BitirmeStack } from '../lib/bitirme-stack';
import { BitirmeVpcStack } from '../lib/vpc';
import { BitirmeVPNServer } from '../lib/ec2';
import { getConfig } from '../lib/config';
import { BitirmeCDNCloudfront } from '../lib/cloudfront';

const app = new cdk.App();
const conf = getConfig(app);
const env = {
  account: conf.account,
  region: conf.region,
};

new BitirmeStack(app, 'BitirmeStack', { env });
new BitirmeVpcStack(app, 'BitirmeVpcStack', { env });
new BitirmeVPNServer(app, 'BitirmeVPNServer', { env });
new BitirmeCDNCloudfront(app, 'BitirmeCDNCloudfront', { env: { account: env.account, region: 'us-east-1' } });
