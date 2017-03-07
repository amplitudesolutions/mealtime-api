module.exports = function(router) {
    
    router.route('/webhook')
        .post(function(req, res) { 

        	console.log(req.body.result.parameters);
        	res.send({message: 'Here we go..'});

        })
    ;

}