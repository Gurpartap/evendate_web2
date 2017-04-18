<?php


class Tariff{


	const FREE_PRICE = 0;
	const FULL_PRICE = 1400;

	const FREE_ID = 1;
	const FULL_ID = 2;

	const PRICES = array(
		self::FREE_ID => self::FREE_PRICE,
		self::FULL_PRICE => self::FULL_PRICE,
	);

	public static function getPriceById(int $id){
		if (!isset(self::PRICES[$id])) throw new InvalidArgumentException('BAD_TARIFF');
		return self::PRICES[$id];
	}

}