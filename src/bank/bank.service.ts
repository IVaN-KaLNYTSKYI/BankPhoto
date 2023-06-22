import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { CreateBankRequestDto } from './dto/create-bank-request.dto';
import { AwsService } from '../aws/aws.service';
import { Users } from '../users/users.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly awsService: AwsService,
  ) {}

  async createPhoto(
    dto: CreateBankRequestDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<Bank> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const url = await this.awsService.uploadFileToS3(file, 'user');
    console.log(url, 'AWS-S3');

    const photoCreate = this.bankRepository.create({
      name: dto.name,
      url_aws:url.Location,
      key_aws:url.Key,
      user
    });

    const savePhoto = this.bankRepository.save(photoCreate);

    return savePhoto;
  }

  async deletePhoto(dto:any,userId:number):Promise<{message:string}>{
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const photo = await this.bankRepository.findOne( {where: { id: dto.photoId }});

    if (!photo) {
      throw new BadRequestException('Photo does not exist');
    }

    await this.awsService.deleteFileFromS3(photo.key_aws);

    return {
      message:"Delete photo successful"
    }
  }
}
