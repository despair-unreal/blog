var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var fs = require("fs");
var util = require("util");

var app = express();

var multer = require('multer');
var urlencodedParser = bodyParser.urlencoded({
	extended: false
});
app.use(urlencodedParser);
app.use(bodyParser.json());
var conn = mysql.createConnection({
	user: 'root',
	password: 'root',
	database: 'blog'
});
conn.connect();

app.use(express.static('public'));
app.use(session({
	secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
	cookie: {
		maxAge: 60 * 100000
	}
}));
var upload = multer({
	dest: '/images/postsImg/'
});
app.post('/login', function(req, res) {
	var sql1 = "select id,email from userInfo where email=?";
	var params1 = req.body.params.email;
	conn.query(sql1, params1, function(error1, results1) {
		if (error1) {
			console.log(error1);
			return;
		}
		if (results1.length != 0) {
			var sql2 = "select id,email,pwd,userName,avatarUrl from userInfo where email=? and pwd=?";
			var params2 = [req.body.params.email, req.body.params.pwd];
			conn.query(sql2, params2, function(error2, results2) {
				if (error2) {
					console.log(error2);
					return;
				}

				if (results2.length == 0) {
					res.send({
						"isSuccess": false
					});
				} else {
					req.session.Login = results2[0].id;
					res.send(results2);
				}
			})
		} else {
			res.send({
				"isRegister": false
			});
		}
	});
});
app.post('/register', function(req, res) {
	var sql = "insert into userInfo value(0,?,?,?,null,null)";
	var params = [req.body.params.email, req.body.params.pwd, req.body.params.email];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		req.session.Login = results.insertId;
		res.send({
			"id": results.isertId,
			"userName": req.body.params.email,
			"avatarUrl": null
		});
	});
});
app.get('/getLoginStatus', function(req, res) {
	res.send(JSON.stringify(req.session.Login));
});
app.get('/getUserInfo', function(req, res) {
	var sql = "select id,email,userName,indexUrl,avatarUrl from userInfo where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results[0]);
	});
});
app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('posts.html');
	})
});
app.post('/upload', upload.single('uploadImgName'), function(req, res) {
	var fileName = new Date().getTime() + ".jpg";
	var imgUrl = __dirname + "/public/images/postsImg/" + fileName;
	fs.readFile(req.file.path, function(err, data) {
		fs.writeFile(imgUrl, data, function(err) {
			if (err) {
				console.log(err);
			} else {
				res.send({
					error: 0,
					data: [{
						isOK: true,
						imgPath: "/images/postsImg/" + fileName, //文件存储的路径
						imgName: fileName
					}]
				})
			}
		});
	});
})

