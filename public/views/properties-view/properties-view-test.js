'use strict';

var trademe = {
	credentials: {
		oauth_consumer_key:'key',
		oauth_signature:'sig' + '&'
	}
}

describe('rentMeApp.propertiesView module', function() {

  	var $httpBackend;
 	beforeEach(module('rentMeApp.propertiesView'));
	beforeEach(inject(function(_$httpBackend_){
		$httpBackend = _$httpBackend_;
	}));

	describe('PropertiesView controller', function(){

		it('should retrieve properties for a region', inject(function($controller) {
		  
			$httpBackend
				.expectGET('https://api.tmsandbox.co.nz/v1/Search/Property/Rental.json?oauth_consumer_key=key&oauth_signature=sig%26&oauth_signature_method=PLAINTEXT&photo_size=Large&region=100')
				.respond({"TotalCount":36,"Page":1,"PageSize":36,"List":[
					{"ListingId":3786031,"Title":"Ngauranga, 3 bedrooms, $350 pw","Category":"0350-5748-4233-","StartPrice":0,"StartDate":"\/Date(1409608029867)\/","EndDate":"\/Date(1418590449867)\/","ListingLength":null,"HasGallery":true,"IsBold":true,"IsHighlighted":true,"AsAt":"\/Date(1416984543658)\/","CategoryPath":"\/Trade-Me-Property\/Residential\/To-Rent","PictureHref":"https:\/\/images.tmsandbox.co.nz\/photoserver\/thumb\/832380.jpg","RegionId":15,"Region":"Wellington","SuburbId":966,"Suburb":"Ngauranga","NoteDate":"\/Date(0)\/","ReserveState":3,"IsClassified":true,"GeographicLocation":{"Latitude":-41.2434795,"Longitude":174.8081702,"Northing":5432637,"Easting":1751512,"Accuracy":1},"PriceDisplay":"$350 per week","Address":"9 Lower Tyers Road","District":"Wellington","AgencyReference":"ZGD1085","AvailableFrom":"today","Bathrooms":3,"Bedrooms":3,"ListingGroup":"FLAT","Parking":"","PropertyType":"Unit","RentPerWeek":350,"AdjacentSuburbNames":["Newlands","Khandallah","Horokiwi","Raroa","Broadmeadows","Ngauranga"],"AdjacentSuburbIds":[1538,1797,877,950,951,966],"DistrictId":47,"Agency":{"Id":11,"Name":"Alister's Real Estate, Licensed Agent (REAA 2008)","PhoneNumber":"+64-4-4711849","Agents":[{"FullName":"Geoff Duncan","MobilePhoneNumber":"(04) 4711849","OfficePhoneNumber":"(027) 2711274"}],"IsRealEstateAgency":true,"IsLicensedPropertyAgency":true}},
					{"ListingId":3786031,"Title":"Ngauranga, 2 bedrooms, $150 pw","Category":"0350-5748-4233-","StartPrice":0,"StartDate":"\/Date(1409608029867)\/","EndDate":"\/Date(1418590449867)\/","ListingLength":null,"HasGallery":true,"IsBold":true,"IsHighlighted":true,"AsAt":"\/Date(1416984543658)\/","CategoryPath":"\/Trade-Me-Property\/Residential\/To-Rent","PictureHref":"https:\/\/images.tmsandbox.co.nz\/photoserver\/thumb\/832380.jpg","RegionId":15,"Region":"Wellington","SuburbId":966,"Suburb":"Ngauranga","NoteDate":"\/Date(0)\/","ReserveState":3,"IsClassified":true,"GeographicLocation":{"Latitude":-41.2434795,"Longitude":174.8081702,"Northing":5432637,"Easting":1751512,"Accuracy":1},"PriceDisplay":"$350 per week","Address":"9 Lower Tyers Road","District":"Wellington","AgencyReference":"ZGD1085","AvailableFrom":"today","Bathrooms":3,"Bedrooms":3,"ListingGroup":"FLAT","Parking":"","PropertyType":"Unit","RentPerWeek":150,"AdjacentSuburbNames":["Newlands","Khandallah","Horokiwi","Raroa","Broadmeadows","Ngauranga"],"AdjacentSuburbIds":[1538,1797,877,950,951,966],"DistrictId":47,"Agency":{"Id":11,"Name":"Alister's Real Estate, Licensed Agent (REAA 2008)","PhoneNumber":"+64-4-4711849","Agents":[{"FullName":"Geoff Duncan","MobilePhoneNumber":"(04) 4711849","OfficePhoneNumber":"(027) 2711274"}],"IsRealEstateAgency":true,"IsLicensedPropertyAgency":true}}
				]});

			var scope = {},
				routeParams = {
					regionName: 'myRegion',
					regionId: 100
				}

		    var view2Ctrl = $controller('PropertiesViewController', {$scope:scope, $routeParams:routeParams});
		  
		    $httpBackend.flush();

		    expect(scope.regionId).toBe(100);
		    expect(scope.properties.TotalCount).toBe(36);
		    expect(scope.properties.List[0].ListingId).toBe(3786031);
		    expect(scope.maxPrice).toBe(350);
		    expect(scope.minPrice).toBe(150);

		}));

	    it('has a filter to meet the user\'s search criteria', inject(function($filter) {
	        expect($filter('meetCriteria')).not.toBeNull();
	    }));

	    it('filters properties based on min and max price', inject(function(meetCriteriaFilter) {
	    	var properties = [
	    		{ Title: 'First property', RentPerWeek: 200, Bedrooms: 1, Suburb: '' },
	    		{ Title: 'Second property', RentPerWeek: 400, Bedrooms: 1, Suburb: '' },
	    		{ Title: 'Third property', RentPerWeek: 800, Bedrooms: 1, Suburb: '' }
	    	];
	    	var filteredResults = meetCriteriaFilter(properties, 250, 600, 0, '');
	    	expect(filteredResults.length).toBe(1);
	    	expect(filteredResults[0].Title).toBe('Second property');
	    }));

	    it('filters properties based on the number of bedrooms', inject(function(meetCriteriaFilter) {
	    	var properties = [
	    		{ Title: 'First property', RentPerWeek: 100, Bedrooms: 2, Suburb: '' },
	    		{ Title: 'Second property',RentPerWeek: 100, Bedrooms: 3, Suburb: '' },
	    		{ Title: 'Third property', RentPerWeek: 100, Bedrooms: 4, Suburb: '' }
	    	];
	    	var filteredResults = meetCriteriaFilter(properties, 99, 101, 3, '');
	    	expect(filteredResults.length).toBe(2);
	    	expect(filteredResults[0].Title).toBe('Second property');
	    	expect(filteredResults[1].Title).toBe('Third property');
	    }));

	    it('filters properties based on the suburb and is case insensitive', inject(function(meetCriteriaFilter) {
	    	var properties = [
	    		{ Title: 'First property', RentPerWeek: 100, Bedrooms: 2, Suburb: 'A place' },
	    		{ Title: 'Second property',RentPerWeek: 100, Bedrooms: 3, Suburb: 'Nowhere' },
	    		{ Title: 'Third property', RentPerWeek: 100, Bedrooms: 4, Suburb: 'where' }
	    	];
	    	var filteredResults = meetCriteriaFilter(properties, 99, 101, 1, 'wHERe');
	    	expect(filteredResults.length).toBe(2);
	    	expect(filteredResults[0].Title).toBe('Second property');
	    	expect(filteredResults[1].Title).toBe('Third property');
	    }));



	});

});