#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BitirmeVpcStack } from '../lib/vpc/';
import { BitirmeCDNStack } from "../lib/Cloudfront";
import { getConfig } from '../lib/config';

const app = new cdk.App();
const conf = getConfig(app);
const env =  {
  account: conf.account,
  region: conf.region,
 }


new BitirmeVpcStack(app, 'BitirmeVpcStack',{env});
new BitirmeCDNStack(app, 'BitirmeCDNStack', { env: {account: env.account, region: 'us-east-1' } });
