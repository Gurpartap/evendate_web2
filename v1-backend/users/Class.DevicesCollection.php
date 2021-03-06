<?php

class DevicesCollection extends AbstractCollection{


	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id')
	) {

		$q_get_devices = App::queryFactory()->newSelect();
		$_fields = Fields::mergeFields(Device::getAdditionalCols(), $fields, Device::getDefaultCols());


		$q_get_devices
			->from('view_devices')
			->cols($_fields)
			->where('user_id = :user_id')
			->orderBy($order_by);

		$statement_array = array(':user_id' => $user->getId());


		if (isset($filters['id'])){
			$is_one_device = true;
			$q_get_devices->where('id = :id');
			$statement_array[':id'] = $filters['id'];
		}else{
			$is_one_device = false;
		}

		if (isset($pagination['offset'])){
			$q_get_devices->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_devices->limit($pagination['length']);
		}



		$devices = $db->prepareExecute($q_get_devices, '', $statement_array)->fetchAll(PDO::FETCH_CLASS, 'Device');
		if (count($devices) == 0 && $is_one_device) throw new LogicException('CANT_FIND_DEVICE');
		$result_devices = array();
		if ($is_one_device) return $devices[0];
		foreach($devices as $device){
			$result_devices[] = $device->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_devices);
	}

	public static function one(ExtendedPDO $db, AbstractUser $user, int $id, array $fields = null) : Device {
		return parent::one($db, $user, $id, $fields);

	}


}