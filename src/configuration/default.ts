export default () => ({
  yandex: {
    url: {
      geocode:
        'https://geocode-maps.yandex.ru/1.x?apikey=${apiKey}&geocode=${rawAddress}&format=json&rspn=1&bbox=${leftBottom}~${rightTop}',
      api: 'https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU',
    },
    boundedBy: {
      leftBottom: '27.242767,53.747426',
      rightTop: '27.799328,54.039481',
    },
  },
  security: {
    cookie: {
      path: '/graphql',
      refresh: 'rt',
      userUID: 'uuid',
    },
    lifetime: {
      access: 900,
      refresh: 2592000,
    },
    roles: {
      user: 'USER',
      admin: 'ADMIN',
    },
  },
  orders: {
    statuses: {
      new: 'Новый',
      confirmed: 'Подтверждён',
      complete: 'Собран',
      recalculated: 'Пересчитан',
      shipping: 'Доставка',
      success: 'Успешно',
      canceled: 'Отменён',
    },
  },
  paging: {
    size: 10,
  },
  files: {
    upload: {
      max: { size: 5242880, count: 5 },
      type: {
        main: 'upload',
        product: 'product',
        category: 'category',
        user: 'user',
      },
      image: {
        size: {
          small: {
            width: 100,
            height: 100,
            upsize: false,
            quality: 95,
            types: ['jpeg', 'tiff', 'png', 'jpg', 'gif', 'tif', 'bmp'],
            output: 'jpeg',
          },
          large: {
            width: 1000,
            height: 1000,
            upsize: false,
            quality: 95,
            types: ['jpeg', 'tiff', 'png', 'jpg', 'gif', 'tif', 'bmp'],
            output: 'jpeg',
          },
          medium: {
            width: 500,
            height: 500,
            upsize: false,
            quality: 95,
            types: ['jpeg', 'tiff', 'png', 'jpg', 'gif', 'tif', 'bmp'],
            output: 'jpeg',
          },
        },
      },
    },
  },
});