function CurentTime() {
	var now = new Date();

	var year = now.getFullYear(); //年
	var month = now.getMonth() + 1; //月
	var day = now.getDate(); //日

	var hh = now.getHours(); //时
	var mm = now.getMinutes(); //分

	var clock = year + "-";

	if (month < 10)
		clock += "0";

	clock += month + "-";

	if (day < 10)
		clock += "0";

	clock += day + " ";

	if (hh < 10)
		clock += "0";

	clock += hh + ":";
	if (mm < 10) clock += '0';
	clock += mm;
	return (clock);
}
app.post('/updateAvatar', upload.single('updateAvatar'), function(req, res) {
	var nowTime = CurentTime();
	if (req.file != undefined) {
		var fileName = new Date().getTime() + ".jpg";
		var imgUrl = __dirname + "/public/images/user/" + fileName;
		fs.readFile(req.file.path, function(err, data) {
			fs.writeFile(imgUrl, data, function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
		var pictureUrl = "images/user/" + fileName;
		var sql = "update userInfo set avatarUrl=? where id=" + req.body.uid;
		var params = pictureUrl;
		conn.query(sql, params, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
		});
		res.sendFile(__dirname + "/public/" + "manage.html");
	}
});
app.get('/updateUserInfo', function(req, res) {
	var sql = "update userInfo set userName=?,indexUrl=? where id=" + req.query.uid;
	var params = [req.query.userName, req.query.indexUrl];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
	});
	res.sendFile(__dirname + "/public/" + "manage.html");
});
app.post('/postSumit', upload.single('articleCover'), function(req, res) {
	var articleTitle = req.body.articleTitle;
	var postContent = req.body.postContent;
	var articleType1 = req.body.articleType1;
	var articleType2 = req.body.articleType2;
	var articleTags = req.body.articleTags;
	var categoryRelationshipId;
	var sql1 = "select id from categoryRelationship where aid=? and bid=?";
	var params1 = [articleType1, articleType2];
	conn.query(sql1, params1, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		categoryRelationshipId = results[0].id;
		var articleCoverUrl = null;
		var nowTime = CurentTime();
		if (req.file != undefined && req.file != '') {
			var fileName = new Date().getTime() + ".jpg";
			var imgUrl = __dirname + "/public/images/postsImg/" + fileName;
			fs.readFile(req.file.path, function(err, data) {
				fs.writeFile(imgUrl, data, function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
			articleCoverUrl = "images/postsImg/" + fileName;
		}

		var sql2 = "insert into post value(0,?,?,?,?,?,?,0)";
		var params2 = [articleTitle, nowTime, nowTime, articleCoverUrl, postContent,
			categoryRelationshipId
		];
		var postId;
		conn.query(sql2, params2, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			postId = results.insertId;
			for (let i = 0; i < articleTags.length; i++) {
				var sql3 = "insert into tagsRelationship value(0,?,?)";
				var params3 = [postId, articleTags[i]];
				conn.query(sql3, params3, function(error, results) {
					if (error) {
						console.log(error);
						return;
					}
					if (i == articleTags.length - 1) {
						res.redirect("postsDetail.html?id=" + postId);
					}
				});
			}
		});
	});
});
app.post('/postUpdate', upload.single('articleCover'), function(req, res) {
	var articleTitle = req.body.articleTitle;
	var postContent = req.body.postContent;
	var articleType1 = req.body.articleType1;
	var articleType2 = req.body.articleType2;
	var articleTags = req.body.articleTags;
	var categoryRelationshipId;
	var sql1 = "select id from categoryRelationship where aid=? and bid=?";
	var params1 = [articleType1, articleType2];
	conn.query(sql1, params1, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		categoryRelationshipId = results[0].id;
		var articleCoverUrl = null;
		var nowTime = CurentTime();
		if (req.file != undefined && req.file != '') {
			var fileName = new Date().getTime() + ".jpg";
			var imgUrl = __dirname + "/public/images/postsImg/" + fileName;
			fs.readFile(req.file.path, function(err, data) {
				fs.writeFile(imgUrl, data, function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
			articleCoverUrl = "images/postsImg/" + fileName;
		}
		var postId = req.body.id;
		var sql2 = "update post set title=?,updateTime=?,content=?,cid=? where id=" + postId;
		var params2 = [articleTitle, nowTime, postContent, categoryRelationshipId];
		conn.query(sql2, params2, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}

			var sql4 = "delete from tagsRelationship where postid=" + postId;
			conn.query(sql4, function(error4, results4) {
				if (error4) {
					console.log(error4);
					return;
				}

				for (let i = 0; i < articleTags.length; i++) {
					var sql3 = "insert into tagsRelationship value(0,?,?)";
					var params3 = [postId, articleTags[i]];
					conn.query(sql3, params3, function(error, results) {
						if (error) {
							console.log(error);
							return;
						}
						if (i == articleTags.length - 1) {
							if (articleCoverUrl != null) {
								var sql5 =
									"update post set articleCover=? where id=" +
									postId;
								var params5 = articleCoverUrl;
								conn.query(sql5, params5, function(error5,
									results5) {
									if (error5) {
										console.log(error5);
										return;
									}
									res.redirect(
										"postsDetail.html?id=" +
										postId);
								});
							} else {
								var sql5 =
									"update post set articleCover=null where id=" +
									postId;
								conn.query(sql5, function(error5,
									results5) {
									if (error5) {
										console.log(error5);
										return;
									}
									res.redirect(
										"postsDetail.html?id=" +
										postId);
								});
							}
						}
					});
				}
			});
		});
	});
});
app.get('/queryKeyWord', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,a.sticky,c.`name` as c1name,d.`name` as c2name from post a,categoryRelationship b,categoryA c,categoryB d where a.cid=b.id and b.aid=c.id and b.bid=d.id and (a.id like ? or a.title like ? or a.updateTime like ? or a.insertTime like ? or c.`name` like ? or d.`name` like ?) order by updateTime desc,id desc";
	var params = ["%" + req.query.keyWord + "%", "%" + req.query.keyWord + "%", "%" + req.query.keyWord + "%",
		"%" + req.query.keyWord + "%", "%" + req.query.keyWord + "%", "%" + req.query.keyWord + "%"
	];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/addc1', function(req, res) {
	var sql = "insert into categoryA value(0,?)";
	var params = req.query.cname1;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		var sql1 = "select id,name from categoryA";
		conn.query(sql1, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.send(results);
		});
	});
});

