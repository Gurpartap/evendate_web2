<?php

class EventsDatesCollection extends AbstractCollection{

	public static function filter(PDO $db,
	                              User $user,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              array $order_by = array('id')){

		$q_get_dates = App::queryFactory()->newSelect();

		if (isset($pagination['offset'])){
			$q_get_dates->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_dates->limit($pagination['length']);
		}

		//remove favored_count and events_count if flat unique is not defined
		if (!isset($filters['unique']) || boolval($filters['unique']) == false){
			if(isset($fields[EventDate::EVENTS_COUNT_FIELD_NAME])) {
				unset($fields[EventDate::EVENTS_COUNT_FIELD_NAME]);
			}
			if(isset($fields[EventDate::FAVORED_COUNT_FIELD_NAME])) {
				unset($fields[EventDate::FAVORED_COUNT_FIELD_NAME]);
			}
		}

		$q_get_dates
			->from('view_dates');
		$_fields = Fields::mergeFields(EventDate::getAdditionalCols(), $fields, EventDate::getDefaultCols());

		$cols = $_fields;
		$statement_array = array();

		 foreach($filters as $name => $value){
			 switch($name){
				 case 'month': {
					 if ($value instanceof DateTime){
						 $q_get_dates
							 ->where("DATE_PART('year', to_timestamp(event_date)) = :year")
							 ->where("DATE_PART('month', to_timestamp(event_date)) = :month");
						 $statement_array[':year'] = $value->format('Y');
						 $statement_array[':month'] = $value->format('m');
					 }
					 break;
				 }
				 case 'since': {
					 if ($value instanceof DateTime){
						 $q_get_dates
							 ->where("DATE(event_date) >= :since_date");
						 $statement_array[':since_date'] = $value->format('Y-m-d');
					 }
					 break;
				 }
				 case 'till': {
					 if ($value instanceof DateTime){
						 $q_get_dates
							 ->where("DATE(event_date) <= :till_date");
						 $statement_array[':till_date'] = $value->format('Y-m-d');
					 }
					 break;
				 }
				 case 'event': {
					 if ($value instanceof Event){
						 $q_get_dates
							 ->where('view_dates.event_id = :event_id');
						 $statement_array[':event_id'] = $value->getId();
					 }
					 break;
				 }
				 case 'unique': {
					 $cols = array_merge(EventDate::getDefaultCols(), array(
						 EventDate::getAdditionalCols()[EventDate::EVENTS_COUNT_FIELD_NAME],
						 EventDate::getAdditionalCols()[EventDate::FAVORED_COUNT_FIELD_NAME],
					 ));
					 $_fields = array_merge(EventDate::getDefaultCols(),
						 array(EventDate::EVENTS_COUNT_FIELD_NAME => '', EventDate::FAVORED_COUNT_FIELD_NAME => ''));
					 $q_get_dates->join(
							 'LEFT',
							 'favorite_events',
							 ' ON favorite_events.event_id = view_dates.event_id AND favorite_events.user_id = :user_id')
						 ->groupBy(array('event_date'));
					 $statement_array[':user_id'] = $user->getId();
					 break;
				 }
				 case 'organization': {
					 if ($value instanceof Organization){
						 $q_get_dates
							 ->where('organization_id = :organization_id');
						 $statement_array[':organization_id'] = $value->getId();
					 }
					 break;
				 }
			 }
		 }


		$q_get_dates
			->cols($cols)
			->orderBy($order_by);
		$p_get_events = $db->prepare($q_get_dates->getStatement());
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$events_dates = $p_get_events->fetchAll(PDO::FETCH_CLASS, 'EventDate');
		$result_dates = array();
		foreach($events_dates as $event_date) {
			$result_dates[] = $event_date->getParams($user, $_fields)->getData();
		}

		return new Result(true, '', $result_dates);
	}


}