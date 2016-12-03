var express = require('express'),
	app = express(),
	Mock = require('mockjs');

/* 测试 */
app.post('/test/info', function (req, res) {
	var Random = Mock.Random,
		data   = Mock.mock({
			'data': [{
				'id': '@integer(1, 6)',
				'name': '@cname'
			}],
            'msg': 'success|error',
			'code': '@integer(0, 1)'
		});

	res.send( JSON.stringify(data, null, 4) );
});

module.exports = app;
