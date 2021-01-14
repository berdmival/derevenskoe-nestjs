export interface YandexAddressDetails {
    Country: {
        AddressLine: string;
        CountryNameCode: string;
        CountryName: string;
        AdministrativeArea: {
            AdministrativeAreaName: string;
            Locality: {
                LocalityName: string;
                Thoroughfare: {
                    ThoroughfareName: string;
                    Premise: {
                        PremiseNumber: string;
                    };
                };
            };
        };
    };
}

export interface YandexAddressComponents {
    kind: string;
    name: string;
}

export interface YandexAddress {
    country_code: string;
    formatted: string;
    Components: YandexAddressComponents[];
}

export interface GeocoderMetaData {
    precision: string;
    text: string;
    kind: string;
    Address: YandexAddress;
    AddressDetails: YandexAddressDetails;
}

export interface GeoObject {
    metaDataProperty: {
        GeocoderMetaData: GeocoderMetaData;
    };
    name: string;
    description: string;
    boundedBy: {
        Envelope: {
            lowerCorner: string;
            upperCorner: string;
        };
    };
    Point: { pos: string };
}

export interface YandexGeocodeFeaturedItem {
    GeoObject: GeoObject;
}
