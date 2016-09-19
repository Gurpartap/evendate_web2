<?php

class Tag extends AbstractEntity
{

    protected $name;
    protected $created_at;
    protected $updated_at;
    protected $events_count;

    const RANDOM_FIELD_NAME = 'random';
    const EVENTS_COUNT_FIELD_NAME = 'events_count';
    const USED_COUNT_FIELD_NAME = 'used_count';

    protected static $DEFAULT_COLS = array(
        'id',
        'name',
    );

    protected static $ADDITIONAL_COLS = array(
        'created_at',
        'updated_at',

        self::EVENTS_COUNT_FIELD_NAME => '(SELECT count(events_tags.tag_id)
            FROM events_tags
            WHERE events_tags.tag_id = view_tags.id) AS ' . self::EVENTS_COUNT_FIELD_NAME,
        self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_tags AS vt
			WHERE vt.id = view_tags.id) AS ' . self::RANDOM_FIELD_NAME,
    );


}