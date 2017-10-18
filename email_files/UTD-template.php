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

	$order_info['final_sum'] = number_format($order_info['final_sum'], 2, ',', '');

	$order_date = DateTime::createFromFormat('U', $order_info['created_at']);
	$order_date_parts = array(
		'day' => $order_date->format('d'),
    'month' => $months[$order_date->format('n')],
    'year' => $order_date->format('Y'),
    'year_two_digits' => $order_date->format('y')
  );
	$order_date_str = "{$order_date_parts['day']} {$order_date_parts['month']} {$order_date_parts['year']}";

	$dates_text = array();
	foreach($event_info['dates'] as $date){
		$_date = DateTime::createFromFormat('U', $date['event_date']);
		$dates_text[] = $_date->format('d.m.Y');
	}

	$DIRECTOR_NAME = 'Карданов Инал Русланович';
	$DIRECTOR_NAME_SHORT = 'Карданов И. Р.';

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
href="universalnyj_peredatochnyj_dokument-.files/filelist.xml">
<link rel=Edit-Time-Data
href="universalnyj_peredatochnyj_dokument-.files/editdata.mso">
<!--[if !mso]>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
w\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<![endif]--><!--[if gte mso 9]><xml>
 <o:DocumentProperties>
  <o:Author>КонсультантПлюс</o:Author>
  <o:LastAuthor>Арам Харазян</o:LastAuthor>
  <o:Revision>2</o:Revision>
  <o:TotalTime>2</o:TotalTime>
  <o:LastPrinted>2013-10-29T12:48:00Z</o:LastPrinted>
  <o:Created>2017-10-04T09:58:00Z</o:Created>
  <o:LastSaved>2017-10-04T09:58:00Z</o:LastSaved>
  <o:Pages>1</o:Pages>
  <o:Words>501</o:Words>
  <o:Characters>2860</o:Characters>
  <o:Company>КонсультантПлюс</o:Company>
  <o:Lines>23</o:Lines>
  <o:Paragraphs>6</o:Paragraphs>
  <o:CharactersWithSpaces>3355</o:CharactersWithSpaces>
  <o:Version>16.00</o:Version>
 </o:DocumentProperties>
 <o:OfficeDocumentSettings>
  <o:AllowPNG/>
 </o:OfficeDocumentSettings>
</xml><![endif]-->
<link rel=themeData
href="universalnyj_peredatochnyj_dokument-.files/themedata.thmx">
<link rel=colorSchemeMapping
href="universalnyj_peredatochnyj_dokument-.files/colorschememapping.xml">
<!--[if gte mso 9]><xml>
 <w:WordDocument>
  <w:TrackMoves>false</w:TrackMoves>
  <w:TrackFormatting/>
  <w:DoNotHyphenateCaps/>
  <w:PunctuationKerning/>
  <w:ValidateAgainstSchemas>false</w:ValidateAgainstSchemas>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:DoNotUnderlineInvalidXML/>
  <w:DoNotPromoteQF/>
  <w:LidThemeOther>RU</w:LidThemeOther>
  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
  <w:Compatibility>
   <w:BreakWrappedTables/>
   <w:SnapToGridInCell/>
   <w:WrapTextWithPunct/>
   <w:UseAsianBreakRules/>
   <w:DontGrowAutofit/>
   <w:SplitPgBreakAndParaMark/>
   <w:EnableOpenTypeKerning/>
   <w:DontFlipMirrorIndents/>
   <w:OverrideTableStyleHps/>
  </w:Compatibility>
  <m:mathPr>
   <m:mathFont m:val="Cambria Math"/>
   <m:brkBin m:val="before"/>
   <m:brkBinSub m:val="&#45;-"/>
   <m:smallFrac m:val="off"/>
   <m:dispDef/>
   <m:lMargin m:val="0"/>
   <m:rMargin m:val="0"/>
   <m:defJc m:val="centerGroup"/>
   <m:wrapIndent m:val="1440"/>
   <m:intLim m:val="subSup"/>
   <m:naryLim m:val="undOvr"/>
  </m:mathPr></w:WordDocument>
</xml><![endif]--><!--[if gte mso 9]><xml>
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
  <w:LsdException Locked="false" Priority="35" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="caption"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="macro"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number"/>
  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Default Paragraph Font"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 4"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 5"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Message Header"/>
  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 3"/>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Balloon Text"/>
  <w:LsdException Locked="false" Priority="59" SemiHidden="true"
   UnhideWhenUsed="true" Name="Table Grid"/>
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
  td {
    border: none;
  }
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;
	mso-font-charset:204;
	mso-generic-font-family:roman;
	mso-font-pitch:variable;
	mso-font-signature:-536870145 1107305727 0 0 415 0;}
