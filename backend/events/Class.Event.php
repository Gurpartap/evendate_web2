<?php

class Event{



	public static function create(PDO $db, array $data){
		$q_ins_event = 'INSERT INTO events(created_at, title, description, location, location_uri, only_for_residents, event_start_date,event_end_date, notifications_schema_id, creator_id, organization_id, latitude, longitude, image_ext)
				VALUES(NOW(), :title, :description, :location, :location_uri, :only_for_residents, :event_start_date, :event_end_date, :notifications_schema_id, :creator_id, :organization_id, :latitude, :longitude, :image_ext)';

		$p_ins_event = $db->prepare($q_ins_event);

		$data['latitude'] = isset($data['latitude']) ? $data['latitude'] : null;
		$data['location'] = isset($data['location']) ? $data['location'] : null;
		$data['longitude'] = isset($data['longitude']) ? $data['longitude'] : null;

		$result = $p_ins_event->execute(array(
			':title' => $data['title'],
			':description' => $data['description'],
			':location' => $data['location'],
			':location_uri' => 'content://maps.google.com/lat=' . $data['latitude'].'&long='.$data['longitude'],
			':only_for_residents' => FALSE,
			':event_start_date' => $data['event_start_date'],
			':event_end_date' => $data['event_end_date'],
			':notifications_schema_id' => 1,
			':creator_id' => $data['creator_id'],
			':organization_id' => $data['organization_id'],
			':latitude' => $data['latitude'],
			':longitude' => $data['longitude'],
			':image_ext' => $data['image_ext'],
		));

		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		self::saveEventImage($data['cropped_file'], $data['image_ext'], $db->lastInsertId());

		return new Result(true, 'Событие успешно создано!');
	}

	private static function saveEventImage($file, $ext, $id){
		$start_memory = memory_get_usage();
		$tmp = unserialize(serialize($file));
		$img_size = memory_get_usage() - $start_memory;

		if ($img_size / 1024 > 6144){ // CMP with 6 MB, coz var is not only image data
			throw new InvalidArgumentException('Файл слишком большого размера. Максимальный размер - 4МБ');
		}

		$file = explode(',', $file);
		$file = $file[1];
		if ($ext != '' && $file){
			global $ROOT_PATH;
			$new_file_name = $ROOT_PATH . '/event_images/' . $id . '.' . $ext;
			file_put_contents($new_file_name, base64_decode($file));
			return new Result(true, 'Данные успешно обновлены');
		}else{
			return new Result(false, 'Ошибка обновлени данных. Не указан файл или название.');
		}
	}

	public static function getEventTypes(PDO $db){
		$p_get_event_types = $db->query('SELECT *
			FROM event_types
			WHERE status = 1');
		return new Result(true, '', $p_get_event_types->fetchAll());
	}
}



