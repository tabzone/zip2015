'use strict';

angular.module('rentMeApp.propertiesView', ['ngRoute', 'tradeMeServices'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/look-in/:regionName/:regionId', {
    templateUrl: 'views/properties-view/properties-view.html',
    controller: 'PropertiesViewController'
  });
}])

.controller('PropertiesViewController', ['$scope', '$routeParams', 'PropertiesByRegion', function($scope, $routeParams, PropertiesByRegion) {
	
	var maxPrice = 0, 
		minPrice = 0,
		minBeds = 0,
		maxBeds = 0;

	var properties = PropertiesByRegion.query({region: $routeParams.regionId});
	$scope.properties = properties;	
	$scope.bedrooms = 1;
	$scope.suburb = '';
	
	$scope.adjustBedrooms = function(adjustment) {
		var bedrooms = $scope.bedrooms + adjustment;
		bedrooms = Math.min(bedrooms, maxBeds);
		bedrooms = Math.max(bedrooms, minBeds);
		$scope.bedrooms = bedrooms;
	}
	
	properties.$promise.then(function(result) {
		setPriceRange(result.List);
	})

	function setPriceRange(propertyList) {

		//hack: force a high min price so that Math.min works, otherwise min will always be zero
		//or you will need two loops, firstly to find the max price, then set the min price to the max at the start
		minPrice = 10000000; 
		minBeds = 99;

		for (var i=0; i < propertyList.length; i++) {
			var rentPerWeek = propertyList[i].RentPerWeek;
			var bedrooms = propertyList[i].Bedrooms;
			maxPrice = Math.max(rentPerWeek, maxPrice);
			minPrice = Math.min(rentPerWeek, minPrice);
			maxBeds = Math.max(bedrooms, maxBeds);
			minBeds = Math.min(bedrooms, minBeds);
		}
		$scope.maxPrice = maxPrice;
		$scope.minPrice = minPrice;
		$scope.bedrooms = minBeds;
	}

	$scope.regionId = $routeParams.regionId;
}])

.filter('meetCriteria', function () {
	return function (items, minPrice, maxPrice, bedrooms, suburb) {
		var filtered = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.RentPerWeek >= minPrice &&
				item.RentPerWeek <= maxPrice &&
				item.Bedrooms >= bedrooms &&
				item.Suburb.toLowerCase().indexOf(suburb.toLowerCase()) > -1) {
				filtered.push(item);
			}
		}
		return filtered;
	};
})

.directive('ionRangeSlider', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).ionRangeSlider({
            	type: "double",
            	grid: false,
            	min: attrs.ionRangeSliderMin - 20,
            	max: Number(attrs.ionRangeSliderMax) + 20,
            	from: attrs.ionRangeSliderMin,
            	to: attrs.ionRangeSliderMax,
            	prefix: "$",
            	onChange: function(data) {
            		scope.maxPrice = data.to;
            		scope.minPrice = data.from;
            		scope.$apply();
            	}
            });
        }
    };
});

