<?php

class AbstractAggregator
{

	const SCALE_HOUR = 'hour';
	const SCALE_DAY = 'day';
	const SCALE_WEEK = 'week';
	const SCALE_MONTH = 'month';
	const SCALE_YEAR = 'year';
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

		if ($scale == 'overall') {
			$scale = 'century';
		}elseif (!in_array($scale, self::$scales)) {
			$scale = self::SCALE_WEEK;
		}
		$query = str_replace('{SCALE}', $scale, $query);
		return $query;
	}

}