<?php

class NoMethodException extends AbstractException{
	const HTTP_CODE = 404;
	const ERROR_CODE = 10404;
}