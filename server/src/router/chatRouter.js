const chatController = require("../controllers/chatController");
const validators = require("../middlewares/validators");

const chatRouter = require('express')();

chatRouter.post(
    '/newMessage',
    validators.validateAddingMessageToConversation,
    chatController.addMessage,
);

chatRouter.post(
    '/getConversation',
    chatController.getConversation,
);

chatRouter.post(
  '/getPreview',
    chatController.getPreview,
);

chatRouter.post(
    '/changeBlockedUserStatus',
    chatController.changeBlockedUserStatus,
);

chatRouter.post(
    '/changeFavoriteUserStatus',
    chatController.changeFavoriteUserStatus,
);

chatRouter.post(
    '/createCatalog',
    validators.validateSettingCatalogName,
    chatController.createCatalog,
);

chatRouter.post(
    '/updateNameCatalog',
    validators.validateSettingCatalogName,
    chatController.updateCatalogName,
);

chatRouter.post(
    '/addNewConversationToCatalog',
    chatController.addNewConversationToCatalog,
);

chatRouter.post(
    '/removeConversationFromCatalog',
    chatController.removeConversationFromCatalog,
);

chatRouter.post(
    '/deleteCatalog',
    chatController.deleteCatalog,
);

chatRouter.post(
    '/getCatalogs',
    chatController.getCatalogs,
);

module.exports = chatRouter;