#!/bin/sh

LAST=`exec ls $MY_DIR | sed 's/\([0-9]\+\).*/\1/g' | sort -n | tail -1`
SQL=.sql
echo ${LAST}
LAST_FILE=`tail -1 update0.log`
echo ${LAST_FILE}
if [ LAST == LAST_FILE ]
 then
  echo LAST >> ./update0.log
else
  echo "Exists"
fi