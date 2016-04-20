<?php


require_once $BACKEND_FULL_PATH . '/bin/Class.AbstractCollection.php';

class TagsCollection extends AbstractCollection{

	public static function filter(PDO $db,
	                              User $user = null,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              array $order_by = array('id')){

		$q_get_tags = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_tag = false;

		$q_get_tags->distinct()
			->cols(Fields::mergeFields(Tag::getAdditionalCols(), $fields, Tag::getDefaultCols()))
			->from('view_tags')
			->orderBy($order_by);


		if (isset($pagination['offset'])){
			$q_get_tags->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_tags->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_tags->where('id = :id');
					$statements[':id'] = $value;
					$is_one_tag = true;
					break;
				}
				case 'name': {
					if (isset($filters['strict']) && $filters['strict'] == 'true'){
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
						$q_get_tags->where('id IN (SELECT tag_id FROM events_tags WHERE event_id = :event_id AND status = TRUE)');
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
		if ($is_one_tag) return $tags[0];
		foreach($tags as $tag){
			$result_events[] = $tag->getParams($user, $fields)->getData();
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

		$tags = TagsCollection::filter($db,
			App::getCurrentUser(),
			array('strict' => true, 'name' => $name),
			array(),
			array(),
			array())->getData();
		if (count($tags) == 0){
			$q_ins_tag = 'INSERT INTO tags(name, status)
			VALUES(:name, TRUE) RETURNING id';
			$p_ins_tag = $db->prepare($q_ins_tag);

			$p_ins_tag->execute(array(
				':name' => $name
			));

			$result = $p_ins_tag->fetch(PDO::FETCH_ASSOC);
			$tag_id = $result['id'];
		}else{
			$tag_id = intval($tags[0]['id']);
		}
		return self::one($db, App::getCurrentUser(), $tag_id, array());
	}
}