@font-face
	{font-family:Tahoma;
	panose-1:2 11 6 4 3 5 4 4 2 4;
	mso-font-charset:204;
	mso-generic-font-family:swiss;
	mso-font-pitch:variable;
	mso-font-signature:-520081665 -1073717157 41 0 66047 0;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{mso-style-unhide:no;
	mso-style-qformat:yes;
	mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Times New Roman";}
p.MsoCommentText, li.MsoCommentText, div.MsoCommentText
	{mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-link:"Текст примечания Знак";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:10.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Times New Roman";}
p.MsoHeader, li.MsoHeader, div.MsoHeader
	{mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-link:"Верхний колонтитул Знак";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	tab-stops:center 233.85pt right 467.75pt;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Times New Roman";}
p.MsoFooter, li.MsoFooter, div.MsoFooter
	{mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-link:"Нижний колонтитул Знак";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	tab-stops:center 233.85pt right 467.75pt;
	font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Times New Roman";}
span.MsoCommentReference
	{mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-ansi-font-size:8.0pt;
	mso-bidi-font-size:8.0pt;
	font-family:"Times New Roman",serif;
	mso-bidi-font-family:"Times New Roman";}
p.MsoDocumentMap, li.MsoDocumentMap, div.MsoDocumentMap
	{mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-link:"Схема документа Знак";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	background:navy;
	font-size:10.0pt;
	font-family:"Tahoma",sans-serif;
	mso-fareast-font-family:"Times New Roman";}
p.MsoCommentSubject, li.MsoCommentSubject, div.MsoCommentSubject
	{mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-parent:"Текст примечания";
	mso-style-link:"Тема примечания Знак";
	mso-style-next:"Текст примечания";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:10.0pt;
	font-family:"Times New Roman",serif;
	mso-fareast-font-family:"Times New Roman";
	font-weight:bold;}
p.MsoAcetate, li.MsoAcetate, div.MsoAcetate
	{mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-link:"Текст выноски Знак";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:8.0pt;
	font-family:"Tahoma",sans-serif;
	mso-fareast-font-family:"Times New Roman";}
span.a
	{mso-style-name:"Верхний колонтитул Знак";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:"Верхний колонтитул";
	mso-ansi-font-size:12.0pt;
	mso-bidi-font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-bidi-font-family:"Times New Roman";}
span.a0
	{mso-style-name:"Нижний колонтитул Знак";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:"Нижний колонтитул";
	mso-ansi-font-size:12.0pt;
	mso-bidi-font-size:12.0pt;
	font-family:"Times New Roman",serif;
	mso-bidi-font-family:"Times New Roman";}
span.a1
	{mso-style-name:"Схема документа Знак";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:"Схема документа";
	mso-ansi-font-size:8.0pt;
	mso-bidi-font-size:8.0pt;
	font-family:"Tahoma",sans-serif;
	mso-ascii-font-family:Tahoma;
	mso-hansi-font-family:Tahoma;
	mso-bidi-font-family:Tahoma;}
span.a2
	{mso-style-name:"Текст примечания Знак";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:"Текст примечания";
	mso-ansi-font-size:10.0pt;
	mso-bidi-font-size:10.0pt;
	font-family:"Times New Roman",serif;
	mso-bidi-font-family:"Times New Roman";}
span.a3
	{mso-style-name:"Тема примечания Знак";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-parent:"Текст примечания Знак";
	mso-style-link:"Тема примечания";
	mso-ansi-font-size:10.0pt;
	mso-bidi-font-size:10.0pt;
	font-family:"Times New Roman",serif;
	mso-bidi-font-family:"Times New Roman";
	font-weight:bold;}
span.a4
	{mso-style-name:"Текст выноски Знак";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:"Текст выноски";
	mso-ansi-font-size:8.0pt;
	mso-bidi-font-size:8.0pt;
	font-family:"Tahoma",sans-serif;
	mso-ascii-font-family:Tahoma;
	mso-hansi-font-family:Tahoma;
	mso-bidi-font-family:Tahoma;}
.MsoChpDefault
	{mso-style-type:export-only;
	mso-default-props:yes;}
.MsoPapDefault
	{mso-style-type:export-only;
	margin-bottom:10.0pt;
	line-height:115%;}
 /* Page Definitions */
 @page
	{mso-footnote-separator:url("universalnyj_peredatochnyj_dokument-.files/header.htm") fs;
	mso-footnote-continuation-separator:url("universalnyj_peredatochnyj_dokument-.files/header.htm") fcs;
	mso-endnote-separator:url("universalnyj_peredatochnyj_dokument-.files/header.htm") es;
	mso-endnote-continuation-separator:url("universalnyj_peredatochnyj_dokument-.files/header.htm") ecs;}
@page WordSection1
	{size:841.9pt 595.3pt;
	mso-page-orientation:landscape;
	margin:21.25pt 1.0cm 0cm 1.0cm;
	mso-header-margin:0cm;
	mso-footer-margin:0cm;
	mso-paper-source:0;}
div.WordSection1
	{page:WordSection1;}
-->
</style>
<!--[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:"Обычная таблица";
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
	mso-para-margin-top:0cm;
	mso-para-margin-right:0cm;
	mso-para-margin-bottom:10.0pt;
	mso-para-margin-left:0cm;
	line-height:115%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Times New Roman",serif;}
table.MsoTableGrid
	{mso-style-name:"Сетка таблицы";
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-priority:99;
	mso-style-unhide:no;
	border:solid windowtext 1.0pt;
	mso-border-alt:solid windowtext .5pt;
	mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
	mso-border-insideh:.5pt solid windowtext;
	mso-border-insidev:.5pt solid windowtext;
	mso-para-margin:0cm;
	mso-para-margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:10.0pt;
	font-family:"Times New Roman",serif;}
</style>
<![endif]--><!--[if gte mso 9]><xml>
 <o:shapedefaults v:ext="edit" spidmax="1031"/>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <o:shapelayout v:ext="edit">
  <o:idmap v:ext="edit" data="1"/>
 </o:shapelayout></xml><![endif]-->

  <style>
    @media print{@page {size: landscape}}
  </style>
</head>

<body lang=RU style='tab-interval:35.4pt'>

<div class=WordSection1>

<div align=center>

<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 width=1075
 style='width:806.05pt;border-collapse:collapse;border:none;mso-border-bottom-alt:
 solid windowtext .75pt;mso-yfti-tbllook:480;mso-padding-alt:0cm 0cm 0cm 0cm'>
 <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:26.75pt'>
  <td width=114 colspan=6 rowspan=2 valign=top style='width:85.25pt;border:
  none;border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:
  26.75pt'>
  <p class=MsoNormal style='margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;
  margin-left:5.65pt'><span style='font-size:10.0pt;font-family:"Arial",sans-serif'>Универсальный
  передаточный<br>
  документ<o:p></o:p></span></p>
  </td>
  <td width=460 colspan=28 valign=top style='width:344.65pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:26.75pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><!--[if gte vml 1]><v:group
   id="Group_x0020_3" o:spid="_x0000_s1026" style='position:absolute;left:0;
   text-align:left;margin-left:95.05pt;margin-top:.25pt;width:133.85pt;
   height:22.45pt;z-index:251659264;mso-position-horizontal-relative:text;
   mso-position-vertical-relative:text' coordorigin="3987,431" coordsize="2677,449"
   o:gfxdata="UEsDBBQABgAIAAAAIQC2gziS/gAAAOEBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRQU7DMBBF
90jcwfIWJU67QAgl6YK0S0CoHGBkTxKLZGx5TGhvj5O2G0SRWNoz/78nu9wcxkFMGNg6quQqL6RA
0s5Y6ir5vt9lD1JwBDIwOMJKHpHlpr69KfdHjyxSmriSfYz+USnWPY7AufNIadK6MEJMx9ApD/oD
OlTrorhX2lFEilmcO2RdNtjC5xDF9pCuTyYBB5bi6bQ4syoJ3g9WQ0ymaiLzg5KdCXlKLjvcW893
SUOqXwnz5DrgnHtJTxOsQfEKIT7DmDSUCaxw7Rqn8787ZsmRM9e2VmPeBN4uqYvTtW7jvijg9N/y
JsXecLq0q+WD6m8AAAD//wMAUEsDBBQABgAIAAAAIQA4/SH/1gAAAJQBAAALAAAAX3JlbHMvLnJl
bHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHsDYimMaW0Yy2fr2M4PBMnrbUb/Q94l/f/hMi1qR
JVI2sOt6UJgd+ZiDgffL8ekFlFSbvV0oo4EbChzGx4f9GRdb25HMsYhqlCwG5lrLq9biZkxWOiqY
22YiTra2kYMu1l1tQD30/bPm3wwYN0x18gb45AdQl1tp5j/sFB2T0FQ7R0nTNEV3j6o9feQzro1i
OWA14Fm+Q8a1a8+Bvu/d/dMb2JY5uiPbhG/ktn4cqGU/er3pcvwCAAD//wMAUEsDBBQABgAIAAAA
IQCk/yt+qQMAAF8TAAAOAAAAZHJzL2Uyb0RvYy54bWzsWNtu3DYQfS+QfyD4LuuyklYSLAf2XowC
bhsg6QdwJeqCSKRKcq11g/57h6T2Yi+KFgmwDZDVg0BxyOHMmeHRkLfvd32HnqmQLWc59m88jCgr
eNmyOse/f1o7CUZSEVaSjjOa4xcq8fu7dz/djkNGA97wrqQCgRIms3HIcaPUkLmuLBraE3nDB8pA
WHHREwWfonZLQUbQ3ndu4HmxO3JRDoIXVEroXVohvjP6q4oW6reqklShLsdgmzJvYd4b/XbvbklW
CzI0bTGZQb7Cip60DBY9qFoSRdBWtGeq+rYQXPJK3RS8d3lVtQU1PoA3vvfGm0fBt4Pxpc7GejjA
BNC+wemr1Ra/Pn8QqC0hdhgx0kOIzKpopqEZhzqDEY9i+Dh8ENY/aD7x4rMEsftWrr9rOxhtxl94
CerIVnEDza4SvVYBTqOdicDLIQJ0p1ABnX6cpkkaYVSALEgi349siIoG4qinzdJkjhFIw5m/F62m
2UE8B5meGoapFroks6saSyfLtFuQbPKIp/w2PD82ZKAmTFKjNeEZ7PH8pJ174DsUWkjNII0nUjvo
1shrWKSFFTG+aAir6b0QfGwoKcE64yn4cJhqfZBayb/hfA7YAWx/Fk5I+8EruEg2CKkeKe+RbuRY
wEYyVpLnJ6kssvsh2njG123XQT/JOvaqA0Jge2BVmKplen2zN76kXrpKVknohEG8ckJvuXTu14vQ
idf+PFrOlovF0v9Lr+uHWdOWJWV6mf0+9cP/FreJMewOO+xUybu21Oq0SVLUm0Un0DMBnlibZwLk
ZJj72gyTXuDLG5f8IPQegtRZx8ncCddh5KRzL3E8P31IYy9Mw+X6tUtPLaPf7hIac5xGQWRz6R99
88xz7hvJ+lYBE3dtn+PkMIhkOgNXrDShVaTtbPsECm3+EQoI9z7QJl91itpkVbvNDrToJN7w8gUy
V3DILCBl+H1Ao+HiT4xGoOIcyz+2RFCMup8ZZL/m7X1D7BubfYOwAqbmWGFkmwtl+X07iLZuQLPd
X4zfAxNVrcneoxWGxQwdXIgXZme8YCjuZHNfihdSoHzgyjhOdD7YfWlI+MoLV144UOMleGEqQK70
AJXLGT3EendenB6i0N/XWaZuOaGHIJyqrOBaNlzLhguUDYYeTIV6/G//oNUDHI3sKe1wqpj/X/QQ
2+ohMgZc6cGe/0+OC9dTBdSUF6sepvuK7/dwYa4g4BbHnJWmGyd9TXT6bQ4jx3uxu78BAAD//wMA
UEsDBBQABgAIAAAAIQCpGNQT3QAAAAcBAAAPAAAAZHJzL2Rvd25yZXYueG1sTI9PS8NAEMXvgt9h
GcGb3UQb/8RsSinqqRRsBfE2TaZJaHY2ZLdJ+u2dnvQ2j/d483vZYrKtGqj3jWMD8SwCRVy4suHK
wNfu/e4ZlA/IJbaOycCZPCzy66sM09KN/EnDNlRKStinaKAOoUu19kVNFv3MdcTiHVxvMYjsK132
OEq5bfV9FD1qiw3Lhxo7WtVUHLcna+BjxHH5EL8N6+Nhdf7ZJZvvdUzG3N5My1dQgabwF4YLvqBD
Lkx7d+LSq1b0SxRL1EACSux58iRL9pdjDjrP9H/+/BcAAP//AwBQSwECLQAUAAYACAAAACEAtoM4
kv4AAADhAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAI
AAAAIQA4/SH/1gAAAJQBAAALAAAAAAAAAAAAAAAAAC8BAABfcmVscy8ucmVsc1BLAQItABQABgAI
AAAAIQCk/yt+qQMAAF8TAAAOAAAAAAAAAAAAAAAAAC4CAABkcnMvZTJvRG9jLnhtbFBLAQItABQA
BgAIAAAAIQCpGNQT3QAAAAcBAAAPAAAAAAAAAAAAAAAAAAMGAABkcnMvZG93bnJldi54bWxQSwUG
AAAAAAQABADzAAAADQcAAAAA
">
   <v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">
    <v:stroke joinstyle="miter"/>
    <v:path gradientshapeok="t" o:connecttype="rect"/>
   </v:shapetype><v:shape id="Text_x0020_Box_x0020_4" o:spid="_x0000_s1027"
    type="#_x0000_t202" style='position:absolute;left:3987;top:431;width:1134;
    height:212;visibility:visible;mso-wrap-style:square;v-text-anchor:top'
    o:gfxdata="UEsDBBQABgAIAAAAIQDb4fbL7gAAAIUBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbHyQz07DMAyH
70i8Q+QralM4IITa7kDhCAiNB7ASt43WOlEcyvb2pNu4IODoPz9/n1xv9vOkForiPDdwXVagiI23
jocG3rdPxR0oScgWJ8/UwIEENu3lRb09BBKV0ywNjCmFe63FjDSjlD4Q50nv44wpl3HQAc0OB9I3
VXWrjedEnIq03oC27qjHjympx31un0wiTQLq4bS4shrAECZnMGVTvbD9QSnOhDInjzsyuiBXWQP0
r4R18jfgnHvJr4nOknrFmJ5xzhraRtHWf3Kkpfz/yGo5S+H73hkquyhdjr3R8m2lj09svwAAAP//
AwBQSwMEFAAGAAgAAAAhAFr0LFu/AAAAFQEAAAsAAABfcmVscy8ucmVsc2zPwWrDMAwG4Ptg72B0
X5TuUMaI01uh19I+gLGVxCy2jGSy9e1nemrHjpL4P0nD4SetZiPRyNnCruvBUPYcYp4tXC/Htw8w
Wl0ObuVMFm6kcBhfX4Yzra62kC6xqGlKVgtLreUTUf1CyWnHhXKbTCzJ1VbKjMX5LzcTvvf9HuXR
gPHJNKdgQU5hB+ZyK23zHztFL6w81c5zQp6m6P9TMfB3PtPWFCczVQtB9N4U2rp2HOA44NMz4y8A
AAD//wMAUEsDBBQABgAIAAAAIQDYjpdbwgAAANoAAAAPAAAAZHJzL2Rvd25yZXYueG1sRI9Bi8Iw
FITvwv6H8Bb2pqkeRLtGEVlBEBZrPXh82zzbYPPSbaLWf28EweMwM98ws0Vna3Gl1hvHCoaDBARx
4bThUsEhX/cnIHxA1lg7JgV38rCYf/RmmGp344yu+1CKCGGfooIqhCaV0hcVWfQD1xBH7+RaiyHK
tpS6xVuE21qOkmQsLRqOCxU2tKqoOO8vVsHyyNmP+f/922WnzOT5NOHt+KzU12e3/AYRqAvv8Ku9
0QpG8LwSb4CcPwAAAP//AwBQSwECLQAUAAYACAAAACEA2+H2y+4AAACFAQAAEwAAAAAAAAAAAAAA
AAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQBa9CxbvwAAABUBAAALAAAA
AAAAAAAAAAAAAB8BAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQDYjpdbwgAAANoAAAAPAAAA
AAAAAAAAAAAAAAcCAABkcnMvZG93bnJldi54bWxQSwUGAAAAAAMAAwC3AAAA9gIAAAAA
" filled="f" stroked="f">
    <v:textbox inset="0,0,0,0">
     <![if !mso]>
     <table cellpadding=0 cellspacing=0 width="100%">
      <tr>
       <td><![endif]>
       <div>
       <p class=MsoNormal align=center style='text-align:center'><span
       lang=EN-US style='font-size:10.0pt;font-family:"Arial",sans-serif;
       mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
       </div>
       <![if !mso]></td>
      </tr>
     </table>
     <![endif]></v:textbox>
   </v:shape><v:shape id="Text_x0020_Box_x0020_5" o:spid="_x0000_s1028" type="#_x0000_t202"
    style='position:absolute;left:3991;top:668;width:1134;height:212;
    visibility:visible;mso-wrap-style:square;v-text-anchor:top' o:gfxdata="UEsDBBQABgAIAAAAIQDb4fbL7gAAAIUBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbHyQz07DMAyH
70i8Q+QralM4IITa7kDhCAiNB7ASt43WOlEcyvb2pNu4IODoPz9/n1xv9vOkForiPDdwXVagiI23
jocG3rdPxR0oScgWJ8/UwIEENu3lRb09BBKV0ywNjCmFe63FjDSjlD4Q50nv44wpl3HQAc0OB9I3
VXWrjedEnIq03oC27qjHjympx31un0wiTQLq4bS4shrAECZnMGVTvbD9QSnOhDInjzsyuiBXWQP0
r4R18jfgnHvJr4nOknrFmJ5xzhraRtHWf3Kkpfz/yGo5S+H73hkquyhdjr3R8m2lj09svwAAAP//
AwBQSwMEFAAGAAgAAAAhAFr0LFu/AAAAFQEAAAsAAABfcmVscy8ucmVsc2zPwWrDMAwG4Ptg72B0
X5TuUMaI01uh19I+gLGVxCy2jGSy9e1nemrHjpL4P0nD4SetZiPRyNnCruvBUPYcYp4tXC/Htw8w
Wl0ObuVMFm6kcBhfX4Yzra62kC6xqGlKVgtLreUTUf1CyWnHhXKbTCzJ1VbKjMX5LzcTvvf9HuXR
gPHJNKdgQU5hB+ZyK23zHztFL6w81c5zQp6m6P9TMfB3PtPWFCczVQtB9N4U2rp2HOA44NMz4y8A
AAD//wMAUEsDBBQABgAIAAAAIQC3wjLAwwAAANoAAAAPAAAAZHJzL2Rvd25yZXYueG1sRI9Ba8JA
FITvBf/D8gRvdWMFqdFVRCwUhGKMB4/P7DNZzL6N2a3Gf98VCh6HmfmGmS87W4sbtd44VjAaJiCI
C6cNlwoO+df7JwgfkDXWjknBgzwsF723Oaba3Tmj2z6UIkLYp6igCqFJpfRFRRb90DXE0Tu71mKI
si2lbvEe4baWH0kykRYNx4UKG1pXVFz2v1bB6sjZxlx/TrvsnJk8nya8nVyUGvS71QxEoC68wv/t
b61gDM8r8QbIxR8AAAD//wMAUEsBAi0AFAAGAAgAAAAhANvh9svuAAAAhQEAABMAAAAAAAAAAAAA
AAAAAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAYACAAAACEAWvQsW78AAAAVAQAACwAA
AAAAAAAAAAAAAAAfAQAAX3JlbHMvLnJlbHNQSwECLQAUAAYACAAAACEAt8IywMMAAADaAAAADwAA
AAAAAAAAAAAAAAAHAgAAZHJzL2Rvd25yZXYueG1sUEsFBgAAAAADAAMAtwAAAPcCAAAAAA==
" filled="f" stroked="f">
    <v:textbox inset="0,0,0,0">
     <![if !mso]>
     <table cellpadding=0 cellspacing=0 width="100%">
      <tr>
       <td><![endif]>
       <div>
       <p class=MsoNormal align=center style='text-align:center'><span
       lang=EN-US style='font-size:10.0pt;font-family:"Arial",sans-serif;
       mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
       </div>
       <![if !mso]></td>
      </tr>
     </table>
     <![endif]></v:textbox>
   </v:shape><v:shape id="Text_x0020_Box_x0020_6" o:spid="_x0000_s1029" type="#_x0000_t202"
    style='position:absolute;left:5417;top:434;width:1247;height:212;
    visibility:visible;mso-wrap-style:square;v-text-anchor:top' o:gfxdata="UEsDBBQABgAIAAAAIQDb4fbL7gAAAIUBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbHyQz07DMAyH
70i8Q+QralM4IITa7kDhCAiNB7ASt43WOlEcyvb2pNu4IODoPz9/n1xv9vOkForiPDdwXVagiI23
jocG3rdPxR0oScgWJ8/UwIEENu3lRb09BBKV0ywNjCmFe63FjDSjlD4Q50nv44wpl3HQAc0OB9I3
VXWrjedEnIq03oC27qjHjympx31un0wiTQLq4bS4shrAECZnMGVTvbD9QSnOhDInjzsyuiBXWQP0
r4R18jfgnHvJr4nOknrFmJ5xzhraRtHWf3Kkpfz/yGo5S+H73hkquyhdjr3R8m2lj09svwAAAP//
AwBQSwMEFAAGAAgAAAAhAFr0LFu/AAAAFQEAAAsAAABfcmVscy8ucmVsc2zPwWrDMAwG4Ptg72B0
X5TuUMaI01uh19I+gLGVxCy2jGSy9e1nemrHjpL4P0nD4SetZiPRyNnCruvBUPYcYp4tXC/Htw8w
Wl0ObuVMFm6kcBhfX4Yzra62kC6xqGlKVgtLreUTUf1CyWnHhXKbTCzJ1VbKjMX5LzcTvvf9HuXR
gPHJNKdgQU5hB+ZyK23zHztFL6w81c5zQp6m6P9TMfB3PtPWFCczVQtB9N4U2rp2HOA44NMz4y8A
AAD//wMAUEsDBBQABgAIAAAAIQA4K6q0wwAAANoAAAAPAAAAZHJzL2Rvd25yZXYueG1sRI9Ba8JA
FITvBf/D8gRvdWMRqdFVRCwUhGKMB4/P7DNZzL6N2a3Gf98VCh6HmfmGmS87W4sbtd44VjAaJiCI
C6cNlwoO+df7JwgfkDXWjknBgzwsF723Oaba3Tmj2z6UIkLYp6igCqFJpfRFRRb90DXE0Tu71mKI
si2lbvEe4baWH0kykRYNx4UKG1pXVFz2v1bB6sjZxlx/TrvsnJk8nya8nVyUGvS71QxEoC68wv/t
b61gDM8r8QbIxR8AAAD//wMAUEsBAi0AFAAGAAgAAAAhANvh9svuAAAAhQEAABMAAAAAAAAAAAAA
AAAAAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAYACAAAACEAWvQsW78AAAAVAQAACwAA
AAAAAAAAAAAAAAAfAQAAX3JlbHMvLnJlbHNQSwECLQAUAAYACAAAACEAOCuqtMMAAADaAAAADwAA
AAAAAAAAAAAAAAAHAgAAZHJzL2Rvd25yZXYueG1sUEsFBgAAAAADAAMAtwAAAPcCAAAAAA==
" filled="f" stroked="f">
    <v:textbox inset="0,0,0,0">
     <![if !mso]>
     <table cellpadding=0 cellspacing=0 width="100%">
      <tr>
       <td><![endif]>
       <div>
       <p class=MsoNormal align=center style='text-align:center'><span
       lang=EN-US style='font-size:10.0pt;font-family:"Arial",sans-serif;
       mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
       </div>
       <![if !mso]></td>
      </tr>
     </table>
     <![endif]></v:textbox>
   </v:shape><v:shape id="Text_x0020_Box_x0020_7" o:spid="_x0000_s1030" type="#_x0000_t202"
    style='position:absolute;left:5416;top:657;width:1247;height:212;
    visibility:visible;mso-wrap-style:square;v-text-anchor:top' o:gfxdata="UEsDBBQABgAIAAAAIQDb4fbL7gAAAIUBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbHyQz07DMAyH
70i8Q+QralM4IITa7kDhCAiNB7ASt43WOlEcyvb2pNu4IODoPz9/n1xv9vOkForiPDdwXVagiI23
jocG3rdPxR0oScgWJ8/UwIEENu3lRb09BBKV0ywNjCmFe63FjDSjlD4Q50nv44wpl3HQAc0OB9I3
VXWrjedEnIq03oC27qjHjympx31un0wiTQLq4bS4shrAECZnMGVTvbD9QSnOhDInjzsyuiBXWQP0
r4R18jfgnHvJr4nOknrFmJ5xzhraRtHWf3Kkpfz/yGo5S+H73hkquyhdjr3R8m2lj09svwAAAP//
AwBQSwMEFAAGAAgAAAAhAFr0LFu/AAAAFQEAAAsAAABfcmVscy8ucmVsc2zPwWrDMAwG4Ptg72B0
X5TuUMaI01uh19I+gLGVxCy2jGSy9e1nemrHjpL4P0nD4SetZiPRyNnCruvBUPYcYp4tXC/Htw8w
Wl0ObuVMFm6kcBhfX4Yzra62kC6xqGlKVgtLreUTUf1CyWnHhXKbTCzJ1VbKjMX5LzcTvvf9HuXR
gPHJNKdgQU5hB+ZyK23zHztFL6w81c5zQp6m6P9TMfB3PtPWFCczVQtB9N4U2rp2HOA44NMz4y8A
AAD//wMAUEsDBBQABgAIAAAAIQBXZw8vwwAAANoAAAAPAAAAZHJzL2Rvd25yZXYueG1sRI9Ba8JA
FITvBf/D8gRvdWNBqdFVRCwUhGKMB4/P7DNZzL6N2a3Gf98VCh6HmfmGmS87W4sbtd44VjAaJiCI
C6cNlwoO+df7JwgfkDXWjknBgzwsF723Oaba3Tmj2z6UIkLYp6igCqFJpfRFRRb90DXE0Tu71mKI
si2lbvEe4baWH0kykRYNx4UKG1pXVFz2v1bB6sjZxlx/TrvsnJk8nya8nVyUGvS71QxEoC68wv/t
b61gDM8r8QbIxR8AAAD//wMAUEsBAi0AFAAGAAgAAAAhANvh9svuAAAAhQEAABMAAAAAAAAAAAAA
AAAAAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAYACAAAACEAWvQsW78AAAAVAQAACwAA
AAAAAAAAAAAAAAAfAQAAX3JlbHMvLnJlbHNQSwECLQAUAAYACAAAACEAV2cPL8MAAADaAAAADwAA
AAAAAAAAAAAAAAAHAgAAZHJzL2Rvd25yZXYueG1sUEsFBgAAAAADAAMAtwAAAPcCAAAAAA==
" filled="f" stroked="f">
    <v:textbox inset="0,0,0,0">
     <![if !mso]>
     <table cellpadding=0 cellspacing=0 width="100%">
      <tr>
       <td><![endif]>
       <div>
       <p class=MsoNormal align=center style='text-align:center'><span
       lang=EN-US style='font-size:10.0pt;font-family:"Arial",sans-serif;
       mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
       </div>
       <![if !mso]></td>
      </tr>
     </table>
     <![endif]></v:textbox>
   </v:shape></v:group><![endif]--><span
  style='font-size:10.0pt;font-family:"Arial",sans-serif'>Счет-фактура №<span
        style='mso-spacerun:yes'>    </span><span style="text-decoration: underline;">0<?=$order_info['number']?></span> от <span style="text-decoration: underline;"><?=$order_date_str?> (1)</span><o:p></o:p></span></p>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:10.0pt;
  font-family:"Arial",sans-serif'>Исправление №<span
  style='mso-spacerun:yes'>     </span>__________ от ___________ (1а)<o:p></o:p></span></p>
  </td>
  <td width=502 colspan=20 valign=top style='width:376.15pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:26.75pt'>
  <p class=MsoNormal align=right style='text-align:right'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Приложение № 1<o:p></o:p></span></p>
  <p class=MsoNormal align=right style='text-align:right'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>к постановлению
  Правительства Российской Федерации<o:p></o:p></span></p>
  <p class=MsoNormal align=right style='text-align:right'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>от 26 декабря 2011 г.
  № 1137<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:1;height:10.3pt'>
  <td width=196 colspan=9 valign=bottom style='width:146.75pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:10.3pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><b><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Продавец</span></b><span style='font-size:
  8.0pt;font-family:"Arial",sans-serif'><o:p></o:p></span></p>
  </td>
  <td width=8 colspan=2 valign=bottom style='width:6.35pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:10.3pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=712 colspan=33 valign=bottom style='width:534.2pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:10.3pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>ООО
  &quot;ЭВЕНДЕЙТ&quot;<o:p></o:p></span></p>
  </td>
  <td width=9 valign=bottom style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:10.3pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 valign=bottom style='width:27.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:10.3pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(2)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:2;height:11.4pt'>
  <td width=114 colspan=6 valign=top style='width:85.25pt;border:none;
  border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:11.4pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:6.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=196 colspan=9 valign=bottom style='width:146.75pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:11.4pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Адрес<o:p></o:p></span></p>
  </td>
  <td width=8 colspan=2 valign=bottom style='width:6.35pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:11.4pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=712 colspan=33 valign=bottom style='width:534.2pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .75pt;
  mso-border-top-alt:solid windowtext .75pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:11.4pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>Кабардино-Балкарская
  Респ, Черекский р-н, село Аушигер, ул Бицуева А.Б., д 70<o:p></o:p></span></p>
  </td>
  <td width=9 valign=bottom style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.4pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 valign=bottom style='width:27.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:11.4pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(2а)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:3;height:8.7pt'>
  <td width=44 colspan=4 valign=top style='width:32.85pt;border:none;
  border-right:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:8.7pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Статус:</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><o:p></o:p></span></p>
  </td>
  <td width=32 valign=top style='width:23.85pt;border:solid windowtext 1.5pt;
  border-left:none;mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;
  height:8.7pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>2</o:p></span></p>
  </td>
  <td width=38 valign=top style='width:28.55pt;border:none;border-right:solid windowtext 2.25pt;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;
  height:8.7pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=196 colspan=9 valign=bottom style='width:146.75pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:8.7pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>ИНН/КПП продавца<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 valign=bottom style='width:7.05pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.7pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 valign=bottom style='width:533.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.7pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>0706005473</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>/070601001<o:p></o:p></span></p>
  </td>
  <td width=9 valign=bottom style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.7pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 valign=bottom style='width:27.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.7pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(2б)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:4;height:11.35pt'>
  <td width=114 colspan=6 valign=top style='width:85.25pt;border:none;
  border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:11.35pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:6.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=196 colspan=9 style='width:146.75pt;border:none;mso-border-left-alt:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:11.35pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Грузоотправитель и его адрес<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 style='width:7.05pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 style='width:533.5pt;border:none;border-bottom:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext .75pt;mso-border-top-alt:solid windowtext .75pt;
  mso-border-bottom-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>–<o:p></o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(3)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:5;height:11.45pt'>
  <td width=114 colspan=6 rowspan=6 valign=top style='width:85.25pt;border:
  none;border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:
  11.45pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:6.0pt;
  font-family:"Arial",sans-serif'>1 – счет-фактура и передаточный документ
  (акт)<br>
  2 – передаточный документ (акт)<o:p></o:p></span></p>
  </td>
  <td width=196 colspan=9 style='width:146.75pt;border:none;mso-border-left-alt:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:11.45pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Грузополучатель и его адрес<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 style='width:7.05pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 style='width:533.5pt;border:none;border-bottom:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext .75pt;mso-border-top-alt:solid windowtext .75pt;
  mso-border-bottom-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>–<o:p></o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(4)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:6;height:11.45pt'>
  <td width=196 colspan=9 style='width:146.75pt;border:none;mso-border-left-alt:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:11.45pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>К платежно-расчетному документу<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 style='width:7.05pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=17 style='width:12.6pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>№<o:p></o:p></span></p>
  </td>
  <td width=52 colspan=8 style='width:39.2pt;border:none;border-bottom:solid windowtext 1.0pt;
  mso-border-bottom-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p><?=$order_info['doc_number']?></o:p></span></p>
  </td>
  <td width=20 colspan=1 style='width:14.65pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>от<o:p></o:p></span></p>
  </td>
  <td width=623 colspan=23 style='width:467.05pt;border:none;border-bottom:
  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:11.45pt'>
  <p class=MsoNormal><span lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;
  mso-ansi-language:EN-US'><o:p><?=$order_date_str?></o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.45pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(5)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:7;height:7.85pt'>
  <td width=196 colspan=9 valign=bottom style='width:146.75pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:7.85pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><b><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Покупатель</span></b><span style='font-size:
  8.0pt;font-family:"Arial",sans-serif'><o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 valign=bottom style='width:7.05pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.85pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 valign=bottom style='width:533.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.85pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$legal_entity['company_name']?> &nbsp;</o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.85pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.85pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(6)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:8;height:6.35pt'>
  <td width=196 colspan=9 valign=bottom style='width:146.75pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:6.35pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Адрес<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 valign=bottom style='width:7.05pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:6.35pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 valign=bottom style='width:533.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .75pt;
  mso-border-top-alt:solid windowtext .75pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:6.35pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$legal_entity['company_address']?>&nbsp;</o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:6.35pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:6.35pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(6а)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:9;height:8.25pt'>
  <td width=196 colspan=9 valign=bottom style='width:146.75pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:8.25pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>ИНН/КПП покупателя<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 valign=bottom style='width:7.05pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.25pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 valign=bottom style='width:533.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .75pt;
  mso-border-top-alt:solid windowtext .75pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.25pt'>
  <p class=MsoNormal><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$legal_entity['company_inn'] . '/' . $legal_entity['company_kpp']?>&nbsp;</o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.25pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.25pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(6б)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:10;height:11.35pt'>
  <td width=196 colspan=9 style='width:146.75pt;border:none;mso-border-left-alt:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:11.35pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Валюта: наименование, код<o:p></o:p></span></p>
  </td>
  <td width=9 colspan=3 style='width:7.05pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal><span lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;
  mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=711 colspan=32 style='width:533.5pt;border:none;border-bottom:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext .75pt;mso-border-top-alt:solid windowtext .75pt;
  mso-border-bottom-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal><span lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;
  mso-ansi-language:EN-US'>Российский рубль, 643<o:p></o:p></span></p>
  </td>
  <td width=9 style='width:6.4pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:11.35pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>(7)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:11;height:3.25pt'>
  <td width=114 colspan=6 valign=top style='width:85.25pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal><span style='font-size:3.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=196 colspan=9 valign=top style='width:146.75pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal><span style='font-size:3.0pt;font-family:"Arial",sans-serif;
  background:yellow;mso-highlight:yellow'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=223 colspan=14 style='width:166.95pt;border:none;border-bottom:
  solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:3.0pt;font-family:"Arial",sans-serif;background:yellow;
  mso-highlight:yellow'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=41 colspan=5 style='width:30.95pt;border:none;border-bottom:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:3.0pt;font-family:"Arial",sans-serif;background:yellow;
  mso-highlight:yellow'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=127 colspan=4 valign=top style='width:95.35pt;border:none;
  border-bottom:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal><span style='font-size:3.0pt;font-family:"Arial",sans-serif;
  background:yellow;mso-highlight:yellow'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=338 colspan=13 style='width:253.7pt;border:none;border-bottom:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:3.0pt;font-family:"Arial",sans-serif;background:yellow;
  mso-highlight:yellow'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 style='width:27.1pt;border:none;border-bottom:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:3.25pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:3.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:12;height:26.2pt'>
  <td width=35 colspan=3 rowspan=2 style='width:26.45pt;border:solid windowtext 1.0pt;
  border-top:none;mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;
  height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>№</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><br>
  </span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>п/п<o:p></o:p></span></p>
  </td>
  <td width=78 colspan=3 rowspan=2 style='width:58.8pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 2.25pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Код<span
  style='mso-spacerun:yes'>  </span>товара/ работ, услуг<o:p></o:p></span></p>
  </td>
  <td width=195 colspan=8 rowspan=2 style='width:146.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Наименование товара
  (описание выполненных работ, оказанных услуг), имущественного права<o:p></o:p></span></p>
  </td>
  <td width=96 colspan=10 style='width:72.3pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Единица измерения<o:p></o:p></span></p>
  </td>
  <td width=58 colspan=3 rowspan=2 style='width:43.5pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Количе</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>­</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>ство
  (объем)<o:p></o:p></span></p>
  </td>
  <td width=70 colspan=3 rowspan=2 style='width:52.2pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='margin-right:-.75pt;text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Цена <br>
  (тариф) за</span><span lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;
  mso-ansi-language:EN-US'>&nbsp;</span><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>единицу измерения<o:p></o:p></span></p>
  </td>
  <td width=87 colspan=5 rowspan=2 style='width:65.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Стоимость товаров <br>
  (работ, услуг), имуществен­ных прав без налога – всего<o:p></o:p></span></p>
  </td>
  <td width=46 colspan=2 rowspan=2 style='width:34.35pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>В том числе сумма
  акциза<o:p></o:p></span></p>
  </td>
  <td width=43 colspan=2 rowspan=2 style='width:32.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Нало говая ставка<o:p></o:p></span></p>
  </td>
  <td width=80 colspan=3 rowspan=2 style='width:59.65pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Сумма </span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><br>
  </span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>налога,
  предъявля</span><span lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;
  mso-ansi-language:EN-US'>­</span><span style='font-size:8.0pt;font-family:
  "Arial",sans-serif'>емая покупателю<o:p></o:p></span></p>
  </td>
  <td width=97 colspan=4 rowspan=2 style='width:72.6pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Стоимость товаров
  (работ, услуг), имущественных прав с налогом - всего<o:p></o:p></span></p>
  </td>
  <td width=105 colspan=3 style='width:78.4pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Страна происхождения
  товара<o:p></o:p></span></p>
  </td>
  <td width=85 colspan=5 rowspan=2 style='width:63.6pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:26.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Номер таможенной
  декларации<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:13;height:6.9pt'>
  <td width=38 colspan=6 style='width:28.45pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:6.9pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>код<o:p></o:p></span></p>
  </td>
  <td width=58 colspan=4 style='width:43.85pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:6.9pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>услов</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>­</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>ное
  обозна</span><span lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;
  mso-ansi-language:EN-US'>­</span><span style='font-size:8.0pt;font-family:
  "Arial",sans-serif'>чение (нацио</span><span lang=EN-US style='font-size:
  8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>­</span><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>нальное)<o:p></o:p></span></p>
  </td>
  <td width=36 colspan=2 style='width:27.3pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:6.9pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Циф</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>­</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>ро</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>­</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>вой
  код<o:p></o:p></span></p>
  </td>
  <td width=68 style='width:51.1pt;border-top:none;border-left:none;border-bottom:
  solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:
  solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;padding:
  0cm 0cm 0cm 0cm;height:6.9pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Краткое наиме</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>­</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>нование<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:14;height:8.5pt'>
  <td width=35 colspan=3 style='width:26.45pt;border:solid windowtext 1.0pt;
  border-top:none;mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;
  height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>А<o:p></o:p></span></p>
  </td>
  <td width=78 colspan=3 style='width:58.8pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 2.25pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Б<o:p></o:p></span></p>
  </td>
  <td width=195 colspan=8 style='width:146.4pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>1<o:p></o:p></span></p>
  </td>
  <td width=38 colspan=6 style='width:28.45pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>2<o:p></o:p></span></p>
  </td>
  <td width=58 colspan=4 style='width:43.85pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>2а<o:p></o:p></span></p>
  </td>
  <td width=58 colspan=3 style='width:43.5pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>3<o:p></o:p></span></p>
  </td>
  <td width=70 colspan=3 style='width:52.2pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>4<o:p></o:p></span></p>
  </td>
  <td width=87 colspan=5 style='width:65.4pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>5<o:p></o:p></span></p>
  </td>
  <td width=46 colspan=2 style='width:34.35pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>6<o:p></o:p></span></p>
  </td>
  <td width=43 colspan=2 style='width:32.4pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>7<o:p></o:p></span></p>
  </td>
  <td width=80 colspan=3 style='width:59.65pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>8<o:p></o:p></span></p>
  </td>
  <td width=97 colspan=4 style='width:72.6pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>9<o:p></o:p></span></p>
  </td>
  <td width=36 colspan=2 style='width:27.3pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>10<o:p></o:p></span></p>
  </td>
  <td width=68 style='width:51.1pt;border-top:none;border-left:none;border-bottom:
  solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;mso-border-top-alt:
  solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;padding:
  0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>10а<o:p></o:p></span></p>
  </td>
  <td width=85 colspan=5 style='width:63.6pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:8.5pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>11<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:19;height:9.15pt'>
  <td width=35 colspan=3 valign=top style='width:26.45pt;border:solid windowtext 1.0pt;
  border-top:none;mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;
  height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>1&nbsp;</o:p></span></p>
  </td>
  <td width=78 colspan=3 valign=top style='width:58.8pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 2.25pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-no-proof:yes'><o:p>Оферта&nbsp;</o:p></span></b></p>
  </td>
  <td width=195 colspan=8 valign=top style='width:146.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><b><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif;mso-no-proof:yes'><o:p>Услуги по оформлению для указанных Заказчиком лиц электронных билетов на мероприятие
&nbsp;</o:p></span></b></p>
  </td>
  <td width=38 colspan=6 valign=top style='width:28.45pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>796&nbsp;</o:p></span></p>
  </td>
  <td width=58 colspan=4 valign=top style='width:43.85pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-no-proof:yes'><o:p>шт&nbsp;</o:p></span></p>
  </td>
  <td width=58 colspan=3 valign=top style='width:43.5pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><b><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-no-proof:yes'><o:p>1,00&nbsp;</o:p></span></b></p>
  </td>
  <td width=70 colspan=3 valign=top style='width:52.2pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$order_info['final_sum']?>&nbsp;</o:p></span></p>
  </td>
  <td width=87 colspan=5 valign=top style='width:65.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-no-proof:yes'><o:p><?=$order_info['final_sum']?>&nbsp;</o:p></span></p>
  </td>
  <td width=46 colspan=2 valign=top style='width:34.35pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-no-proof:yes'><o:p>Без акциза&nbsp;</o:p></span></p>
  </td>
  <td width=43 colspan=2 valign=top style='width:32.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>0%&nbsp;</o:p></span></p>
  </td>
  <td width=80 colspan=3 valign=top style='width:59.65pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>0,00&nbsp;</o:p></span></p>
  </td>
  <td width=97 colspan=4 valign=top style='width:72.6pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$order_info['final_sum']?>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=2 valign=top style='width:27.3pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>0&nbsp;</o:p></span></p>
  </td>
  <td width=68 valign=top style='width:51.1pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>-&nbsp;</o:p></span></p>
  </td>
  <td width=85 colspan=5 valign=top style='width:63.6pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>-&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:20;height:9.15pt'>
  <td width=35 colspan=3 valign=top style='width:26.45pt;border:solid windowtext 1.0pt;
  border-top:none;mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;
  height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=78 colspan=3 valign=top style='width:58.8pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 2.25pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=419 colspan=24 valign=top style='width:314.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><b><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>Всего
  к оплате</span></b><b><span style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p></o:p></span></b></p>
  </td>
  <td width=87 colspan=5 valign=top style='width:65.4pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$order_info['final_sum']?>&nbsp;</o:p></span></p>
  </td>
  <td width=89 colspan=4 valign=top style='width:66.75pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>Х<o:p></o:p></span></p>
  </td>
  <td width=80 colspan=3 valign=top style='width:59.65pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>0,00&nbsp;</o:p></span></p>
  </td>
  <td width=97 colspan=4 valign=top style='width:72.6pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=2 valign=top style='width:27.3pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=68 valign=top style='width:51.1pt;border-top:none;border-left:none;
  border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=85 colspan=5 valign=top style='width:63.6pt;border-top:none;
  border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:9.15pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:21;height:5.95pt'>
  <td width=114 colspan=6 valign=top style='width:85.25pt;border:none;
  border-right:solid windowtext 2.25pt;mso-border-top-alt:solid windowtext 1.0pt;
  padding:0cm 0cm 0cm 0cm;height:5.95pt'>
  <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=195 colspan=8 valign=top style='width:146.4pt;border:none;
  mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:5.95pt'>
  <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=96 colspan=10 valign=top style='width:72.3pt;border:none;
  mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:
  5.95pt'>
  <p class=MsoNormal style='margin-right:-5.4pt'><span style='font-size:4.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=168 colspan=10 valign=top style='width:125.95pt;border:none;
  mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:
  5.95pt'>
  <p class=MsoNormal style='margin-right:-5.4pt'><span style='font-size:4.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=180 colspan=7 valign=top style='width:134.95pt;border:none;
  mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:
  5.95pt'>
  <p class=MsoNormal style='margin-right:-5.4pt'><span style='font-size:4.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=117 colspan=3 valign=top style='width:87.45pt;border:none;
  mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:
  5.95pt'>
  <p class=MsoNormal style='margin-right:-5.4pt'><span style='font-size:4.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=205 colspan=10 valign=top style='width:153.75pt;border:none;
  mso-border-top-alt:solid windowtext 1.0pt;padding:0cm 0cm 0cm 0cm;height:
  5.95pt'>
  <p class=MsoNormal style='margin-right:-5.4pt'><span style='font-size:4.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:22;height:8.95pt'>
  <td width=114 colspan=6 valign=bottom style='width:85.25pt;border:none;
  border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Документ</span><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><br>
  </span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>составлен</span><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>
  </span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>на</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><o:p></o:p></span></p>
  </td>
  <td width=195 colspan=8 style='width:146.4pt;border:none;mso-border-left-alt:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Руководитель организации <br>
  или иное уполномоченное лицо<o:p></o:p></span></p>
  </td>
  <td width=4 colspan=2 valign=bottom style='width:3.2pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=87 colspan=7 valign=bottom style='width:65.05pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=5 valign=bottom style='width:4.05pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=5 colspan=2 valign=bottom style='width:3.65pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=157 colspan=7 valign=bottom style='width:117.6pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$DIRECTOR_NAME?>&nbsp;</o:p></span></p>
  </td>
  <td width=6 valign=bottom style='width:4.7pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=180 colspan=7 style='width:134.95pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Главный бухгалтер <br>
  или иное уполномоченное лицо<o:p></o:p></span></p>
  </td>
  <td width=117 colspan=3 valign=bottom style='width:87.45pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=16 colspan=3 valign=bottom style='width:12.25pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=175 colspan=6 valign=bottom style='width:130.9pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$DIRECTOR_NAME?>&nbsp;</o:p></span></p>
  </td>
  <td width=14 valign=bottom style='width:10.6pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:23;height:8.95pt'>
  <td width=7 valign=bottom style='width:5.55pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:6.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 valign=bottom style='width:27.3pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>1&nbsp;</o:p></span></p>
  </td>
  <td width=70 colspan=2 valign=bottom style='width:52.4pt;border:none;
  border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal style='margin-left:2.85pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>листах</span><span style='font-size:6.0pt;
  font-family:"Arial",sans-serif'><o:p></o:p></span></p>
  </td>
  <td width=195 colspan=8 valign=top style='width:146.4pt;border:none;
  mso-border-left-alt:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=96 colspan=10 valign=top style='width:72.3pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
  </td>
  <td width=168 colspan=10 valign=top style='width:125.95pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о.)<o:p></o:p></span></p>
  </td>
  <td width=180 colspan=7 valign=top style='width:134.95pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=117 colspan=3 valign=top style='width:87.45pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
  </td>
  <td width=205 colspan=10 valign=top style='width:153.75pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о.)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:24;height:8.95pt'>
  <td width=114 colspan=6 valign=top style='width:85.25pt;border:none;
  border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=195 colspan=8 style='width:146.4pt;border:none;mso-border-left-alt:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Индивидуальный предприниматель<span
  style='color:#339966'><o:p></o:p></span></span></p>
  </td>
  <td width=4 colspan=2 valign=bottom style='width:3.2pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=86 colspan=6 valign=bottom style='width:64.35pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=6 colspan=2 valign=bottom style='width:4.75pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=5 colspan=2 valign=bottom style='width:3.65pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=157 colspan=7 valign=bottom style='width:117.6pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=6 valign=bottom style='width:4.7pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=69 colspan=2 style='width:51.7pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal style='margin-right:-5.4pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=24 valign=bottom style='width:17.8pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=395 colspan=16 valign=bottom style='width:296.05pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=14 valign=bottom style='width:10.6pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:25;height:8.95pt'>
  <td width=114 colspan=6 valign=top style='width:85.25pt;border:none;
  border-right:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:6.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=195 colspan=8 valign=top style='width:146.4pt;border:none;
  border-bottom:solid windowtext 2.25pt;mso-border-left-alt:solid windowtext 2.25pt;
  padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=96 colspan=10 valign=top style='width:72.3pt;border:none;
  border-bottom:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
  </td>
  <td width=168 colspan=10 valign=top style='width:125.95pt;border:none;
  border-bottom:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о.)<o:p></o:p></span></p>
  </td>
  <td width=69 colspan=2 valign=top style='width:51.7pt;border:none;border-bottom:
  solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=433 colspan=18 valign=top style='width:324.45pt;border:none;
  border-bottom:solid windowtext 2.25pt;padding:0cm 0cm 0cm 0cm;height:8.95pt'>
  <p class=MsoNormal align=center style='margin-right:-5.4pt;text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(реквизиты
  свидетельства о государственной регистрации индивидуального предпринимателя)<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:26;height:3.2pt'>
  <td width=284 colspan=11 valign=bottom style='width:212.75pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:3.2pt'>
  <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=755 colspan=40 valign=bottom style='width:566.2pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:3.2pt'>
  <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=36 colspan=3 valign=bottom style='width:27.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:3.2pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:27;height:7.0pt'>
  <td width=284 colspan=14 valign=bottom style='width:212.75pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Основание передачи (сдачи) / получения
  (приемки)<o:p></o:p></span></p>
  </td>
  <td width=746 colspan=36 valign=bottom style='width:559.8pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>Договор-оферта&nbsp;</o:p></span></p>
  </td>
  <td width=9 colspan=2 valign=bottom style='width:7.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=35 colspan=2 valign=bottom style='width:26.4pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>[8]<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:28;height:7.0pt'>
  <td width=284 colspan=11 valign=bottom style='width:212.75pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=746 colspan=39 valign=top style='width:559.8pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(договор; доверенность
  и др.)<o:p></o:p></span></p>
  </td>
  <td width=45 colspan=4 valign=bottom style='width:33.5pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:29;height:7.0pt'>
  <td width=211 colspan=13 valign=bottom style='width:158.6pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Данные о транспортировке и грузе<o:p></o:p></span></p>
  </td>
  <td width=819 colspan=37 valign=bottom style='width:613.95pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$order_date_str?>&nbsp;</o:p></span></p>
  </td>
  <td width=9 colspan=2 valign=bottom style='width:7.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=35 colspan=2 valign=bottom style='width:26.4pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>[9]<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:30;height:7.0pt'>
  <td width=211 colspan=10 valign=bottom style='width:158.6pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=819 colspan=40 valign=top style='width:613.95pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(транспортная
  накладная, поручение экспедитору, экспедиторская / складская расписка и др. /
  масса нетто/ брутто груза, если не приведены ссылки на транспортные
  документы, содержащие эти сведения)<o:p></o:p></span></p>
  </td>
  <td width=45 colspan=4 valign=bottom style='width:33.5pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:31;height:7.0pt'>
  <td width=540 colspan=31 valign=bottom style='width:404.9pt;border:none;
  border-right:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=535 colspan=23 valign=bottom style='width:401.15pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:32;height:7.0pt'>
  <td width=540 colspan=31 valign=bottom style='width:404.9pt;border:none;
  border-right:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Товар (груз) передал / услуги, результаты
  работ, права сдал<o:p></o:p></span></p>
  </td>
  <td width=535 colspan=23 valign=bottom style='width:401.15pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Товар (груз) получил / услуги, результаты
  работ, права принял<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:33;height:7.0pt'>
  <td width=135 colspan=8 valign=bottom style='width:101.4pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>Генеральный директор&nbsp;</o:p></span></p>
  </td>
  <td width=16 valign=bottom style='width:11.9pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=131 colspan=4 valign=bottom style='width:98.0pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=17 valign=bottom style='width:12.55pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=182 colspan=14 valign=bottom style='width:136.6pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$DIRECTOR_NAME?>&nbsp;</o:p></span></p>
  </td>
  <td width=51 colspan=3 valign=bottom style='width:38.3pt;border:none;
  border-right:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>[1</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>0</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>]<o:p></o:p></span></p>
  </td>
  <td width=8 valign=bottom style='width:5.8pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=161 colspan=8 valign=bottom style='width:121.1pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=trim(preg_replace('/\r|\n/', ' ', $legal_entity['signer_position']))?> &nbsp;</o:p></span></p>
  </td>
  <td width=18 valign=bottom style='width:13.3pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=132 colspan=2 valign=bottom style='width:98.65pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=18 colspan=2 valign=bottom style='width:13.3pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=154 colspan=5 valign=bottom style='width:115.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=trim($legal_entity['signer_full_name'])?> &nbsp;</o:p></span></p>
  </td>
  <td width=9 colspan=2 valign=bottom style='width:7.1pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=35 colspan=2 valign=bottom style='width:26.4pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>[1</span><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'>5</span><span
  lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>]<o:p></o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:34;height:7.0pt'>
  <td width=8 colspan=2 valign=top style='width:6.15pt;border:none;padding:
  0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=135 colspan=5 valign=top style='width:101.4pt;border:none;
  border-top:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>(</span><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>должность</span><span
  lang=EN-US style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>)<o:p></o:p></span></p>
  </td>
  <td width=16 valign=top style='width:11.9pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=131 colspan=4 valign=top style='width:98.0pt;border:none;
  border-top:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
  </td>
  <td width=17 valign=top style='width:12.55pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=182 colspan=15 valign=top style='width:136.6pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о)<o:p></o:p></span></p>
  </td>
  <td width=51 colspan=3 valign=top style='width:38.3pt;border:none;border-right:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=8 valign=top style='width:5.8pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=161 colspan=8 valign=top style='width:121.1pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>(</span><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>должность</span><span
  lang=EN-US style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>)<o:p></o:p></span></p>
  </td>
  <td width=18 valign=top style='width:13.3pt;border:none;padding:0cm 0cm 0cm 0cm;
  height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=132 colspan=2 valign=top style='width:98.65pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
  </td>
  <td width=18 colspan=2 valign=top style='width:13.3pt;border:none;padding:
  0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=154 colspan=5 valign=top style='width:115.5pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm;height:
  7.0pt'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о)<o:p></o:p></span></p>
  </td>
  <td width=45 colspan=4 valign=bottom style='width:33.5pt;border:none;
  padding:0cm 0cm 0cm 0cm;height:7.0pt'>
  <p class=MsoNormal align=right style='text-align:right'><span
  style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
 <tr style='mso-yfti-irow:35'>
  <td width=183 colspan=9 valign=bottom style='width:137.0pt;border:none;
  padding:0cm 0cm 0cm 0cm'>
  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
  style='font-size:4.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=306 colspan=19 valign=bottom style='width:229.6pt;border:none;
  padding:0cm 0cm 0cm 0cm'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=51 colspan=3 valign=bottom style='width:38.3pt;border:none;
  border-right:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
  <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
  lang=EN-US style='font-size:4.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=169 colspan=8 valign=bottom style='width:126.9pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
  <p class=MsoNormal style='margin-left:5.65pt'><span lang=EN-US
  style='font-size:4.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US;
  mso-no-proof:yes'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=321 colspan=11 valign=bottom style='width:240.75pt;border:none;
  padding:0cm 0cm 0cm 0cm'>
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
  <td width=45 colspan=4 valign=bottom style='width:33.5pt;border:none;
  padding:0cm 0cm 0cm 0cm'>
  <p class=MsoNormal align=right style='text-align:right'><span
  style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
  </td>
 </tr>
  <tr style="mso-yfti-irow:36;height:7.0pt">
    <td width="183" colspan="12" valign="bottom" style="width:137.1pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" style="margin-left:5.65pt"><span lang="EN-US" style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:EN-US">Дата
  отгрузки, передачи (сдачи)</span><span style="font-size:8.0pt;font-family:Arial,sans-serif"><o:p></o:p></span></p>
    </td>

    <td width="26" valign="bottom" style="width:19.6pt;border:none;border-bottom:
  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center">
        <span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p>«<?=$order_date_parts['day']?>»&nbsp;</o:p></span></p>
    </td>
    <td width="11" valign="bottom" style="width:8.4pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p></o:p></span></p>
    </td>
    <td width="140" colspan="13" valign="bottom" style="width:104.95pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p><?=$order_date_parts['month']?>&nbsp;</o:p></span></p>
    </td>
    <td width="20" valign="bottom" style="width:14.7pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">20<o:p></o:p></span></p>
    </td>
    <td width="25" valign="bottom" style="width:19.0pt;border:none;border-bottom:
  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p><?=$order_date_parts['year_two_digits']?>&nbsp;</o:p></span></p>
    </td>
    <td width="44" valign="bottom" style="width:32.8pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" style="margin-left:2.85pt"><span style="font-size:8.0pt;
  font-family:&quot;Arial&quot;,sans-serif">г.<o:p></o:p></span></p>
    </td>
    <td width="51" valign="bottom" style="width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="right" style="margin-right:8.5pt;text-align:right"><span lang="EN-US" style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:
  EN-US">[1</span><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">1]</span><span lang="EN-US" style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:
  EN-US"><o:p></o:p></span></p>
    </td>
    <td width="169" colspan="10" valign="bottom" style="width:126.9pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" style="margin-left:5.65pt"><span lang="EN-US" style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:EN-US;
  mso-no-proof:yes">Дата получения (приемки)</span><span style="font-size:8.0pt;
  font-family:&quot;Arial&quot;,sans-serif;mso-no-proof:yes"><o:p></o:p></span></p>
    </td>
    <td width="55" colspan="3" valign="bottom" style="width:41.3pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="right" style="text-align:right"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">«<o:p></o:p></span></p>
    </td>
    <td width="27" valign="bottom" style="width:20.25pt;border:none;border-bottom:
  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p><?=$order_date_parts['day']?>&nbsp;</o:p></span></p>
    </td>
    <td width="11" valign="bottom" style="width:8.4pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">»<o:p></o:p></span></p>
    </td>
    <td width="144" colspan="3" valign="bottom" style="
  width:107.8pt;
  border:none;
  border-bottom:solid windowtext 1.0pt;
  mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm;
  ">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p><?=$order_date_parts['month']?>&nbsp;</o:p></span></p>
    </td>
    <td width="19" valign="bottom" style="width:14.0pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">20<o:p></o:p></span></p>
    </td>
    <td width="26" valign="bottom" style="width:19.6pt;border:none;border-bottom:
  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif"><o:p><?=$order_date_parts['year_two_digits']?>&nbsp;</o:p></span></p>
    </td>
    <td width="39" valign="bottom" style="width:29.4pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" style="margin-left:2.85pt"><span style="font-size:8.0pt;
  font-family:&quot;Arial&quot;,sans-serif">г.<o:p></o:p></span></p>
    </td>
    <td width="36" colspan="2" valign="bottom" style="width:27.1pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">[</span><span lang="EN-US" style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:
  EN-US">1</span><span style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif">6]</span><span lang="EN-US" style="font-size:8.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:
  EN-US"><o:p></o:p></span></p>
    </td>
  </tr>

  <tr style='mso-yfti-irow:2'>
    <td width=489 colspan=30 valign=bottom style='width:366.7pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Иные сведения об отгрузке, передаче<o:p></o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=490 colspan=20 valign=bottom style='width:367.65pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Иные сведения о получении, приемке<o:p></o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>

  <tr style='mso-yfti-irow:3'>
    <td width=8 valign=bottom style='width:6.25pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=481 colspan=29 valign=bottom style='width:360.45pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>-&nbsp;</o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>[1</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>2]<o:p></o:p></span></p>
    </td>
    <td width=8 valign=bottom style='width:5.8pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=482 colspan=19 valign=bottom style='width:361.85pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>-&nbsp;</o:p></span></p>
    </td>
    <td width=9 colspan=2 valign=bottom style='width:7.0pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=35 valign=bottom style='width:26.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>[17]<o:p></o:p></span></p>
    </td>
  </tr>
  <tr style='mso-yfti-irow:4'>
    <td width=8 valign=bottom style='width:6.25pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=481 colspan=29 valign=top style='width:360.45pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ссылки на
  неотъемлемые приложения, сопутствующие документы, иные документы и т.п.)<o:p></o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=8 valign=bottom style='width:5.8pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=482 colspan=19 valign=top style='width:361.85pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(информация о
  наличии/отсутствии претензии; ссылки на неотъемлемые приложения, и другие
  документы и т.п.)<o:p></o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:5'>
    <td width=489 colspan=30 valign=bottom style='width:366.7pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=490 colspan=21 valign=bottom style='width:367.65pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:6'>
    <td width=489 colspan=30 valign=bottom style='width:366.7pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Ответственный за правильность оформления факта
  хозяйственной жизни<o:p></o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=490 colspan=20 valign=bottom style='width:367.65pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Ответственный за правильность оформления факта
  хозяйственной жизни<o:p></o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:7'>
    <td width=144 colspan=4 valign=bottom style='width:107.75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=163 colspan=16 valign=bottom style='width:122.45pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=182 colspan=10 valign=bottom style='width:136.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=170 colspan=6 valign=bottom style='width:127.45pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=149 colspan=9 valign=bottom style='width:111.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=172 colspan=5 valign=bottom style='width:128.8pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>

  <tr style="mso-yfti-irow:8">
    <td width="8" valign="bottom" style="width:6.25pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="135" colspan="10" valign="bottom" style="width:101.5pt;border:none;border-bottom:
  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>Генеральный директор&nbsp;</o:p></span></p>
    </td>
    <td width="2" valign="bottom" style="width:11.9pt;padding:0cm 0cm 0cm 0cm;">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="129" colspan="9" valign="bottom" style="width:96.6pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="19" valign="bottom" style="width:13.95pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="182" colspan="8" valign="bottom" style="width:136.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p><?=$DIRECTOR_NAME_SHORT?> &nbsp;</o:p></span></p>
    </td>
    <td width="51" valign="bottom" style="width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="right" style="margin-right:8.5pt;text-align:right"><span lang="EN-US" style="font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US">[1</span><span style="font-size:8.0pt;font-family:"Arial",sans-serif">3</span><span lang="EN-US" style="font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US">]<o:p></o:p></span></p>
    </td>
    <td width="8" valign="bottom" style="width:5.8pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="161" colspan="8" valign="bottom" style="width:121.1pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p><?=$legal_entity['signer_position']?>&nbsp;</o:p></span></p>
    </td>
    <td width="18" colspan="1" valign="bottom" style="width:13.3pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="132" colspan="4" valign="bottom" style="width:98.65pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="18" valign="bottom" style="width:13.3pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="154" colspan="5" valign="bottom" style="width:115.5pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:8.0pt;font-family:"Arial",sans-serif"><o:p><?=$legal_entity['signer_full_name']?>&nbsp;</o:p></span></p>
    </td>
    <td width="9" colspan="2" valign="bottom" style="width:7.0pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span lang="EN-US" style="font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US"><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width="35" valign="bottom" style="width:26.4pt;padding:0cm 0cm 0cm 0cm">
      <p class="MsoNormal" align="center" style="text-align:center"><span lang="EN-US" style="font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US">[18]<o:p></o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:9'>
    <td width=8 valign=top style='width:6.25pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=135 colspan="10" valign=top style='width:101.5pt;border:none;mso-border-top-alt:
  solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>(</span><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>должность</span><span
          lang=EN-US style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>)<o:p></o:p></span></p>
    </td>
    <td width=16 valign=top style='width:11.9pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=129 colspan=9 valign=top style='width:96.6pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
    </td>
    <td width=19 valign=top style='width:13.95pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=182 colspan=8 valign=top style='width:136.5pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о)<o:p></o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=8 valign=top style='width:5.8pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=161 colspan=8 valign=top style='width:121.1pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>(</span><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>должность</span><span
          lang=EN-US style='font-size:6.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>)<o:p></o:p></span></p>
    </td>
    <td width=18 colspan=1 valign=top style='width:13.3pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=132 colspan=4 valign=top style='width:98.65pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(подпись)<o:p></o:p></span></p>
    </td>
    <td width=18 valign=top style='width:13.3pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=154 colspan=5 valign=top style='width:115.5pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(ф.и.о)<o:p></o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:10'>
    <td width=489 colspan=30 valign=bottom style='width:366.7pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=490 colspan=20 valign=bottom style='width:367.65pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal><span style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:4.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:11'>
    <td width=489 colspan=30 valign=bottom style='width:366.7pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='text-align:right'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'>Наименование
  экономического субъекта – составителя документа (в т.ч. комиссионера /
  агента)<o:p></o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=490 colspan=20 valign=bottom style='width:367.65pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal style='margin-left:5.65pt'><span style='font-size:8.0pt;
  font-family:"Arial",sans-serif'>Наименование экономического субъекта – составителя
  документа<o:p></o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>

  <tr style='mso-yfti-irow:13'>
    <td width=8 valign=bottom style='width:6.25pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=481 colspan=29 valign=bottom style='width:360.45pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>ООО "Эвендейт", 0706005473/070601001&nbsp;</o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>[1</span><span style='font-size:8.0pt;font-family:"Arial",sans-serif'>4</span><span
          lang=EN-US style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:
  EN-US'>]<o:p></o:p></span></p>
    </td>
    <td width=9 colspan=2 valign=bottom style='width:6.5pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=482 colspan=18 valign=bottom style='width:361.15pt;border:none;
  border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .75pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p><?=$legal_entity['company_name']?>,
						<?=$legal_entity['company_inn'] . '/' . $legal_entity['company_kpp']?>&nbsp;</o:p></span></p>
    </td>
    <td width=9 colspan=2 valign=bottom style='width:7.0pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=35 valign=bottom style='width:26.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                      style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-ansi-language:EN-US'>[19]<o:p></o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:14'>
    <td width=8 valign=top style='width:6.25pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=481 colspan=29 valign=top style='width:360.45pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(может не заполняться
  при проставлении печати в М.П., может быть указан ИНН / КПП)<o:p></o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=right style='margin-right:8.5pt;text-align:right'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=9 colspan=2 valign=top style='width:6.5pt;border:none;mso-border-left-alt:
  solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=482 colspan=18 valign=top style='width:361.15pt;border:none;
  mso-border-top-alt:solid windowtext .75pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:6.0pt;font-family:"Arial",sans-serif'>(может не заполняться
  при проставлении печати в М.П., может быть указан ИНН / КПП)<o:p></o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>


  <tr style='mso-yfti-irow:15;mso-yfti-lastrow:yes'>
    <td width=165 colspan=10 valign=bottom style='width:124.0pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'>М.П.<o:p></o:p></span></p>
    </td>
    <td width=324 colspan=20 valign=bottom style='width:242.7pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=51 valign=bottom style='width:38.3pt;border:none;border-right:solid windowtext 1.5pt;
  padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=186 colspan=7 valign=bottom style='width:139.2pt;border:none;
  mso-border-left-alt:solid windowtext 1.5pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif;mso-no-proof:yes'>М.П.</span><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p></o:p></span></p>
    </td>
    <td width=305 colspan=13 valign=bottom style='width:228.45pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
    <td width=45 colspan=3 valign=bottom style='width:33.4pt;padding:0cm 0cm 0cm 0cm'>
      <p class=MsoNormal align=center style='text-align:center'><span
          style='font-size:8.0pt;font-family:"Arial",sans-serif'><o:p>&nbsp;</o:p></span></p>
    </td>
  </tr>

<!--  Place it here-->

 <![if !supportMisalignedColumns]>
 <tr height=0>
  <td width=111 style='border:none'></td>
  <td width=12 style='border:none'></td>
  <td width=406 style='border:none'></td>
  <td width=128 style='border:none'></td>
  <td width=477 style='border:none'></td>
  <td width=571 style='border:none'></td>
  <td width=446 style='border:none'></td>
  <td width=238 style='border:none'></td>
  <td width=351 style='border:none'></td>
  <td width=432 style='border:none'></td>
  <td width=10830 style='border:none'></td>
  <td width=94 style='border:none'></td>
  <td width=251 style='border:none'></td>
  <td width=33 style='border:none'></td>
  <td width=7 style='border:none'></td>
  <td width=57 style='border:none'></td>
  <td width=70 style='border:none'></td>
  <td width=14 style='border:none'></td>
  <td width=252 style='border:none'></td>
  <td width=169 style='border:none'></td>
  <td width=615 style='border:none'></td>
  <td width=167 style='border:none'></td>
  <td width=14 style='border:none'></td>
  <td width=81 style='border:none'></td>
  <td width=31 style='border:none'></td>
  <td width=42 style='border:none'></td>
  <td width=797 style='border:none'></td>
  <td width=383 style='border:none'></td>
  <td width=647 style='border:none'></td>
  <td width=14 style='border:none'></td>
  <td width=105 style='border:none'></td>
  <td width=116 style='border:none'></td>
  <td width=290 style='border:none'></td>
  <td width=94 style='border:none'></td>
  <td width=703 style='border:none'></td>
  <td width=331 style='border:none'></td>
  <td width=356 style='border:none'></td>
  <td width=517 style='border:none'></td>
  <td width=131 style='border:none'></td>
  <td width=266 style='border:none'></td>
  <td width=395 style='border:none'></td>
  <td width=532 style='border:none'></td>
  <td width=1046 style='border:none'></td>
  <td width=171 style='border:none'></td>
  <td width=95 style='border:none'></td>
  <td width=140 style='border:none'></td>
  <td width=10 style='border:none'></td>
  <td width=536 style='border:none'></td>
  <td width=1022 style='border:none'></td>
  <td width=602 style='border:none'></td>
  <td width=128 style='border:none'></td>
  <td width=14 style='border:none'></td>
  <td width=316 style='border:none'></td>
  <td width=212 style='border:none'></td>
 </tr>
 <![endif]>
</table>

</div>

<p class=MsoNormal><span style='font-size:1.0pt'><o:p>&nbsp;</o:p></span></p>

</div>
<img src="./sign.png" style="
    position: absolute;
    width: 60px;
    bottom: 360px;
    left: 300px;
">
<img src="./sign.png" style="
    position: absolute;
    width: 60px;
    bottom: 367px;
    left: 750px;
">
<img src="./sign.png" style="
    position: absolute;
    width: 50px;
    bottom: 210px;
    left: 160px;
">
<img src="./sign.png" style="
    position: absolute;
    width: 65px;
    bottom: 99px;
    left: 280px;
">
<img src="./seal2.png" style="
    width: 160px;
    position: absolute;
    bottom: 0;
	  left: 0;
">
</body>

</html>
