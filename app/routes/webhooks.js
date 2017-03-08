var Q = require('q');
// Firebase
var firebase = require("firebase-admin");
// require("../../config/mealtimeprod-firebase.json") || 

var serviceAccount = {
	projectId: process.env.FBPROJECTID,
	clientEmail: process.env.FBEMAIL,
	privateKey: process.env.FBKEY.replace(/\\n/g, '\n')
}

firebase.initializeApp({
  	credential: firebase.credential.cert(serviceAccount),
  	databaseURL: process.env.mealtimeDatabaseURL
});

function addNewItem(elements) {
	var deferred = Q.defer();

    var data = firebase.database().ref('/ff84cdcc-7349-4fbb-b11b-795588e03226');
	var itemsList = data.child('items');

	var item = {
		name: '',
		searchValue:''
	};

	// elements.forEach(function(element) {

	console.log(elements[0]);
	item.name = elements[0];
	item.searchValue = elements[0].toLowerCase();

	itemsList.orderByChild("searchValue").startAt(item.searchValue).endAt(item.searchValue).once('value', function(dataSnapshot) {
		if (dataSnapshot.val() === null) {
			// console.log('Adding ' + item.name);
			item.category = '-JxxMBHu93IyJOu365hA';
			var addedItem = itemsList.push(item);
			var list = data.child('lists/Default/items/' + addedItem.key);

			// var categoryItem = data.child('categories/' + '-JxxMBHu93IyJOu365hA/' + 'items');
			// categoryItem.set({})
    		
    		list.set({category: item.category, gotit: false, quantity: 1}, function(subRes) {
    			deferred.resolve(item.name);
    		});

			// CREATE NEW ITEM
          // //Create New Item
          // items.$add(item).then(function(ref) {         
          //     categoriesRef.child("/" + defaultCategory + "/items/" + ref.key()).set(true);
          //     deferred.resolve(items.$getRecord(ref.key()));
          //   });
        } else {
        	dataSnapshot.forEach(function(res) {
        		var list = data.child('lists/Default/items/' + res.key);
        		list.set({category: res.val().category, gotit: false, quantity: 1}, function(subRes) {
        			deferred.resolve(res.val().name);	
        		});
        	});
        }
    });
    // });

    return deferred.promise;
};

module.exports = function(router) {
    
    router.route('/webhook')
        .post(function(req, res) { 
        	var addList = req.body.result.parameters['Add-list'];

			// var categoryList = data.child('categories');

			

		    // categoryList.orderByChild('default').startAt(true).endAt(true).once('value', function(snap) {
		    // 	console.log(snap.val());
		    //     // snap.forEach(function(snapData) {
		    //       item.category = snap.key;
		    //     // });

		        // addList.forEach(function(element) {
					addNewItem(addList).then(function(data) {
						

						res.json({
						  	"speech": "Alright, " + data + " have been added",
						  	"source": "mealtime-api",
							"displayText": "Alright, " + data + " have been added"
			        	});
					});
				// });
		    // });

			
			// data.once('value').then(function(snap) {
			// 	console.log(snap.val());
			// });
        })
    ;

}