app.get('/addc2', function(req, res) {
	var sql = "insert into categoryB value(0,?)";
	var params = req.query.cname2;
	var bid;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		bid = results.insertId;
		var sql1 = "insert into categoryRelationship value(0,?,?)";
		var params1 = [req.query.typeId, bid];
		conn.query(sql1, params1, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			var sql2 =
				"select b.id,b.name as c2name from categoryRelationship a join categoryB b on a.bid=b.id where a.aid = " +
				req.query.typeId;
			conn.query(sql2, function(error, results) {
				if (error) {
					console.log(error);
					return;
				}
				res.send(results);
			});
		});
	});
});

app.get('/addtag', function(req, res) {
	var sql = "insert into tags value(0,?)";
	var params = req.query.tag;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
	});

	var sql1 = "select id,name from tags";
	conn.query(sql1, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});

app.get('/queryOther', function(req, res) {
	var sql1 = "select id,name from categoryA";
	var sql2 = "select id,name from tags";
	var type = [];
	conn.query(sql1, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		type[0] = results;
	});
	conn.query(sql2, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		type[1] = results;
		res.send(type);
	});
});

app.get('/typeName', function(req, res) {
	var sql = "select name from categoryA where id =" + req.query.typeId;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});

app.get('/type2List', function(req, res) {
	var sql =
		"select b.id,b.name as c2name from categoryRelationship a join categoryB b on a.bid=b.id where a.aid = " +
		req.query.typeId;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/type1List', function(req, res) {
	var sql = "select id,`name` from categoryA"
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/queryCKw1', function(req, res) {
	var sql = "select id,`name` from categoryA where id like ? or `name` like ?";
	var params = ["%" + req.query.keyWord + "%", "%" + req.query.keyWord + "%"];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/queryCKw2', function(req, res) {
	var sql =
		"select b.id,b.name as c2name from categoryRelationship a join categoryB b on a.bid=b.id where a.aid = ? and (b.id like ? or b.name like ?)";
	var params = [req.query.typeId, "%" + req.query.keyWord + "%", "%" + req.query.keyWord + "%"];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/updateType1', function(req, res) {
	var sql = "update categoryA set `name`=? where id=" + req.query.id;
	var params = req.query.tname;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/updateType2', function(req, res) {
	var sql = "update categoryB set `name`=? where id=" + req.query.id;
	var params = req.query.tname;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/deleteType1', function(req, res) {
	var sql2 = "select * from categoryRelationship where aid=" + req.query.id;
	conn.query(sql2, function(error2, results2) {
		if (error2) {
			console.log(error2);
			return;
		}
		if (results2.length != 0) {
			var sql =
				"delete a,b,c from categoryA a join categoryRelationship c on c.aid=a.id join categoryB b on c.bid=b.id where a.id=" +
				req.query.id;
			conn.query(sql, function(error, results) {
				if (error) {
					console.log(error);
					return;
				}
				var sql1 = "select id,`name` from categoryA";
				conn.query(sql1, function(error1, results1) {
					if (error1) {
						console.log(error1);
						return;
					}
					res.send(results1);
				});
			});
		} else {
			var sql = "delete from categoryA where id=" + req.query.id;
			conn.query(sql, function(error, results) {
				if (error) {
					console.log(error);
					return;
				}
				var sql1 = "select id,`name` from categoryA";
				conn.query(sql1, function(error1, results1) {
					if (error1) {
						console.log(error1);
						return;
					}
					res.send(results1);
				});
			});
		}
	});
});
app.get('/deleteType2', function(req, res) {
	var sql = "delete from categoryB where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		var sql1 =
			"select b.id,b.name as c2name from categoryRelationship a join categoryB b on a.bid=b.id where a.aid = " +
			req.query.typeId;
		conn.query(sql1, function(error1, results1) {
			if (error1) {
				console.log(error1);
				return;
			}
			res.send(results1);
		});
	});
});

