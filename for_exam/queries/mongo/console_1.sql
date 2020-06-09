db.messages.aggregate(
    [
        {$match: {body: /.?[П|п]аровоз.?/}},
        {$count: 'train_messages'}
    ]);