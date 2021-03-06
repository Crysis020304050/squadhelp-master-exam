const env = process.env.NODE_ENV || 'development';
const serverIP = 'localhost';
const serverPort = env === 'production' ? 3000 : 9632;
export default {
  CUSTOMER: 'customer',
  CREATOR: 'creator',
  MODERATOR: 'moderator',
  MODERATOR_ACCEPTED_PAGES: ['/account', '/dashboard', '/contest/:id'],
  MODERATION_STATUS_MODERATION: 'MODERATION',
  MODERATION_STATUS_RESOLVED: 'RESOLVED',
  MODERATION_STATUS_REJECTED: 'REJECTED',
  MODERATION_CONTESTS_SPACE: 'MODERATION_CONTESTS_SPACE',
  MODERATION_OFFERS_SPACE: 'MODERATION_OFFERS_SPACE',
  CONTEST_STATUS_ACTIVE: 'active',
  CONTEST_STATUS_FINISHED: 'finished',
  CONTEST_STATUS_PENDING: 'pending',
  INCOME_TRANSACTION: 'INCOME',
  CONSUMPTION_TRANSACTION: 'CONSUMPTION',
  NAME_CONTEST: 'name',
  LOGO_CONTEST: 'logo',
  TAGLINE_CONTEST: 'tagline',
  OFFER_STATUS_REJECTED: 'rejected',
  OFFER_STATUS_WON: 'won',
  OFFER_STATUS_PENDING: 'pending',
  STATIC_IMAGES_PATH: '/staticImages/',
  ANONYM_IMAGE_PATH: '/staticImages/anonym.png',
  BASE_URL: `http://${ serverIP }:${ serverPort }/`,
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  publicURL: env === 'production'
    ? `http://${ serverIP }:80/images/`
    : `http://${ serverIP }:${ serverPort }/public/images/`,
  NORMAL_PREVIEW_CHAT_MODE: 'NORMAL_PREVIEW_CHAT_MODE',
  FAVORITE_PREVIEW_CHAT_MODE: 'FAVORITE_PREVIEW_CHAT_MODE',
  BLOCKED_PREVIEW_CHAT_MODE: 'BLOCKED_PREVIEW_CHAT_MODE',
  CATALOG_PREVIEW_CHAT_MODE: 'CATALOG_PREVIEW_CHAT_MODE',
  ADD_CHAT_TO_OLD_CATALOG: 'ADD_CHAT_TO_OLD_CATALOG',
  CREATE_NEW_CATALOG_AND_ADD_CHAT: 'CREATE_NEW_CATALOG_AND_ADD_CHAT',
  USER_INFO_MODE: 'USER_INFO_MODE',
  CASHOUT_MODE: 'CASHOUT_MODE',
  ONE_CONTEST_PRICE: '50.00',
  TWO_CONTESTS_PRICE: '90.00',
  THREE_CONTESTS_PRICE: '120.00',
  SOCKET_CONNECTION: 'connect',
  NOTIFICATION_CHANGE_MARK: 'changeMark',
  NOTIFICATION_CHANGE_OFFER_STATUS: 'changeOfferStatus',
  NOTIFICATION_ENTRY_CREATED: 'onEntryCreated',
  SOCKET_SUBSCRIBE: 'subscribe',
  SOCKET_UNSUBSCRIBE: 'unsubscribe',
  NEW_MESSAGE: 'newMessage',
  CHANGE_BLOCK_STATUS: 'changeBlockStatus',
  SUBSCRIBE_CHAT: 'subscribeChat',
  UNSUBSCRIBE_CHAT: 'unsubscribeChat',
  HEADER_ANIMATION_TEXT: [
    'a Company',
    'a Brand',
    'a Website',
    'a Service',
    'a Book',
    'a Business',
    'an App',
    'a Product',
    'a Startup',
  ],
  FooterItems: [
    {
      title: 'SQUADHELP',
      items: [
        'About',
        'Contact',
        'How It Works?',
        'Testimonials',
        'Our Work',
      ],
    },
    {
      title: 'RESOURCES',
      items: [
        'How It Works',
        'Become a Creative',
        'Business Name Generator',
        'Discussion Forum',
        'Blog',
        'Download eBook',
        'Pricing',
        'Help & FAQs',
      ],
    },
    {
      title: 'OUR SERVICES',
      items: [
        'Naming',
        'Logo Design',
        'Taglines',
        'Premium Names For Sale',
        'Creative Owned Names For Sale',
        'Audience Testing',
        'Trademark Research & Filling',
        'Managed Agency Service',
      ],
    },
    {
      title: 'LEGAL',
      items: [
        'Terms of Service',
        'Privacy Policy',
        'Cookie Policy',
      ],
    },
  ],
};