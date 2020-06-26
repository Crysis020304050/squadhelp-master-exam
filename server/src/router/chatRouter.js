const chatController = require("../controllers/chatController");
const chatControllerPostgres = require("../controllers/chatControllerPostgres");

const chatRouter = require('express')();

chatRouter.post(
    '/newMessage',
    chatController.addMessage,
);

chatRouter.post(
    '/newMessagePostgres',
    chatControllerPostgres.addMessage,
);

chatRouter.post(
    '/getChat',
    chatController.getChat,
);

chatRouter.post(
    '/getChatPostgres',
    chatControllerPostgres.getChat,
);

chatRouter.post(
    '/getPreview',
    chatController.getPreview,
);

chatRouter.post(
  '/getPreviewPostgres',
    chatControllerPostgres.getPreview,
);

chatRouter.post(
    '/blackList',
    chatController.blackList,
);

chatRouter.post(
    '/changeBlockedUserStatusPostgres',
    chatControllerPostgres.changeBlockedUserStatus,
);

chatRouter.post(
    '/favorite',
    chatController.favoriteChat,
);

chatRouter.post(
    '/changeFavoriteUserStatusPostgres',
    chatControllerPostgres.changeFavoriteUserStatus,
);

chatRouter.post(
    '/createCatalog',
    chatController.createCatalog,
);

chatRouter.post(
    '/createCatalogPostgres',
    chatControllerPostgres.createCatalog,
);

chatRouter.post(
    '/updateNameCatalog',
    chatController.updateNameCatalog,
);

chatRouter.post(
    '/addNewChatToCatalog',
    chatController.addNewChatToCatalog,
);

chatRouter.post(
    '/removeChatFromCatalog',
    chatController.removeChatFromCatalog,
);

chatRouter.post(
    '/deleteCatalog',
    chatController.deleteCatalog,
);

chatRouter.post(
    '/deleteCatalogPostgres',
    chatControllerPostgres.deleteCatalog,
);

chatRouter.post(
    '/getCatalogs',
    chatController.getCatalogs,
);

chatRouter.post(
    '/getCatalogsPostgres',
    chatControllerPostgres.getCatalogs,
);

module.exports = chatRouter;