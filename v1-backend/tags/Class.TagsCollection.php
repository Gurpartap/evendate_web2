<?php

class TagsCollection{

	public static function filter(PDO $db, array $filters = null, array $fields = null, array $order_by = null){

		$q_get_tags = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_tag = false;

		$q_get_tags->distinct()
			->cols(Fields::mergeFields(Tag::getAdditionalCols(), $fields, Tag::getDefaultCols()))
			->from('view_tags')
			->limit(App::$__LENGTH)
			->orderBy($order_by)
			->offset(App::$__OFFSET);

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_tags->where('id = :id');
					$statements[':id'] = $value;
					$is_one_tag = true;
					break;
				}
				case 'name': {
					if (isset($filters['strict']) && $filters['strict'] == true){
						$q_get_tags->where('LOWER(name) = LOWER(:name)');
						$statements[':name'] = $value;
					}else{
						$q_get_tags->where('LOWER(name) LIKE LOWER(:name)');
						$statements[':name'] = $value . '%';
					}
					break;
				}
				case 'event': {
					if ($value instanceof Event){
						$q_get_tags->where('events.id = :event_id)');
						$statements[':event_id'] = $value->getId();
						break;
					}
				}
			}
		}
		$p_get_tags = $db->prepare($q_get_tags->getStatement());
		$p_get_tags->execute($statements);
		$tags = $p_get_tags->fetchAll(PDO::FETCH_CLASS, 'Tag');
		if (count($tags) == 0 && $is_one_tag) throw new LogicException('CANT_FIND_TAG');
		$result_events = array();
		foreach($tags as $tag){
			$result_events[] = $tag->getParams($fields)->getData();
		}
		return new Result(true, '', $result_events);
	}


	private static function mb_ucfirst($str) {
		$str = mb_strtolower($str);
		$fc = mb_strtoupper(mb_substr($str, 0, 1));
		return $fc.mb_substr($str, 1);
	}

	public static function create(PDO $db, string $name) : Tag{
		$name = preg_replace('/\s+/', ' ', self::mb_ucfirst($name));
		$tags = TagsCollection::filter($db, array('strict' => true, 'name' => $name))->getData();
		if (count($tags) == 0){
			$q_ins_tag = 'INSERT INTO tags(name, status)
			VALUES(:name, TRUE) RETURNING id';
			$p_ins_tag = $db->prepare($q_ins_tag);

			$p_ins_tag->execute(array(
				':name' => $name
			));
			$tag_id = $db->lastInsertId();
		}else{
			$tag_id = intval($tags[0]['id']);
		}
		return self::one($db, $tag_id);
	}

	public static function one(PDO $db, int $id) : Tag{
		return self::filter($db, array('id' => $id));
	}
}