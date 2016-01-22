<?php

class TagsCollection{

	public static function filter(PDO $db, array $filters = null, array $fields = null, array $order_by = null){

		$q_get_tags = App::$QUERY_FACTORY->newSelect();
		$statements = array();

		$q_get_tags->distinct()
			->cols(Fields::mergeFields(Tag::$ADDITIONAL_COLS, $fields, Tag::$DEFAULT_COLS))
			->from('view_tags')
			->orderBy($order_by)
			->limit(App::$__LENGTH)
			->offset(App::$__OFFSET);

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_tags->where('id = :id');
					$statements[':id'] = $value;
					break;
				}
				case 'name': {
					$q_get_tags->where('LOWER(name) LIKE LOWER(:name)');
					$statements[':name'] = $value . '%';
					break;
				}
				case 'event_id': {
					$q_get_tags->where('events.id = :event_id)');
					$statements[':event_id'] = $value;
					break;
				}
			}
		}
		$p_get_tags = $db->prepare($q_get_tags->getStatement());
		$p_get_tags->execute($statements);
		return new Result(true, '', array(
			'tags' => $p_get_tags->fetchAll(),
		));
	}
}