<?php

require_once '../v1-backend/bin/env_variables.php';
require_once "{$BACKEND_FULL_PATH}/bin/Class.Result.php";
require_once "{$BACKEND_FULL_PATH}/bin/db.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.RequestsParser.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.Fields.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractEntity.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractCollection.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.AbstractUser.php";
require_once "{$BACKEND_FULL_PATH}/organizations/Class.OrganizationsCollection.php";
require_once "{$BACKEND_FULL_PATH}/organizations/Class.Organization.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.EventsCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.Event.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.NotAuthorizedUser.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.User.php";

require_once "{$BACKEND_FULL_PATH}/events/Class.EventDate.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.EventsDatesCollection.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.UsersCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.OrdersCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.TicketsCollection.php";

$months = array(
	1 => 'ЯНВАРЯ', 2 => 'ФЕВРАЛЯ', 3 => 'МАРТА', 4 => 'АПРЕЛЯ',
	5 => 'МАЯ', 6 => 'ИЮНЯ', 7 => 'ИЮЛЯ', 8 => 'АВГУСТА',
	9 => 'СЕНТЯБРЯ', 10 => 'ОКТЯБРЯ', 11 => 'НОЯБРЯ', 12 => 'ДЕКАБРЯ'
);

App::buildGlobal($__db);

$user = App::getCurrentUser();

$event_fields = Fields::parseFields('organization_name,location,dates{fields:"start_datetime_utc,end_datetime_utc"}');
$order_fields = Fields::parseFields('number,created_at,final_sum');
$organization_fields = Fields::parseFields('number,created_at,final_sum');
try {
	$event = EventsCollection::one($__db, $user, $_REQUEST['event_id'], $event_fields);
	$order = OrdersCollection::oneByUUID($__db, $user, $_REQUEST['uuid'], $order_fields);

	$legal_entity = $order->getLegalEntityData();

	$organization_info = OrganizationsCollection::one(
	  $__db,
    $user,
    $event->getOrganizationId(),
		$organization_fields,
    array()
  )->getParams($user, $organization_fields)->getData();

	$event_info = $event->getParams($user, $event_fields)->getData();
	$order_info = $order->getParams($user, $order_fields)->getData();

	$order_info['doc_number'] = 'КЕ1610-' . $order_info['number'];

	$order_date = DateTime::createFromFormat('U', $order_info['created_at']);
	$order_date_str = $order_date->format('d ') . $months[$order_date->format('n')] . $order_date->format(' Y');

	$dates_text = array();
	foreach($event_info['dates'] as $date){
	  $_date = DateTime::createFromFormat('U', $date['event_date']);
		$dates_text[] = $_date->format('d.m.Y');
  }

} catch (Exception $e) {
	var_dump($e);
}

?>
<html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
      xmlns="http://www.w3.org/TR/REC-html40">

