import { Injectable } from '@nestjs/common';
import { CommonCrudService } from '../common/commonCrud.service';
import { OrderEntity } from './entities/order.entity';
import { ConfigService } from '@nestjs/config';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersAddress, YandexGeocodeFeaturedItem } from '../interfaces';
import fetch from 'node-fetch';
import { AddressEntity } from './entities/address.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class OrderService extends CommonCrudService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super(orderRepository);
  }

  async create(order: DeepPartial<OrderEntity>) {
    order.address = await this.findOrCreateAddress({
      formatted: order.address.formatted,
      coordinates: order.address.coordinates,
    });

    if (!order.address.users) {
      order.address.users = [order.user];
    } else if (!order.address.users.includes(order.user as UserEntity)) {
      order.address.users.push(order.user as UserEntity);
    }

    order.date = Date.now();

    return super.create(order);
  }

  private async findOrCreateAddress(inputAddress: OrdersAddress) {
    let address = await this.addressRepository.findOne(inputAddress);

    if (!address) {
      address = await this.addressRepository.save(inputAddress);
    }

    return address;
  }

  // find address with Yandex Geocode and make order's address format
  async makeFormattedAddresses(address: string) {
    try {
      const apiKey = <string>process.env.YANDEX_KEY;
      const rawAddress = encodeURIComponent(address);
      const leftBottom = this.configService.get<string>(
        'yandex.boundedBy.leftBottom',
      );
      const rightTop = this.configService.get<string>(
        'yandex.boundedBy.rightTop',
      );

      const url = `https://geocode-maps.yandex.ru/1.x?apikey=${apiKey}&geocode=${rawAddress}&format=json&rspn=1&bbox=${leftBottom}~${rightTop}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.response.GeoObjectCollection.featureMember.reduce(
        (total: OrdersAddress[], current: YandexGeocodeFeaturedItem) => {
          if (
            (current.GeoObject.metaDataProperty.GeocoderMetaData.precision ===
              'exact' ||
              current.GeoObject.metaDataProperty.GeocoderMetaData.precision ===
                'number') &&
            (current.GeoObject.metaDataProperty.GeocoderMetaData.kind ===
              'house' ||
              current.GeoObject.metaDataProperty.GeocoderMetaData.kind ===
                'entrance')
          ) {
            total.push({
              coordinates: current.GeoObject.Point.pos,
              formatted:
                current.GeoObject.metaDataProperty.GeocoderMetaData.text,
            });
          }
          return total;
        },
        [],
      );
    } catch (error) {
      return error;
    }
  }
}
