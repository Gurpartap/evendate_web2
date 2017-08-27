/**
 * @requires Class.SearchPage.js
 */
/**
 *
 * @class SearchByTagPage
 * @extends SearchPage
 */
SearchByTagPage = extending(SearchPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs SearchByTagPage
	 */
	function SearchByTagPage(search) {
		SearchPage.call(this, search);
		this.search_string = '#' + decodeURIComponent(search);
		this.search_results = new SearchResults(this.search_string);
	}
	
	return SearchByTagPage;
}()));