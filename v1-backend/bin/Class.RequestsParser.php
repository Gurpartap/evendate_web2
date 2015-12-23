<?php

class RequestParser{


	/**
	 * Code from http://stackoverflow.com/questions/9464935/php-multipart-form-data-put-request
	 *
	 * @return array
	 */
	public static function put($input){
		$put = array();
		parse_str($input, $put);
		return $put;
	}


	public static function payload($input){
		return json_decode($input, true);
	}
}