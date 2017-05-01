<?php


class Tariff extends AbstractEntity
{

	const FREE_ID = 1;
	const EVENT_PUBLICATIONS_FIELD_NAME = 'event_publications';

	const FULL_PRICE = 800;
	const FULL_ID = 2;

	protected static $DEFAULT_COLS = array(
		'tariff_id',
		'name'
	);

	protected static $ADDITIONAL_COLS = array(
		'since',
		'till',
		'status',
		'payment_id',
		'available_additional_notifications',
		'available_event_publications',
		'available_tickets_selling',
		'available_telegram_bots',
		'available_slack_bots',
		'available_auditory_analytics',
		'available_in_city',
		'price',
		self::EVENT_PUBLICATIONS_FIELD_NAME => '(SELECT COUNT(id) FROM events
			WHERE organization_id = view_organizations_tariffs.organization_id
			AND events.status = TRUE
			AND extract(month from events.created_at) = extract(month from now())
			AND extract(year from events.created_at) = extract(year from now())
			) AS ' . self::EVENT_PUBLICATIONS_FIELD_NAME
	);


	public static function getPriceById(int $id)
	{

	}

	public static function getForOrganization(ExtendedPDO $db, User $user, array $filters, $fields): Result
	{
		if (!isset ($filters['organization']) || $filters['organization'] instanceof Organization == false) throw new InvalidArgumentException('NOT_ORGANIZATION');
		if (!$user->isAdmin($filters['organization']) && !$user->isModerator($filters['organization'])) throw new PrivilegesException('WHAT_ARE_DOING_MAN', $db);

		$_fields = Fields::mergeFields(self::getAdditionalCols(), $fields, self::getDefaultCols());


		$q_get = App::queryFactory()->newSelect();
		$q_get->cols($_fields)
			->from('view_organizations_tariffs')
			->where('organization_id = ?', $filters['organization']->getId())
			->where('status = TRUE')
			->where('(till IS NULL OR till >= DATE_PART(\'epoch\', NOW()))')
			->orderBy(array('price DESC', 'till DESC'))
			->limit(1);

		$res = $db->prepareExecute($q_get, 'CANT_GET_TARIFF');

		if ($res->rowCount() == 0) throw new LogicException('CANT_FIND_ANY_TARIFFS');

		$fields = array_merge($fields, self::getDefaultCols());

		$res = $res->fetchAll(PDO::FETCH_CLASS, 'Tariff');

		return $res[0]->getParams($user, $fields);

	}

	public static function getTariffIdForOrganization(Organization $organization, User $user, ExtendedPDO $db)
	{
		$res = self::getForOrganization($db, $user, array('organization' => $organization),array())->getData();
		return $res[0]['id'];
	}

}