app.get('/postsAll', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,a.sticky,c.`name` as c1name,c.id as c1id,d.`name` as c2name,d.id as c2id from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id order by sticky desc,insertTime desc,id desc";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/postsQuery', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,a.sticky,c.`name` as c1name,d.`name` as c2name from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id order by insertTime desc,id desc";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/postsDetail', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,c.`name` as c1name,d.`name` as c2name,c.id as c1id,d.id as c2id from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id where a.id=? order by insertTime desc,id desc";
	var params = req.query.id;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/postsTags', function(req, res) {
	var sql =
		"select a.name as tagname,a.id from tags a join tagsRelationship b on b.tagid = a.id where b.postid=?";
	var params = req.query.id;
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/pagination', function(req, res) {
	var sql =
		"select id,title,articleCover from post where id in ((select max(id) from post where id < ?),(select min(id) from post where id > ?))";
	var params = [req.query.id, req.query.id];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/postsRecent', function(req, res) {
	var sql1 = "select id,title,insertTime from post order by insertTime desc,id desc LIMIT 20";
	conn.query(sql1, function(error1, results1) {
		if (error1) {
			console.log(error1);
			return;
		}
		var arr = [];
		arr.push(results1);
		var sql2 = "select id,name from tags LIMIT 15";
		conn.query(sql2, function(error2, results2) {
			if (error2) {
				console.log(error2);
				return;
			}
			arr.push(results2);
			res.send(arr);
		});
	});
});
app.get('/deletePost', function(req, res) {
	var sql1 = "delete from post where id=" + req.query.id;
	conn.query(sql1, function(error1, results1) {
		if (error1) {
			console.log(error1);
			return;
		}

		var sql2 = "delete from tagsRelationship where postid=" + req.query.id;
		conn.query(sql2, function(error2, results2) {
			if (error2) {
				console.log(error2);
				return;
			}

			var sql4 = "delete from userComment where pid=" + req.query.id;
			conn.query(sql2, function(error2, results2) {
				if (error2) {
					console.log(error2);
					return;
				}

				var sql3 =
					"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,a.sticky,c.`name` as c1name,d.`name` as c2name from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id order by insertTime desc,id desc";
				conn.query(sql3, function(error3, results3) {
					if (error3) {
						console.log(error3);
						return;
					}
					res.send(results3);
				});
			})
		});
	});
});
app.post('/commentSubmit', upload.single('commentImg'), function(req, res) {
	var nowTime = CurentTime();
	var pictureUrl = null;
	if (req.file != undefined) {
		var fileName = new Date().getTime() + ".jpg";
		var imgUrl = __dirname + "/public/images/comment/" + fileName;
		fs.readFile(req.file.path, function(err, data) {
			fs.writeFile(imgUrl, data, function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
		pictureUrl = "images/comment/" + fileName;
	}

	var str = req.headers['user-agent'];
	var userbrowser = str.split(" ")[10].split("/")[0] + " " + str.split(" ")[10].split("/")[1];
	var useros = str.split(" ")[1].substring(1) + " " + str.split(" ")[3].split(".")[0];
	/*var avatarUrl;
	if (req.body.avatarUrl == '') {
		avatarUrl = null;
	} else {
		avatarUrl = req.body.avatarUrl;
	}*/
	var sql = "insert into userComment value(0,?,?,?,?,?,0,?,?)";
	var params = [req.body.pid,
		//req.body.nick,
		req.body.email,
		//req.body.link,
		//avatarUrl,
		nowTime,
		req.body.content,
		pictureUrl,
		useros,
		userbrowser
	];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		var sql =
			"select a.id,a.pid,a.email,a.time,a.content,a.contentImg,a.sticky,a.sys,a.browser,b.indexUrl,b.avatarUrl,b.userName from userComment a left join userInfo b on a.email=b.email where pid=? order by sticky desc, time desc,id desc";
		var parms = req.body.pid;
		conn.query(sql, parms, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.send(results);
		});
	});
});

