<?php

class AbstractAggregator
{

	const SCALE_HOUR = 'hours';
	const SCALE_DAY = 'days';
	const SCALE_WEEK = 'weeks';
	const SCALE_MONTH = 'months';
	const SCALE_YEAR = 'years';
	const SCALE_OVERALL = 'overall';

	public static $scales = array(
		self::SCALE_HOUR,
		self::SCALE_DAY,
		self::SCALE_WEEK,
		self::SCALE_MONTH,
		self::SCALE_YEAR
	);

	protected function replaceScale($query, $scale)
	{
		$scale = mb_strtolower($scale);
		if (!in_array($scale, self::$scales)) {
			$scale = self::SCALE_WEEK;
		}

		if ($scale == 'overall') {
			$scale = 'century';
		}
		$query = str_replace('{SCALE}', $scale, $query);
		return $query;
	}

}