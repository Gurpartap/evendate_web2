<?php

class EventsDatesCollection{



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

		$q_get_dates
			->distinct()
			->from('view_dates');
		$_fields = Fields::mergeFields(EventDate::getAdditionalCols(), $fields, EventDate::getDefaultCols());

		$statement_array = array();

		if (isset($pagination['offset'])){
			$q_get_dates->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_dates->limit($pagination['length']);
		}

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
				 case 'event': {
					 if ($value instanceof Event){
						 $q_get_dates
							 ->where('event_id = :event_id');
						 $statement_array[':event_id'] = $value->getId();
					 }
					 break;
				 }
				 case 'unique': {
					 $_fields = array('event_date');
					 $_fields[] = ' COUNT(event_date) AS ' . EventDate::EVENTS_COUNT_COL_NAME;
					 $_fields[] = ' (SELECT COUNT(id) FROM favorite_events WHERE event_id = view_dates.event_id AND status = TRUE)' . EventDate::FAVORED_COUNT_COL_NAME;
					 $q_get_dates
						 ->groupBy(array('event_date'));

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
			->cols($_fields)
			->orderBy($order_by);
		echo $q_get_dates->getStatement();
		$p_get_events = $db->prepare($q_get_dates->getStatement());
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$events_dates = $p_get_events->fetchAll(PDO::FETCH_CLASS, 'EventDate');
		$result_dates = array();
		foreach($events_dates as $event_date){
			$result_dates[] = $event_date->getParams($user, $fields)->getData();
		}

		return new Result(true, '', $result_dates);
	}


}