app.post('/commentSubmit2', upload.single('commentImg'), function(req, res) {
	var nowTime = CurentTime();
	var pictureUrl = null;
	if (req.file != undefined) {
		var fileName = new Date().getTime() + ".jpg";
		var imgUrl = __dirname + "/public/images/comment/" + fileName;
		fs.readFile(req.file.path, function(err, data) {
			fs.writeFile(imgUrl, data, function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
		pictureUrl = "images/comment/" + fileName;
	}

	var str = req.headers['user-agent'];
	var userbrowser = str.split(" ")[10].split("/")[0] + " " + str.split(" ")[10].split("/")[1];
	var useros = str.split(" ")[1].substring(1) + " " + str.split(" ")[3].split(".")[0];
	/*var avatarUrl;
	if (req.body.avatarUrl == '') {
		avatarUrl = null;
	} else {
		avatarUrl = req.body.avatarUrl;
	}*/
	var tonick;
	if(req.body.toNick==''){
		tonick="匿名账户";
	}else{
		tonick=req.body.toNick;
	}
	var sql = "insert into commentInner value(0,?,?,?,?,?,?,?,?,?)";
	var params = [req.body.id,
		//req.body.nick,
		req.body.email,
		tonick,
		req.body.toId,
		//req.body.link,
		//avatarUrl,
		nowTime,
		req.body.content,
		pictureUrl,
		useros,
		userbrowser
	];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		var sql =
			"select a.id,a.cid,a.email,a.toNick,a.toId,b.userName,b.indexUrl,b.avatarUrl,a.time,a.content,a.contentImg,a.sys,a.browser from commentInner a left join userInfo b on a.email=b.email where cid=? order by time desc,id desc";
		var parms = req.body.id;
		conn.query(sql, parms, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.send(results);
		});
	});
});

