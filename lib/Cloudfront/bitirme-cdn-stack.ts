import { CfnOutput, RemovalPolicy, Stack, StackProps, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
    aws_cloudfront,
    aws_s3
} from 'aws-cdk-lib';


export class BitirmeCDNStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = aws_s3.Bucket.fromBucketAttributes(this, 'BitirmeCDNStack', {
            bucketArn: 'arn:aws:s3:::717917102233-eu-central-1-bitirme-cdn-bucket',
            bucketName: '717917102233-eu-central-1-bitirme-cdn-bucket',
            region: 'eu-central-1'
        });

        const distiribution = new aws_cloudfront.CloudFrontWebDistribution(this, 'BitirmeCDN', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: bucket,
                        originAccessIdentity: new aws_cloudfront.OriginAccessIdentity(this, 'OriginACcessIdentity', {
                            comment: 'cloudfront distribution acccess for bucket'
                        })
                    },
                    behaviors: [{ isDefaultBehavior: true }]
                },
            ],
            priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
            comment: 'CDN DIST'
        });

    }
} 
