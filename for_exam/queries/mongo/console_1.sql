db.messages.aggregate(
    [
        {$match: {body: 'паровоз'}},
        {$count: 'train_messages'}
    ]);