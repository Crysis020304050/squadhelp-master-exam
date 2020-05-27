create table "Conversation"
(
    id        serial primary key      not null,
    createdAt timestamp default now() not null
);

create table "Participants"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) on DELETE cascade on UPDATE cascade not null,
    createdAt timestamp default now()                                             not null
);

create table "ParticipantsToConversation"
(
    conversationId integer                 not null,
    participantsId integer                 not null,
    primary key (conversationId, participantsId),
    foreign key (conversationId) references "Conversation" (id),
    foreign key (participantsId) references "Participants" (id),
    createdAt      timestamp default now() not null
);

create table "Catalog"
(
    id        serial primary key                                                  not null,
    name      varchar(64)                                                         not null,
    userId    integer references "Users" (id) on DELETE cascade on UPDATE cascade not null,
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
    conversationId integer references "Conversation" (id) on DELETE cascade on UPDATE cascade not null,
    userId         integer references "Users" (id) on delete cascade on UPDATE cascade        not null,
    body           varchar(256)                                                               not null,
    createdAt      timestamp default now()                                                    not null
);

create table "BlackList"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) on DELETE cascade on UPDATE cascade not null,
    unique (id, userId),
    createdAt timestamp default now()                                             not null
);

create table "BlackListUsers"
(
    id          serial primary key                                                      not null,
    blackListId integer references "BlackList" (id) on delete cascade on UPDATE cascade not null,
    userId      integer references "Users" (id) on DELETE cascade on UPDATE cascade     not null,
    createdAt   timestamp default now()                                                 not null
);

create table "FavoriteList"
(
    id        serial primary key                                                  not null,
    userId    integer references "Users" (id) on DELETE cascade on UPDATE cascade not null,
    unique (id, userId),
    createdAt timestamp default now()                                             not null
);

create table "FavoriteListUsers"
(
    id             serial primary key                                                         not null,
    favoriteListId integer references "FavoriteList" (id) on delete cascade on UPDATE cascade not null,
    userId         integer references "Users" (id) on DELETE cascade on UPDATE cascade        not null,
    createdAt      timestamp default now()                                                    not null
);
