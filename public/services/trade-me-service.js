angular.module('tradeMeServices', ['ngResource'])


.factory('PropertiesByRegion', ['$http' , '$q',
	function($http , $q) {
        var d = $q.defer();
		this.getlist = function(){            
        return $http.get('http://localhost:3000/listing?format=json',{'Access-Control-Allow-Origin': 'localhost:*'})
            .then(function(response) {
              console.log(response); //I get the correct items, all seems ok here
               d.resolve(response);
             // return response.data.itemsToReturn;
            });            
    }
    return d.promise;
    //return this;


	/*	return $resource('https://api.tmsandbox.co.nz/v1/Search/Property/Rental.json', {}, {
			query: {
				method:'GET', 
				params: {
					region:undefined,
					oauth_consumer_key: trademe.credentials.oauth_consumer_key,
					oauth_signature_method: 'PLAINTEXT',
					oauth_signature: trademe.credentials.oauth_signature,
					photo_size: 'Large'
				}
			}, 
			isArray:false
	});
*/
}]);