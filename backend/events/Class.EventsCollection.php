<?php

class EventsCollection{



	public static function filter(PDO $db, array $filters = null) {
		$q_get_events = 'SELECT events.*, event_types.latin_name as event_type_latin_name,
			organizations.name as organization_name, organization_types.name as organization_type_name
			FROM events
			INNER JOIN organizations ON organizations.id = events.organization_id
			INNER JOIN organization_types ON organization_types.id = organizations.type_id
			INNER JOIN event_types ON event_types.id = events.event_type_id
			WHERE organizations.status = 1 ';
		$statement_array = array();
		foreach($filters as $name => $value){
			switch($name){
				case 'date': {
					$q_get_events .= ' AND ((events.event_start_date >= DATE(:date) AND events.event_end_date <= DATE(:date)) OR (DATE(events.event_start_date) = DATE(:date) AND DATE(events.event_end_date) = DATE(:date)))';
					$statement_array[':date'] = $value;
					break;
				}
				case 'organization': {
					if ($value instanceof Organization == false) break;
					$q_get_events .= ' AND (organizations.id = :organization_id)';
					$statement_array[':organization_id'] = $value->getId();
					break;
				}
			}
		}
		$p_get_events = $db->prepare($q_get_events);
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		return new Result(true, '', $p_get_events->fetchAll());
	}


}