app.get('/queryComment', function(req, res) {
	var sql =
		"select a.id,a.pid,a.email,a.time,a.content,a.contentImg,a.sticky,a.sys,a.browser,b.indexUrl,b.avatarUrl,b.userName from userComment a left join userInfo b on a.email=b.email where pid=? order by sticky desc, time desc,id desc";
	var parms = req.query.pid;
	conn.query(sql, parms, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});

app.get('/queryCommentInner', function(req, res) {
	var sql =
		"select a.id,a.cid,a.email,a.toNick,a.toId,b.userName,b.indexUrl,b.avatarUrl,a.time,a.content,a.contentImg,a.sys,a.browser from commentInner a left join userInfo b on a.email=b.email where cid=? order by time desc,id desc";
	var parms = req.query.id;
	conn.query(sql, parms, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});

app.post('/boardSubmit', upload.single('commentImg'), function(req, res) {
	var nowTime = CurentTime();
	var pictureUrl = null;
	if (req.file != undefined) {
		var fileName = new Date().getTime() + ".jpg";
		var imgUrl = __dirname + "/public/images/comment/" + fileName;
		fs.readFile(req.file.path, function(err, data) {
			fs.writeFile(imgUrl, data, function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
		pictureUrl = "images/comment/" + fileName;
	}

	var sql = "insert into board value(0,?,?,?,0)";
	var params = [nowTime, req.body.content, pictureUrl];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		var sql =
			"select id,time,content,contentImg,sticky from board order by sticky desc,time desc,id desc";
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.send(results);
		});
	});
});
app.post('/boardSubmit2', upload.single('commentImg'), function(req, res) {
	var nowTime = CurentTime();
	var pictureUrl = null;
	if (req.file != undefined) {
		var fileName = new Date().getTime() + ".jpg";
		var imgUrl = __dirname + "/public/images/comment/" + fileName;
		fs.readFile(req.file.path, function(err, data) {
			fs.writeFile(imgUrl, data, function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
		pictureUrl = "images/comment/" + fileName;
	}

	/*var avatarUrl;
	if (req.body.avatarUrl == '') {
		avatarUrl = null;
	} else {
		avatarUrl = req.body.avatarUrl;
	}*/
	var tonick;
	if(req.body.toNick==''){
		tonick="匿名账户";
	}else{
		tonick=req.body.toNick;
	}
	var sql = "insert into boardInner value(0,?,?,?,?,?,?,?)";
	var params = [req.body.id,
		//req.body.nick,
		req.body.email,
		tonick,
		req.body.toId,
		//req.body.link,
		//avatarUrl,
		nowTime,
		req.body.content,
		pictureUrl
	];
	conn.query(sql, params, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		var sql =
			"select a.id,a.cid,a.email,a.toNick,a.toId,b.userName,b.indexUrl,b.avatarUrl,a.time,a.content,a.contentImg from boardInner a left join userInfo b on a.email=b.email where cid=? order by time desc,id desc";
		var parms = req.body.id;
		conn.query(sql, parms, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.send(results);
		});
	});
});
app.get('/queryboard', function(req, res) {
	var sql =
		"select id,time,content,contentImg,sticky from board order by sticky desc,time desc,id desc";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/queryboardInner', function(req, res) {
	var sql =
		"select a.id,a.cid,a.email,a.toNick,a.toId,b.userName,b.indexUrl,b.avatarUrl,a.time,a.content,a.contentImg from boardInner a left join userInfo b on a.email=b.email where cid=? order by time desc,id desc";
	var parms = req.query.id;
	conn.query(sql, parms, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/stickyPostcancel', function(req, res) {
	var sql = "update post set sticky=0 where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		var sql =
			"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,a.sticky,c.`name` as c1name,d.`name` as c2name from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id order by insertTime desc,id desc";
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.send(results);
		});
	});
});
app.get('/stickyPost', function(req, res) {
	var sql = "update post set sticky=0";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		var sql = "update post set sticky=1 where id=" + req.query.id;
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			var sql =
				"select a.id,a.title,a.insertTime,a.updateTime,a.articleCover,a.content,a.sticky,c.`name` as c1name,d.`name` as c2name from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id order by insertTime desc,id desc";
			conn.query(sql, function(error, results) {
				if (error) {
					console.log(error);
					return;
				}
				res.send(results);
			});
		});
	});

});
app.get('/stickyBoard', function(req, res) {
	var sql = "update board set sticky=0";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		var sql = "update board set sticky=1 where id=" + req.query.id;
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.end();
		});
	});
});
app.get('/stickyComm', function(req, res) {
	var sql = "update userComment set sticky=0";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		var sql = "update userComment set sticky=1 where id=" + req.query.id;
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.end();
		});
	});
});
app.get('/stickyCancel', function(req, res) {
	var sql = "update board set sticky=0 where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.end();
	});
});
app.get('/stickyCancelComm', function(req, res) {
	var sql = "update userComment set sticky=0 where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.end();
	});
});
app.get('/deleteBoard', function(req, res) {
	var sql = "delete from board where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		var sql = "delete from boardInner where cid=" + req.query.id;
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.end();
		});
	});
});
app.get('/deleteBoardInner', function(req, res) {
	var sql = "delete from boardInner where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.end();
	});
});
app.get('/deleteComm', function(req, res) {
	var sql = "delete from userComment where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}

		var sql = "delete from commentInner where cid=" + req.query.id;
		conn.query(sql, function(error, results) {
			if (error) {
				console.log(error);
				return;
			}
			res.end();
		});
		res.end();
	});
});
app.get('/deleteCommInner', function(req, res) {
	var sql = "delete from commentInner where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.end();
	});
});
app.get('/queryTags', function(req, res) {
	var sql = "select id,name from tags";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/deleteTag', function(req, res) {
	var sql = "delete from tags where id=" + req.query.id;
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.end();
	});
});
app.get('/queryTagsKw', function(req, res) {
	var sql = "select id,name from tags where id like ? or name like ?";
	var parms = ["%" + req.query.kw + "%", "%" + req.query.kw + "%"]
	conn.query(sql, parms, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/tagsUpdate', function(req, res) {
	var sql = "update tags set name=? where id=?";
	var parms = [req.query.name, req.query.id]
	conn.query(sql, parms, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.end();
	});
});
app.get('/searchPost', function(req, res) {
	var sql = "select id,title from post where title like ?";
	var parms = "%" + req.query.kw + "%";
	conn.query(sql, parms, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/queryCategory', function(req, res) {
	var arr = [];
	var rult = [];
	var sql =
		"select c.id as c1id,c.`name` as c1name,count(c.id) as c1count from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id group by c.`name`";
	conn.query(sql, function(error, results1) {
		if (error) {
			console.log(error);
			return;
		}

		arr = results1;
		for (let i = 0; i < results1.length; i++) {
			var sql =
				"select d.id as c2id,d.`name` as c2name,count(d.id) as c2count from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id where c.id=? group by d.`name`";
			var parms = results1[i].c1id;
			conn.query(sql, parms, function(error, results2) {
				if (error) {
					console.log(error);
					return;
				}
				arr[i].c2list = results2;

				if (i == results1.length - 1) {
					res.send(arr);
				}
			});
		}
	});
});
app.get('/categoryDetail1', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.articleCover from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id where c.id=" +
		req.query.id + " order by a.insertTime desc";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/categoryDetail2', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.articleCover from post a join categoryRelationship b on a.cid=b.id join categoryA c on b.aid=c.id join categoryB d on b.bid=d.id where d.id=" +
		req.query.id + " order by a.insertTime desc";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/categoryTags', function(req, res) {
	var sql =
		"select c.`name`,c.id from post a join tagsRelationship b on a.id=b.postid join tags c on b.tagid=c.id group by c.`name`";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/categoryDetail3', function(req, res) {
	var sql =
		"select a.id,a.title,a.insertTime,a.articleCover from post a join tagsRelationship b on a.id=b.postid join tags c on b.tagid=c.id where c.id=" +
		req.query.id + " order by a.insertTime desc";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});
app.get('/postsLimit3', function(req, res) {
	var sql = "select id,title,articleCover from post order by insertTime desc LIMIT 3";
	conn.query(sql, function(error, results) {
		if (error) {
			console.log(error);
			return;
		}
		res.send(results);
	});
});

var server = app.listen(8888, function() {
	console.log("start");
})
