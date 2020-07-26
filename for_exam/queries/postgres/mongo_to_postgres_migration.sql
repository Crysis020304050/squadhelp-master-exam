create table "Conversation"
(
    id        serial primary key,
    participant1  integer not null,
    participant2  integer not null,
    foreign key (participant1) references "Users" (id)  not null,
    foreign key (participant2) references "Users" (id)  not null,
    createdAt timestamp default now() not null
);

create table "Catalog"
(
    id        serial primary key                                                  not null,
    name      varchar(64)                                                         not null,
    userId    integer references "Users" (id)  not null,
    createdAt timestamp default now()                                             not null
);

create table "ConversationsToCatalog"
(
    catalogId      integer                 not null,
    conversationId integer                 not null,
    primary key (catalogId, conversationId),
    foreign key (catalogId) references "Catalog" (id),
    foreign key (conversationId) references "Conversation" (id),
    createdAt      timestamp default now() not null
);

create table "Message"
(
    id             serial primary key                                                         not null,
    conversationId integer references "Conversation" (id)  not null,
    userId         integer references "Users" (id)       not null,
    body           varchar(256)                                                               not null,
    createdAt      timestamp default now()                                                    not null
);

create table "BlackList"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) not null,
    blockedUserId      integer references "Users" (id)     not null,
    createdAt timestamp default now()                                             not null
);

create table "FavoriteList"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) not null,
    favoriteUserId         integer references "Users" (id)       not null,
    createdAt timestamp default now()                                             not null
);

/*create table "BlackList"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) not null,
    createdAt timestamp default now()                                             not null
);

create table "BlackListUsers"
(
    id          serial primary key                                                      not null,
    blackListId integer references "BlackList" (id)  not null,
    blockedUserId      integer references "Users" (id)     not null,
    createdAt   timestamp default now()                                                 not null
);

create table "FavoriteList"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) not null,
    createdAt timestamp default now()                                             not null
);

create table "FavoriteListUsers"
(
    id             serial primary key                                                         not null,
    favoriteListId integer references "FavoriteList" (id) not null,
    favoriteUserId         integer references "Users" (id)       not null,
    createdAt      timestamp default now()                                                    not null
);
*/