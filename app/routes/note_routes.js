var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db){

	app.get('/referrals/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id)};
		db.collection('referrals').findOne(details, (err, item) =>{
			if(err){
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	app.delete('/referrals/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id' : new ObjectID(id) };
		db.collection('referrals').remove(details, (err, item) => {
			if (err){
				res.send({'error': 'An error has occurred'});
			} else {
				res.send('Lead ' + id + ' deleted!');
			}
		});
	});

	app.put('/referrals/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		const note = { 
			utm_campaign : req.body.utm_campaign, 
			utm_source: req.body.utm_source,
			utm_medium: req.body.utm_medium ,
			utm_content: req.body.utm_content,
			datetime: req.body.datetime,
			referral_ad: req.body.referral_ad,
			sale_price:req.body.sale_price,
			qty:req.body.qty,
			discount: req.body.discount,
			tax:req.body.tax,
			currency: req.body.currency
		};
		db.collection('referrals').update(details, note, (err, result) => {
			if(err){
				res.send({'error': 'An error has occurred'});
			} else {
				res.send(note);
			}
		});
	});

	app.post('/referrals', (req, res) => {
		const note = { 
			utm_campaign : req.body.utm_campaign, 
			utm_source: req.body.utm_source,
			utm_medium: req.body.utm_medium ,
			utm_content: req.body.utm_content,
			datetime: req.body.datetime,
			referral_ad: req.body.referral_ad,
			sale_price:req.body.sale_price,
			qty:req.body.qty,
			discount: req.body.discount,
			tax:req.body.tax,
			currency: req.body.currency
		};

		db.collection('referrals').insertOne(note, (err, result) => {
			if(err){
				res.send({'error': 'An error has ocurred' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});

};
