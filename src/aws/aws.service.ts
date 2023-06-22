import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { AppConfig } from '../common/app-config';

@Injectable()
export class AwsService {
  private awsS3: S3;

  constructor() {
    this.awsS3 = new S3({
      accessKeyId: AppConfig.aws.accessKeyId,
      secretAccessKey: AppConfig.aws.secretAccessKey,
      region: AppConfig.aws.region,
    });
  }

  async uploadFileToS3(
    file: Express.Multer.File,
    folder: string,
  ): Promise<any> {
    const uploadParams = {
      Bucket: AppConfig.aws.bucketName,
      Key: `${folder}/${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
    };

    const uploadResult = await this.awsS3.upload(uploadParams).promise();

    return uploadResult;
  }

  async deleteFileFromS3(key: string): Promise<void> {
    const deleteParams = {
      Bucket: AppConfig.aws.bucketName,
      Key: key,
    };

    await this.awsS3.deleteObject(deleteParams).promise();
  }
}
