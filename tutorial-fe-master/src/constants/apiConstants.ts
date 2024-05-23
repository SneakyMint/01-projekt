export enum apiRoutes {
  LOGIN = '/auth/login',
  SIGNUP = '/auth/register',
  SIGNOUT = '/auth/signout',
  REFRESH_TOKENS = '/auth/refresh',
  FETCH_USER = '/auth/me',
  FETCH_USERS = '/users',
  USERS_PREFIX = '/users',
  UPLOAD_AVATAR_IMAGE = '/users/upload',
  UPLOAD_PRODUCT_IMAGE = '/products/upload',
  PRODUCTS_PREFIX = '/products',
  ROLES_PREFIX = '/roles',
  ORDERS_PREFIX = '/orders',
  PERMISSIONS_PREFIX = '/permissions',

  AUCTIONS_PREFIX = '/auctions',
  UPLOAD_AUCTION_IMAGE_PREFIX = '/auctions/upload',
  BIDS_PREFIX = '/bids',

  FETCH_ME = '/auth/me',
  POST_AUCTION = '/me/auction',
}