<head>
  <meta http-equiv=Content-Type content="text/html; charset=windows-1251">
  <meta name=ProgId content=Word.Document>
  <meta name=Generator content="Microsoft Word 15">
  <meta name=Originator content="Microsoft Word 15">
  <link rel=File-List
        href="Bill_B548694-20719312_Trening-intensiv_'Klyuchevye_sekrety_oratora'.files/filelist.xml">
  <link rel=Edit-Time-Data
        href="Bill_B548694-20719312_Trening-intensiv_'Klyuchevye_sekrety_oratora'.files/editdata.mso">
  <link rel=themeData
        href="Bill_B548694-20719312_Trening-intensiv_'Klyuchevye_sekrety_oratora'.files/themedata.thmx">
  <link rel=colorSchemeMapping
        href="Bill_B548694-20719312_Trening-intensiv_'Klyuchevye_sekrety_oratora'.files/colorschememapping.xml">
  <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
                  DefSemiHidden="false" DefQFormat="false" DefPriority="99"
                  LatentStyleCount="375">
    <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>
    <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 7"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 8"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index 9"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 1"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 2"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 3"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 4"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 5"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 6"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 7"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 8"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" Name="toc 9"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Normal Indent"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="footnote text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="annotation text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="header"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="footer"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="index heading"/>
    <w:LsdException Locked="false" Priority="35" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="caption"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="table of figures"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="envelope address"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="envelope return"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="footnote reference"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="annotation reference"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="line number"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="page number"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="endnote reference"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="endnote text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="table of authorities"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="macro"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="toa heading"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Bullet"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Number"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Bullet 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Bullet 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Bullet 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Bullet 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Number 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Number 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Number 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Number 5"/>
    <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Closing"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Signature"/>
    <w:LsdException Locked="false" Priority="1" SemiHidden="true"
                    UnhideWhenUsed="true" Name="Default Paragraph Font"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text Indent"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Continue"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Continue 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Continue 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Continue 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="List Continue 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Message Header"/>
    <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Salutation"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Date"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text First Indent"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text First Indent 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Note Heading"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text Indent 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Body Text Indent 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Block Text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Hyperlink"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="FollowedHyperlink"/>
    <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
    <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Document Map"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Plain Text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="E-mail Signature"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Top of Form"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Bottom of Form"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Normal (Web)"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Acronym"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Address"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Cite"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Code"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Definition"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Keyboard"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Preformatted"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Sample"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Typewriter"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="HTML Variable"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Normal Table"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="annotation subject"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="No List"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Outline List 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Outline List 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Outline List 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Simple 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Simple 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Simple 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Classic 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Classic 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Classic 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Classic 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Colorful 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Colorful 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Colorful 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Columns 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Columns 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Columns 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Columns 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Columns 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 7"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Grid 8"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 7"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table List 8"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table 3D effects 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table 3D effects 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table 3D effects 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Contemporary"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Elegant"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Professional"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Subtle 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Subtle 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Web 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Web 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Web 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Balloon Text"/>
    <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Table Theme"/>
    <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>
    <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>
    <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>
    <w:LsdException Locked="false" Priority="34" QFormat="true"
                    Name="List Paragraph"/>
    <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>
    <w:LsdException Locked="false" Priority="30" QFormat="true"
                    Name="Intense Quote"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>
    <w:LsdException Locked="false" Priority="19" QFormat="true"
                    Name="Subtle Emphasis"/>
    <w:LsdException Locked="false" Priority="21" QFormat="true"
                    Name="Intense Emphasis"/>
    <w:LsdException Locked="false" Priority="31" QFormat="true"
                    Name="Subtle Reference"/>
    <w:LsdException Locked="false" Priority="32" QFormat="true"
                    Name="Intense Reference"/>
    <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>
    <w:LsdException Locked="false" Priority="37" SemiHidden="true"
                    UnhideWhenUsed="true" Name="Bibliography"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
                    UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>
    <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>
    <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>
    <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>
    <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>
    <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>
    <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>
    <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>
    <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>
    <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="Grid Table 1 Light Accent 1"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="Grid Table 6 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="Grid Table 7 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="Grid Table 1 Light Accent 2"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="Grid Table 6 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="Grid Table 7 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="Grid Table 1 Light Accent 3"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="Grid Table 6 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="Grid Table 7 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="Grid Table 1 Light Accent 4"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="Grid Table 6 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="Grid Table 7 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="Grid Table 1 Light Accent 5"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="Grid Table 6 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="Grid Table 7 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="Grid Table 1 Light Accent 6"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="Grid Table 6 Colorful Accent 6"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="Grid Table 7 Colorful Accent 6"/>
    <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>
    <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>
    <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="List Table 1 Light Accent 1"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="List Table 6 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="List Table 7 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="List Table 1 Light Accent 2"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="List Table 6 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="List Table 7 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="List Table 1 Light Accent 3"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="List Table 6 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="List Table 7 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="List Table 1 Light Accent 4"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="List Table 6 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="List Table 7 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="List Table 1 Light Accent 5"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="List Table 6 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="List Table 7 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="46"
                    Name="List Table 1 Light Accent 6"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>
    <w:LsdException Locked="false" Priority="51"
                    Name="List Table 6 Colorful Accent 6"/>
    <w:LsdException Locked="false" Priority="52"
                    Name="List Table 7 Colorful Accent 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Mention"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Smart Hyperlink"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Hashtag"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
                    Name="Unresolved Mention"/>
  </w:LatentStyles>
  </xml><![endif]-->
  <style>

    @media print {
      .page-breaker {
        page-break-after: always;
      }
    }

    <!--
    /* Font Definitions */
    @font-face {
      font-family: "Cambria Math";
      panose-1: 2 4 5 3 5 4 6 3 2 4;
      mso-font-charset: 1;
      mso-generic-font-family: roman;
      mso-font-pitch: variable;
      mso-font-signature: 0 0 0 0 0 0;
    }

    @font-face {
      font-family: "DejaVu Sans";
      panose-1: 2 11 6 3 3 8 4 2 2 4;
      mso-font-charset: 204;
      mso-generic-font-family: swiss;
      mso-font-pitch: variable;
      mso-font-signature: -419418369 -771686913 170156073 0 511 0;
    }

    /* Style Definitions */
    p.MsoNormal, li.MsoNormal, div.MsoNormal {
      mso-style-unhide: no;
      mso-style-qformat: yes;
      mso-style-parent: "";
      margin-top: 0cm;
      margin-right: 0cm;
      margin-bottom: 2.0pt;
      margin-left: .5pt;
      text-indent: -.5pt;
      line-height: 110%;
      mso-pagination: widow-orphan;
      font-size: 8.0pt;
      mso-bidi-font-size: 11.0pt;
      font-family: "DejaVu Sans", sans-serif;
      mso-fareast-font-family: "DejaVu Sans";
      color: black;
    }

    h1 {
      mso-style-priority: 9;
      mso-style-qformat: yes;
      mso-style-parent: "";
      mso-style-link: "Заголовок 1 Знак";
      mso-style-next: Обычный;
      margin-top: 0cm;
      margin-right: 0cm;
      margin-bottom: 7.65pt;
      margin-left: 7.45pt;
      text-align: center;
      text-indent: -.5pt;
      line-height: 107%;
      mso-pagination: widow-orphan lines-together;
      page-break-after: avoid;
      mso-outline-level: 1;
      mso-list: l0 level1 lfo1;
      font-size: 10.5pt;
      mso-bidi-font-size: 11.0pt;
      font-family: "DejaVu Sans", sans-serif;
      mso-fareast-font-family: "DejaVu Sans";
      color: black;
      mso-font-kerning: 0pt;
      mso-bidi-font-weight: normal;
    }

    span

    .1
    {
      mso-style-name: "Заголовок 1 Знак"
    ;
      mso-style-unhide: no
    ;
      mso-style-locked: yes
    ;
      mso-style-parent: ""
    ;
      mso-style-link: "Заголовок 1"
    ;
      mso-ansi-font-size: 10.5pt
    ;
      font-family: "DejaVu Sans", sans-serif
    ;
      mso-ascii-font-family: "DejaVu Sans"
    ;
      mso-fareast-font-family: "DejaVu Sans"
    ;
      mso-hansi-font-family: "DejaVu Sans"
    ;
      mso-bidi-font-family: "DejaVu Sans"
    ;
      color: black
    ;
      font-weight: bold
    ;
      mso-bidi-font-weight: normal
    ;
    }
    .MsoChpDefault {
      mso-style-type: export-only;
      mso-default-props: yes;
      mso-ascii-font-family: Calibri;
      mso-ascii-theme-font: minor-latin;
      mso-fareast-font-family: "Times New Roman";
      mso-fareast-theme-font: minor-fareast;
      mso-hansi-font-family: Calibri;
      mso-hansi-theme-font: minor-latin;
      mso-bidi-font-family: "Times New Roman";
      mso-bidi-theme-font: minor-bidi;
    }

    .MsoPapDefault {
      mso-style-type: export-only;
      margin-bottom: 8.0pt;
      line-height: 107%;
    }

    @page WordSection1 {
      size: 595.3pt 841.9pt;
      margin: 38.15pt 40.95pt 107.25pt 34.0pt;
      mso-header-margin: 36.0pt;
      mso-footer-margin: 36.0pt;
      mso-paper-source: 0;
    }

    div.WordSection1 {
      page: WordSection1;
    }

    /* List Definitions */
    @list l0 {
      mso-list-id: 1768310845;
      mso-list-type: hybrid;
      mso-list-template-ids: -71268988 2096529822 809150300 -18455368 1541023606 1114264530 757654620 966180654 -324489362 -1437049378;
    }
    @list l0:level1 {
      mso-level-style-link: "Заголовок 1";
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 0cm;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level2 {
      mso-level-number-format: alpha-lower;
      mso-level-text:% 2;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 204.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level3 {
      mso-level-number-format: roman-lower;
      mso-level-text:% 3;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 240.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level4 {
      mso-level-text:% 4;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 276.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level5 {
      mso-level-number-format: alpha-lower;
      mso-level-text:% 5;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 312.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level6 {
      mso-level-number-format: roman-lower;
      mso-level-text:% 6;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 348.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level7 {
      mso-level-text:% 7;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 384.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level8 {
      mso-level-number-format: alpha-lower;
      mso-level-text:% 8;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 420.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    @list l0:level9 {
      mso-level-number-format: roman-lower;
      mso-level-text:% 9;
      mso-level-tab-stop: none;
      mso-level-number-position: left;
      margin-left: 456.05pt;
      text-indent: 0cm;
      mso-ansi-font-size: 10.5pt;
      mso-bidi-font-size: 10.5pt;
      mso-ascii-font-family: "DejaVu Sans";
      mso-fareast-font-family: "DejaVu Sans";
      mso-hansi-font-family: "DejaVu Sans";
      mso-bidi-font-family: "DejaVu Sans";
      color: black;
      border: none;
      mso-ansi-font-weight: bold;
      mso-bidi-font-weight: bold;
      mso-ansi-font-style: normal;
      text-underline: black;
      text-decoration: none;
      text-underline: none;
      text-decoration: none;
      text-line-through: none;
      vertical-align: baseline;
    }
    ol {
      margin-bottom: 0cm;
    }

    ul {
      margin-bottom: 0cm;
    }

    -->
  </style>
  <!--[if gte mso 10]>
  <style>
    /* Style Definitions */
    table.MsoNormalTable {
      mso-style-name: "Обычная таблица";
      mso-tstyle-rowband-size: 0;
      mso-tstyle-colband-size: 0;
      mso-style-noshow: yes;
      mso-style-priority: 99;
      mso-style-parent: "";
      mso-padding-alt: 0cm 5.4pt 0cm 5.4pt;
      mso-para-margin-top: 0cm;
      mso-para-margin-right: 0cm;
      mso-para-margin-bottom: 8.0pt;
      mso-para-margin-left: 0cm;
      line-height: 107%;
      mso-pagination: widow-orphan;
      font-size: 11.0pt;
      font-family: "Calibri", sans-serif;
      mso-ascii-font-family: Calibri;
      mso-ascii-theme-font: minor-latin;
      mso-hansi-font-family: Calibri;
      mso-hansi-theme-font: minor-latin;
      mso-bidi-font-family: "Times New Roman";
      mso-bidi-theme-font: minor-bidi;
    }

    table.TableGrid {
      mso-style-name: TableGrid;
      mso-tstyle-rowband-size: 0;
      mso-tstyle-colband-size: 0;
      mso-style-unhide: no;
      mso-style-parent: "";
      mso-padding-alt: 0cm 0cm 0cm 0cm;
      mso-para-margin: 0cm;
      mso-para-margin-bottom: .0001pt;
      mso-pagination: widow-orphan;
      font-size: 11.0pt;
      font-family: "Calibri", sans-serif;
      mso-ascii-font-family: Calibri;
      mso-ascii-theme-font: minor-latin;
      mso-hansi-font-family: Calibri;
      mso-hansi-theme-font: minor-latin;
      mso-bidi-font-family: "Times New Roman";
      mso-bidi-theme-font: minor-bidi;
    }
  </style>
  <![endif]--><!--[if gte mso 9]>
  <xml>
    <o:shapedefaults v:ext="edit" spidmax="1027"/>
  </xml><![endif]--><!--[if gte mso 9]>
  <xml>
    <o:shapelayout v:ext="edit">
      <o:idmap v:ext="edit" data="1"/>
    </o:shapelayout>
  </xml><![endif]-->
</head>

<body lang=RU style='tab-interval:35.4pt'>

<div class=WordSection1>

  <h1 style='text-indent:0cm;mso-list:none'>ДОГОВОР-СЧЕТ №<?= $order_info['doc_number'] ?>
    ОТ <?= $order_date_str ?></h1>

  <p class=MsoNormal style='margin-left:1.25pt'>Общество с ограниченной
    ответственностью «Эвендейт», зарегистрированное по адресу Кабардино-Балкарская Респ, Черекский р-н, село Аушигер, ул
    Бицуева А.Б., д 70.,
    ОГРН: 1170726002501,
    ИНН: 0706005473, в лице Генерального директора Карданова Инала Руслановича,
    (далее – «Исполнитель») с одной стороны, и акцептовавшее настоящую оферту
    юридическое лицо (либо индивидуальный предприниматель), реквизиты которого
    указаны в пункте 6 Договора, (далее – «Заказчик»), далее совместно именуемые
    «Стороны», заключили настоящий договор (далее – «Договор») о нижеследующем.</p>

  <h1 style='margin-left:21.9pt;text-indent:-14.95pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
      style='mso-bidi-font-size:10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span
        style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>ПРЕДМЕТ
    ДОГОВОРА</h1>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
134%'><span style='color:#666666'>1.1. </span>Исполнитель, действующий от
    своего имени, но за счет Организатора мероприятия (далее – «Организатор»), на
    основании Агентского договора, заключенного в порядке и на условиях,
    размещенных в сети Интернет по сетевому адресу <a
      href="https://evendate.io/docs/agent_agreement.pdf"><span
        style='color:#0000CC'>https://evendate.io/docs/agent_agreement.pdf</span></a>,
    обязуется оказать Заказчику услуги по оформлению для Заказчика и/или указанных
    Заказчиком лиц электронных билетов на Мероприятие, указанное в пункте 4
    Договора, а Заказчик обязуется оплатить стоимость участия в Мероприятии путем
    оплаты счета, указанного в пункте 7 Договора.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.2pt;
margin-left:1.25pt'><span style='color:#666666'>1.2. </span>Мероприятие
    проводится Организатором, информация о котором указана в пункте 5 Договора.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.8pt;
margin-left:18.75pt;text-indent:-18.0pt'><span style='color:#666666'>1.3. </span>Исполнитель
    направляет Заказчику соответствующее количество электронных билетов в течение 5
    (пяти) рабочих дней с момента заключения Договора в соответствии с пунктом 2.3
    Договора. Электронные билеты направляются Исполнителем на адреса электронной
    почты, указанные Заказчиком (или представителями Заказчика) при регистрации на
    Мероприятие (далее – «Уполномоченные адреса»). С момента отправки электронных
    билетов услуги Исполнителя считаются оказанными надлежащим образом.</p>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
132%'><span style='color:#666666'>1.4. </span>Заказчик уведомлен, что
    Исполнитель не является организатором Мероприятия и не может влиять на качество
    проведения Мероприятия, порядок и сроки его проведения. Исполнитель не несет
    ответственности за качество проведения Мероприятия, изменение программы
    Мероприятия или иных сведений, указанных в пункте 4 Договора.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.8pt;
margin-left:18.75pt;text-indent:-18.0pt'><span style='color:#666666'>1.5. </span>В
    случае отмены Мероприятия или отказа Заказчика от участия в Мероприятии,
    вопросы возврата стоимости участия в Мероприятии разрешаются Заказчиком
    непосредственно с Организатором. В случае получения указания от Организатора
    Исполнитель возвращает Заказчику стоимость участия в Мероприятии путем
    перечисления денежных средств на расчетный счет Заказчика, с которого Заказчик
    производил оплату стоимости участия в Мероприятии.</p>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
132%'><span style='color:#666666'>1.6. </span>В случае если Заказчик
    осуществляет оплату счета позднее чем через 7 (семь) календарных дней с момента
    отправки Договора на Уполномоченный адрес, стоимость участия в Мероприятии
    может быть изменена Организатором. В этом случае Заказчик уплачивает разницу в
    течение 2 (двух) рабочих дней с момента получения уведомления об изменения
    стоимости.</p>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt'><span
      style='color:#666666'>1.7. </span>За исключением прямо предусмотренных
    Договором и действующим законодательством Российской Федерации случаев все
    уведомления, сообщения и документы в рамках исполнения Сторонами обязательств,
    возникших из Договора, должны быть направлены и считаются полученными Сторонами
    в случае направления их по электронной почте с уполномоченного адреса одной
    Стороны на уполномоченный адрес другой Стороны. </p>

  <p class=MsoNormal style='margin-left:19.25pt'>Уполномоченными адресами
    считаются: </p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.0pt;
margin-left:20.0pt'><span style='color:#666666'>1.7.1.</span>Для Заказчика:
    адрес, указанный в пункте 6 Договора;</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:22.4pt;
margin-left:20.0pt'><span style='color:#666666'>1.7.2.</span>Для Исполнителя: <u
      style='text-underline:#0000CC'><span style='color:#0000CC'>support@evendate.io</span></u>.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:21.35pt;
margin-left:18.75pt;text-indent:-18.0pt;line-height:132%'><span
      style='color:#666666'>1.8. </span>Стороны договорились использовать при
    подготовке необходимых документов и претензий по Договору факсимильное
    воспроизведение подписей Сторон. Настоящим Стороны подтверждают, что документы
    и претензии, подписанные с помощью факсимильного воспроизведения подписи, имеют
    юридическую силу и обязательны для рассмотрения и принятия Сторонами.</p>

  <h1 style='margin-left:21.9pt;text-indent:-14.95pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
      style='mso-bidi-font-size:10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span
        style='mso-list:Ignore'>2.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>ПОРЯДОК
    ЗАКЛЮЧЕНИЯ ДОГОВОРА</h1>

  <p class=MsoNormal style='margin-left:1.25pt'><span style='color:#666666'>2.1. </span>Для
    заключения Договора уполномоченное Заказчиком лицо осуществляет следующие
    действия: </p>

  <p class=MsoNormal style='margin-left:44.6pt;text-indent:-25.1pt;line-height:
134%'><span style='color:#666666'>2.1.1.</span>Регистрируется на Мероприятие
    (путем внесения в регистрационную форму сведений о фамилии и имени лица, адресе
    электронной почты и иные сведения, предусмотренные Организатором Мероприятия) и
    заключает с Исполнителем Пользовательское соглашение в порядке и на условиях,
    постоянно размещенных в сети Интернет по сетевому адресу <a
      href="https://evendate.io/docs/useragreement.pdf"><span
        style='color:#0000CC'>https://evendate.io/docs/useragreement.pdf</span></a>;</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.65pt;
margin-left:20.0pt'><span style='color:#666666'>2.1.2.</span>В качестве способа
    оплаты на сайте Исполнителя выбирает «Оплата от юрлица»;</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:21.85pt;
margin-left:44.6pt;text-indent:-25.1pt'><span style='color:#666666'>2.1.3.</span>Указывает
    достоверные и актуальные реквизиты Заказчика на соответствующей странице сайта
    Исполнителя.</p>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
136%'><span style='color:#666666'>2.2. </span>После совершения указанных
    действий Исполнитель формирует счет на оплату и посредством электронной почты с
    адреса <u style='text-underline:#0000CC'><span style='color:#0000CC'>feedback@evendate.io</span></u>
    направляет Договор на Уполномоченный адрес.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:28.4pt;
margin-left:18.75pt;text-indent:-18.0pt;line-height:132%'><span
      style='color:#666666'>2.3. </span>Договор считается заключенным с момента
    оплаты Заказчиком счета, указанного в пункте 7 Договора. Моментом оплаты
    признается момент зачисления соответствующей суммы на расчетный счет
    Исполнителя. При этом платежное поручение Заказчика, на основании которого
    производится оплата счета, должно быть оформлено в точном соответствии со
    счетом, указанным в пункте 7 Договора.</p>

  <h1 style='margin-left:21.9pt;text-indent:-14.95pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
      style='mso-bidi-font-size:10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span
        style='mso-list:Ignore'>3.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>ПОРЯДОК
    СДАЧИ-ПРИЕМКИ УСЛУГ</h1>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
132%'><span style='color:#666666'>3.1. </span>В течение 5 (пяти) рабочих дней с
    момента отправки Исполнителем сформированных электронных билетов на Мероприятие
    на Уполномоченный адрес Исполнитель посредством электронной почты направляет
    Заказчику Универсальный передаточный документ (далее УПД).</p>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
132%'><span style='color:#666666'>3.2. </span>Заказчик обязуется подписать УПД,
    либо мотивированный отказ от подписания УПД, в двух экземплярах и направить
    оригиналы УПД в адрес Исполнителя в течение 3 (трех) рабочих дней с момента
    получения Заказчиком УПД в порядке, предусмотренном пунктом 3.1 Договора.</p>

  <p class=MsoNormal style='margin-left:18.75pt;text-indent:-18.0pt;line-height:
133%'><span style='color:#666666'>3.3. </span>В течение 3 (трех) рабочих дней с
    момента получения от Заказчика двух экземпляров УПД, подписанных Заказчиком,
    Исполнитель направляет Заказчику один экземпляр УПД, подписанный Исполнителем.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:21.35pt;
margin-left:18.75pt;text-indent:-18.0pt;line-height:132%'><span
      style='color:#666666'>3.4. </span>В случае если Заказчик не заявит возражений
    относительно качества и полноты оказанных Исполнителем услуг в течение 3 (трех)
    рабочих дней с момента отправки Исполнителем сформированных электронных билетов
    на Мероприятие на Уполномоченный адрес, услуги считаются принятыми Заказчиком
    без возражений.</p>

  <h1 style='margin-left:21.9pt;text-indent:-14.95pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
      style='mso-bidi-font-size:10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span
        style='mso-list:Ignore'>4.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>ИНФОРМАЦИЯ
    О МЕРОПРИЯТИИ</h1>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.55pt;
margin-left:1.25pt'><span style='color:#666666'>4.1. </span>Название
    Мероприятия: <?= $event_info['title'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.25pt;
margin-left:1.25pt'><span style='color:#666666'>4.2. </span>Описание
    Мероприятия размещено в сети Интернет по сетевому адресу: <a
      href="https://evendate.io/event/<?= $event_info['id'] ?>/"><span
        style='color:#0000CC'>https://evendate.io/event/<?= $event_info['id'] ?>/</span></a></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.2pt;
margin-left:1.25pt'><span style='color:#666666'>4.3. </span>Даты проведения
    Мероприятия: <?= implode(', ', $dates_text) ?>.</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:23.6pt;
margin-left:1.25pt'><span style='color:#666666'>4.4. </span>Место проведения Мероприятия:
		<?= $event_info['location'] ?></p>

  <h1 style='margin-left:21.9pt;text-indent:-14.95pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
      style='mso-bidi-font-size:10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span
        style='mso-list:Ignore'>5.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>ИНФОРМАЦИЯ
    ОБ ОРГАНИЗАТОРЕ</h1>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.2pt;
margin-left:1.25pt'><span style='color:#666666'>5.1 </span>Наименование: <?= $event_info['organization_name'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.2pt;
margin-left:1.25pt'><span style='color:#666666'>5.2 </span>ИНН: <?= $organization['inn'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:4.2pt;
margin-left:1.25pt'><span style='color:#666666'>5.3 </span>Юридический адрес:
		<?= $organization['official_address'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:23.6pt;
margin-left:1.25pt'><span style='color:#666666'>5.4 </span>Режим
    налогообложения: <?= $organization['loans_type'] ?></p>

  <h1 style='margin-left:21.9pt;text-indent:-14.95pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
      style='mso-bidi-font-size:10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span
        style='mso-list:Ignore'>6.<span style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>РЕКВИЗИТЫ
    ЗАКАЗЧИКА</h1>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.65pt;
margin-left:1.25pt'>Наименование: <?= $legal_entity['company_name'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.65pt;
margin-left:1.25pt'>ИНН: <?= $legal_entity['company_inn'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.65pt;
margin-left:1.25pt'>Банковские реквизиты: p/с <?= $legal_entity['bank_payment_account'] ?>
    в <?= $legal_entity['bank_name'] ?>, БИК <?= $legal_entity['bank_bik'] ?>,
    к/с <?= $legal_entity['bank_correspondent_account'] ?></p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:3.65pt;
margin-left:1.25pt'>Юридический адрес: <?= $legal_entity['company_address'] ?></p>

  <p class=MsoNormal style='margin-left:1.25pt'>Уполномоченный адрес электронной
    почты: <?= $legal_entity['contact_email'] ?></p>

  <div class="page-breaker"></div>

  <h1 align=left style='margin-top:0cm;margin-right:0cm;margin-bottom:0cm;
margin-left:92.75pt;margin-bottom:.0001pt;text-align:left;text-indent:-14.95pt;
mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-bidi-font-size:
10.5pt;line-height:107%;mso-bidi-font-weight:bold'><span style='mso-list:Ignore'>7.<span
          style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]>СЧЕТ
    НА ОПЛАТУ №<?= $order_info['doc_number'] ?> ОТ <?= $order_date_str ?></h1>

  <table class=TableGrid border=0 cellspacing=0 cellpadding=0 width=703
         style='width:527.25pt;border-collapse:collapse;mso-yfti-tbllook:1184;
 mso-padding-alt:4.9pt 2.65pt 0cm 2.65pt'>
    <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:15.25pt'>
      <td width=180 colspan=2 valign=top style='width:135.05pt;border:solid #999999 1.0pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%;color:#666666'>ИНН</span><span style='font-size:7.5pt;
  mso-bidi-font-size:11.0pt;line-height:107%'> 0706005473</span></p>
      </td>
      <td width=166 colspan=2 valign=top style='width:124.55pt;border:solid #999999 1.0pt;
  border-left:none;mso-border-left-alt:solid #999999 .75pt;mso-border-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%;color:#666666'>КПП</span><span style='font-size:7.5pt;
  mso-bidi-font-size:11.0pt;line-height:107%'> 070601001</span></p>
      </td>
      <td width=70 colspan=2 rowspan=2 valign=top style='width:52.6pt;border:solid #999999 1.0pt;
  border-left:none;mso-border-left-alt:solid #999999 .75pt;mso-border-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%;color:#666666'>Сч. №</span></p>
      </td>
      <td width=287 colspan=4 rowspan=2 valign=top style='width:215.05pt;
  border:solid #999999 1.0pt;border-left:none;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>40702810700014551739</span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:1;height:26.8pt'>
      <td width=180 colspan=2 valign=top style='width:135.05pt;border-top:none;
  border-left:solid #999999 1.0pt;border-bottom:solid #999999 1.0pt;border-right:
  none;mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-left-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:26.8pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:1.6pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'><span style='font-size:
  7.5pt;mso-bidi-font-size:11.0pt;line-height:107%;color:#666666'>Получатель</span></p>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>ООО &quot;Эвендейт"&quot;</span></p>
      </td>
      <td width=166 colspan=2 valign=top style='width:124.55pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-bottom-alt:solid #999999 .75pt;mso-border-right-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:26.8pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:2;height:15.25pt'>
      <td width=180 colspan=2 rowspan=2 style='width:135.05pt;border-top:none;
  border-left:solid #999999 1.0pt;border-bottom:solid #999999 1.0pt;border-right:
  none;mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-left-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:1.6pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'><span style='font-size:
  7.5pt;mso-bidi-font-size:11.0pt;line-height:107%;color:#666666'>Банк
  получателя</span></p>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>ТИНЬКОФФ БАНК</span></p>
      </td>
      <td width=166 colspan=2 rowspan=2 valign=top style='width:124.55pt;
  border-top:none;border-left:none;border-bottom:solid #999999 1.0pt;
  border-right:solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  mso-border-right-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=70 colspan=2 valign=top style='width:52.6pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%;color:#666666'>БИК</span></p>
      </td>
      <td width=287 colspan=4 valign=top style='width:215.05pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>044525974</span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:3;height:15.25pt'>
      <td width=70 colspan=2 valign=top style='width:52.6pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%;color:#666666'>Сч. №</span></p>
      </td>
      <td width=287 colspan=4 valign=top style='width:215.05pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>40702810610000110894</span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:4;height:26.8pt'>
      <td width=189 colspan=3 valign=top style='width:141.55pt;border:solid #999999 1.0pt;
  border-top:none;mso-border-top-alt:solid #999999 .75pt;mso-border-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>Плательщик:</span></p>
      </td>
      <td width=514 colspan=7 valign=top style='width:385.65pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:26.8pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:145.9pt;margin-bottom:
  0cm;margin-left:0cm;margin-bottom:.0001pt;text-indent:0cm;line-height:107%'><span
            style='font-size:7.5pt;mso-bidi-font-size:11.0pt;line-height:107%'><?="{$legal_entity['company_name']}, ИНН: {$legal_entity['company_inn']}, КПП: {$legal_entity['company_kpp']}, {$legal_entity['company_address']}"?></span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:5;height:26.8pt'>
      <td width=24 valign=top style='width:17.95pt;border:solid #999999 1.0pt;
  border-top:none;mso-border-top-alt:solid #999999 .75pt;mso-border-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-align:justify;
  text-justify:inter-ideograph;text-indent:0cm;line-height:107%'><span
            style='font-size:7.5pt;mso-bidi-font-size:11.0pt;line-height:107%'>№</span></p>
      </td>
      <td width=376 colspan=4 valign=top style='width:281.9pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>Наименование услуги</span></p>
      </td>
      <td width=94 colspan=2 valign=top style='width:70.6pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>Количество</span></p>
      </td>
      <td width=106 valign=top style='width:79.8pt;border-top:none;border-left:
  none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>Единица измерения</span></p>
      </td>
      <td width=46 valign=top style='width:34.6pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>Цена</span></p>
      </td>
      <td width=57 valign=top style='width:42.4pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:26.8pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>Сумма</span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:6;height:38.3pt'>
      <td width=24 valign=top style='width:17.95pt;border:solid #999999 1.0pt;
  border-top:none;mso-border-top-alt:solid #999999 .75pt;mso-border-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:38.3pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>1</span></p>
      </td>
      <td width=376 colspan=4 valign=top style='width:281.9pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:38.3pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:2.35pt;margin-bottom:
  0cm;margin-left:0cm;margin-bottom:.0001pt;text-indent:0cm;line-height:132%'><span
            style='font-size:7.5pt;mso-bidi-font-size:11.0pt;line-height:132%'>Услуга по
  оформлению для указанных Заказчиком лиц электронных билетов на Мероприятие "<?= $event_info['title'] ?>"</p>
      </td>
      <td width=94 colspan=2 valign=top style='width:70.6pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:38.3pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>1</span></p>
      </td>
      <td width=106 valign=top style='width:79.8pt;border-top:none;border-left:
  none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:38.3pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>шт</span></p>
      </td>
      <td width=46 valign=top style='width:34.6pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:38.3pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'><?= $order_info['final_sum'] ?></span></p>
      </td>
      <td width=57 valign=top style='width:42.4pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:38.3pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'><?= $order_info['final_sum'] ?></span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:7;height:15.25pt'>
      <td width=24 valign=top style='width:17.95pt;border-top:none;border-left:
  solid #999999 1.0pt;border-bottom:solid #999999 1.0pt;border-right:none;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-left-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=376 colspan=4 valign=top style='width:281.9pt;border:none;
  border-bottom:solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=94 colspan=2 valign=top style='width:70.6pt;border:none;border-bottom:
  solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:
  solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=153 colspan=2 valign=top style='width:114.4pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-bottom-alt:solid #999999 .75pt;mso-border-right-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal align=right style='margin:0cm;margin-bottom:.0001pt;
  text-align:right;text-indent:0cm;line-height:107%'><b style='mso-bidi-font-weight:
  normal'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;line-height:
  107%'>Итого:</span></b></p>
      </td>
      <td width=57 valign=top style='width:42.4pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'><?= $order_info['final_sum'] ?></span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:8;height:15.25pt'>
      <td width=24 valign=top style='width:17.95pt;border-top:none;border-left:
  solid #999999 1.0pt;border-bottom:solid #999999 1.0pt;border-right:none;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-left-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=376 colspan=4 valign=top style='width:281.9pt;border:none;
  border-bottom:solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=94 colspan=2 valign=top style='width:70.6pt;border:none;border-bottom:
  solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:
  solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=153 colspan=2 valign=top style='width:114.4pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-bottom-alt:solid #999999 .75pt;mso-border-right-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal align=right style='margin:0cm;margin-bottom:.0001pt;
  text-align:right;text-indent:0cm;line-height:107%'><b style='mso-bidi-font-weight:
  normal'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;line-height:
  107%'>Без налога (НДС)</span></b></p>
      </td>
      <td width=57 valign=top style='width:42.4pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'>—</span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:9;mso-yfti-lastrow:yes;height:15.25pt'>
      <td width=24 valign=top style='width:17.95pt;border-top:none;border-left:
  solid #999999 1.0pt;border-bottom:solid #999999 1.0pt;border-right:none;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-left-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=376 colspan=4 valign=top style='width:281.9pt;border:none;
  border-bottom:solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=94 colspan=2 valign=top style='width:70.6pt;border:none;border-bottom:
  solid #999999 1.0pt;mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:
  solid #999999 .75pt;mso-border-bottom-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;
  margin-left:0cm;text-indent:0cm;line-height:107%'>
          <o:p>&nbsp;</o:p>
        </p>
      </td>
      <td width=153 colspan=2 valign=top style='width:114.4pt;border-top:none;
  border-left:none;border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-top-alt:solid #999999 .75pt;
  mso-border-bottom-alt:solid #999999 .75pt;mso-border-right-alt:solid #999999 .75pt;
  padding:4.9pt 2.65pt 0cm 2.65pt;height:15.25pt'>
        <p class=MsoNormal align=right style='margin:0cm;margin-bottom:.0001pt;
  text-align:right;text-indent:0cm;line-height:107%'><b style='mso-bidi-font-weight:
  normal'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;line-height:
  107%'>Всего к оплате</span></b></p>
      </td>
      <td width=57 valign=top style='width:42.4pt;border-top:none;border-left:none;
  border-bottom:solid #999999 1.0pt;border-right:solid #999999 1.0pt;
  mso-border-top-alt:solid #999999 .75pt;mso-border-left-alt:solid #999999 .75pt;
  mso-border-alt:solid #999999 .75pt;padding:4.9pt 2.65pt 0cm 2.65pt;
  height:15.25pt'>
        <p class=MsoNormal style='margin:0cm;margin-bottom:.0001pt;text-indent:0cm;
  line-height:107%'><span style='font-size:7.5pt;mso-bidi-font-size:11.0pt;
  line-height:107%'><?= $order_info['final_sum'] ?></span></p>
      </td>
    </tr>
    <![if !supportMisalignedColumns]>
    <tr height=0>
      <td width=359 style='border:none'></td>
      <td width=2342 style='border:none'></td>
      <td width=130 style='border:none'></td>
      <td width=2361 style='border:none'></td>
      <td width=805 style='border:none'></td>
      <td width=247 style='border:none'></td>
      <td width=1165 style='border:none'></td>
      <td width=1596 style='border:none'></td>
      <td width=692 style='border:none'></td>
      <td width=848 style='border:none'></td>
    </tr>
    <![endif]>
  </table>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:10.4pt;
margin-left:1.25pt'>Всего наименований: 1, на сумму <?= $order_info['final_sum'] ?> руб. (одна тысяча
    рублей), НДС не облагается на основании п.5.4 Договора</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:56.2pt;
margin-left:1.25pt'><b style='mso-bidi-font-weight:normal'>Внимание!</b> При
    оплате в графе &quot;Назначение платежа&quot; обязательно нужно указать номер
    счета, по которому производится платеж</p>

  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:17.9pt;
margin-left:1.25pt'>
    <img width=250 height=179
         src="Bill_B548694-20719312_Trening-intensiv_'Klyuchevye_sekrety_oratora'.files/image001.jpg"
         align=left hspace=12 v:shapes="Picture_x0020_309"><![endif]>Генеральный
    директор(Карданов И.Р.)</p>

  <p class=MsoNormal style='margin-left:1.25pt'>Главный бухгалтер(Карданов И.Р.)</p>

</div>

</body>

</html>
