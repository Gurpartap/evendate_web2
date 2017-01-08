<?php
/**
 *
 * This file is part of Aura for PHP.
 *
 * @license http://opensource.org/licenses/bsd-license.php BSD
 *
 */
namespace Aura\SqlQuery\Common;

/**
 *
 * An interface for ON CONFLICT clauses.
 *
 * @package Aura.SqlQuery
 *
 */
interface OnConflictInterface
{
	/**
	 *
	 * Adds returning columns to the query.
	 *
	 * Multiple calls to returning() will append to the list of columns, not
	 * overwrite the previous columns.
	 *
	 * @param array $conflict_cols
	 * @param array $col_values
	 * @return OnConflictInterface
	 * @internal param array $cols The column(s) to add to the query.
	 *
	 */

	public function onConflictUpdate(array $conflict_cols, array $col_values);
}
