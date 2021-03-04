import {Injectable} from '@nestjs/common';
import {CommonCrudService} from '../common/commonCrud.service';
import {OrderEntity} from './entities/order.entity';
import {ConfigService} from '@nestjs/config';
import {DeepPartial, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {OrdersAddress, YandexGeocodeFeaturedItem} from '../interfaces';
import fetch from 'node-fetch';
import {AddressEntity} from './entities/address.entity';
import {UserService} from '../user/user.service';
import {UserEntity} from '../user/entities/user.entity';
import {OrderStatusEntity} from "./entities/orderStatus.entity";
import {OrderProductServingEntity} from "./entities/orderProductServing.entity";
import {ProductService} from "../product/product.service";
import {OrderProductServingInput} from "./models/orderProductServing.input";
import {URL} from 'url'

@Injectable()
export class OrderService extends CommonCrudService<OrderEntity> {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,
        @InjectRepository(OrderStatusEntity)
        private readonly statusRepository: Repository<OrderStatusEntity>,
        @InjectRepository(OrderProductServingEntity)
        private readonly servingRepository: Repository<OrderProductServingEntity>,
        private readonly productService: ProductService,
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
            order.address.users = [order.user as UserEntity];
        } else if (!order.address.users.includes(order.user as UserEntity)) {
            order.address.users.push(order.user as UserEntity);
        }

        order.orderStatus = await this.findOrCreateOrderStatus(
            this.configService.get<string>('orders.statuses.new')
        )

        order.date = Date.now().toString();

        const newOrder = await super.create(order);

        return await this.findById(newOrder.id)
    }

    private async findOrCreateAddress(inputAddress: OrdersAddress) {
        let address = await this.addressRepository.findOne(inputAddress);

        if (!address) {
            address = await this.addressRepository.save(inputAddress);
        }

        return address;
    }

    private async findOrCreateOrderStatus(statusName: string) {
        let status = await this.statusRepository.findOne({name: statusName});

        if (!status) {
            status = await this.statusRepository.save({name: statusName});
        }

        return status;
    }

    // find address with Yandex Geocode and make order's address format
    async makeFormattedAddresses(address: string) {
        try {
            const mainYandexGeocoderUrl = this.configService.get<string>(
                'yandex.url.geocoder',
            );
            const apiKey = <string>process.env.YANDEX_KEY;
            const leftBottom = this.configService.get<string>(
                'yandex.boundedBy.leftBottom',
            );
            const rightTop = this.configService.get<string>(
                'yandex.boundedBy.rightTop',
            );

            const url = new URL(mainYandexGeocoderUrl);
            url.searchParams.append('apikey', apiKey);
            url.searchParams.append('geocode', address);
            url.searchParams.append('format', 'json');
            url.searchParams.append('rspn', '1'); // restrict the search to the specified area
            url.searchParams.append('bbox', `${leftBottom}~${rightTop}`); // the search area, the boundaries are set as geographical coordinates (in the sequence "longitude, latitude") of the lower-left and upper-right corners of the area.

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

    async createProductServing(serving: OrderProductServingInput) {
        const product = await this.productService.findById(serving.productId);
        return await this.servingRepository.save({count: serving.count, product})
    }
}
