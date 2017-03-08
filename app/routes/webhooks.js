// Firebase

var firebase = require("firebase-admin");

var serviceAccount = require("../../config/mealtimeprod-firebase.json") || { projectId: process.env.FBPROJECTID, clientEmail: process.env.FBEMAIL, privateKey: process.env.FBKEY }; 

firebase.initializeApp({
  	credential: firebase.credential.cert(serviceAccount),
  	databaseURL: process.env.mealtimeDatabaseURL
});

module.exports = function(router) {
    
    router.route('/webhook')
        .post(function(req, res) { 
        	var addList = req.body.result.parameters['Add-list'];

        	

			var data = firebase.database().ref('/ff84cdcc-7349-4fbb-b11b-795588e03226');

			var itemsList = data.child('items');

			var item = {
				name: '',
				searchValue:''
			}

			// for (var i = 0; i < addList.length; i++) {
			addList.forEach(function(element) {
				console.log(element);
				item.name = element;
				item.searchValue = element.toLowerCase();

				return itemsList.orderByChild("searchValue").startAt(item.searchValue).endAt(item.searchValue).once('value', function(dataSnapshot) {
					if (dataSnapshot.val() === null) {
						console.log('Adding ' + item.name);
						return itemsList.push().set(item);
						// CREATE NEW ITEM
		              // //Create New Item
		              // items.$add(item).then(function(ref) {         
		              //     categoriesRef.child("/" + defaultCategory + "/items/" + ref.key()).set(true);
		              //     deferred.resolve(items.$getRecord(ref.key()));
		              //   });
		            } else {
		              	console.log('Add item to list.');

		              	// ADD ITEM TO LIST

		                // dataSnapshot.forEach(function(snap){
		                //   deferred.resolve(items.$getRecord(snap.key()));
		                // });
		            }
		        });

			});
			// data.once('value').then(function(snap) {
			// 	console.log(snap.val());
			// });


        	// console.log(req.body.result.parameters);
        	res.send({message: 'Here we go..'});

        })
    ;

}