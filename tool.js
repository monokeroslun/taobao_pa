var http = require('http');
var env = require('jsdom').env;
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var fs = require("fs");
/*返回指定页面的全部url*/
function getUrl(options) {
    console.log('getUrl');
    var options = {
        host: options['host'],
        //hostname:url.parse( 'www.byvoid.com'),
        port: '80',
        path: options['path'],
        method: 'GET'
    };
    var url = new Array();//所有的页面
    var price = new Array();//所有页面相对的价格
    var sum = new Array();//所有的页面对应的sum
    var bufferHelper = new BufferHelper();
    var req = http.get(options, function(res) {
        var pageData = "";
        //res.setEncoding('UTF-8');
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });

        res.on('end', function() {
            var html = bufferHelper.toBuffer();
            var html = iconv.decode(html, 'GBK');
            console.log(html);


            env(html, function(errors, window) {
                console.log(errors);

                var $ = require('jquery')(window);

                // console.log($('p.desc').eq(2).text());
                $('div.shop-hesper-bd').each(function() {

                    $(this).children('.item3line1').each(function() {
                        $(this).children('.item').each(function() {
                            url.push($(this).children('.detail').children('.item-name').attr('href'));
                            sum.push($(this).children('.detail').children('.item-name').text());
                            price.push($(this).children('.detail').children('.attribute').find('.c-price').text());
                            console.log("啦啦");
                        });



                    });

                });
                //返回全部的url
                  var fileName=1;
                  if(url!=undefined&&url.length>0){
                  	for(var j = 0;j<url.length;j++){
                  		getPic(url[j],fileName);
                  		getInfo(url[j],fileName++,sum[j],price[j]);
                  	}
                  }






                /*********/
            });

        });
    })
    
}

/*返回指定url的所有照片，并编号存入文件夹*/
function getPic(url, fileName) {
        console.log('getPic');
        var pUrls = new Array(); //picture的url
     /*   var options = {
            host: options['host'],
            //hostname:url.parse( 'www.byvoid.com'),
            port: '80',
            path: options['path'],
            method: 'GET'
        };*/
       // var url = new Array();
        var bufferHelper = new BufferHelper();
        var req = http.get(url, function(res) {
            var pageData = "";
            //res.setEncoding('UTF-8');
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            });

            res.on('end', function() {
                var html = bufferHelper.toBuffer();
                var html = iconv.decode(html, 'GBK');
                console.log(html);


                env(html, function(errors, window) {
                    console.log(errors);

                    var $ = require('jquery')(window);
                    $('#J_UlThumb').find('img').each(function() {
                        console.log('a');
                        var picUrl = $(this).attr('data-src');
                        var suoyin = picUrl.indexOf("_50x50.jpg");

                        picUrl = picUrl.slice(0, suoyin);
                        pUrls.push(picUrl);
                        console.log(picUrl);
                    });


                    // console.log($('p.desc').eq(2).text());
                    //获得图片地址 [src$='.jpg']
                    //下载图片并存入文件夹
                    savePic(pUrls, fileName);
                });


            });
        })

    }
    /*返回指定url的info，并编号存入文件夹*/

function getInfo(url, fileName, sum, price) {
    console.log('getInfo');
    if (fs.existsSync("./" + fileName)) {
        fs.writeFile("./" + fileName + "/" + fileName + ".txt", sum+'\n'+url+'\n'+price, function(err) {
            if (err) {
                console.log("down fail");
            }

            console.log("down success");
        });
    } else {
        //创建该文件夹
        fs.mkdirSync("./" + fileName);
        fs.writeFile("./" + fileName + "/" + fileName + ".txt", sum+'\n'+url+'\n'+price, function(err) {
            if (err) {
                console.log("down fail");
            }

            console.log("down success");
        });
    }

}


/*创建文件并写入信息*/
function writeInfo() {

    }
    /*构造初始化文件*/

function createFile() {

}

function getTest(options) {
    console.log('getTest');
    var options = {
        host: options['host'],
        //hostname:url.parse( 'www.byvoid.com'),
        port: '80',
        path: options['path'],
        method: 'GET'
    };
    var url = 'http://img02.taobaocdn.com/imgextra/i2/33197951/T2r3htX2xXXXXXXXXX-33197951.jpg';
    var bufferHelper = new BufferHelper();
    var req = http.get(url, function(res) {
        var pageData = "";
        //res.setEncoding('UTF-8');
        //res.setEncoding("binary"); 
        res.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });

        res.on('end', function() {
            var html = bufferHelper.toBuffer();
            //  var html = iconv.decode(html, 'GBK');
            console.log(html);

            fs.writeFile("./logonew.jpg", html, "binary", function(err) {
                if (err) {
                    console.log("down fail");
                }
                console.log("down success");
            });


        });
    })
}


/*存储图片到目标文件夹 urls为本页图片的所有地址，fileName为所存的目标文件夹*/
function savePic(urls, fileName) {
    var num = 1;
    console.log('savePic');
    if (urls != undefined && urls.length != 0) {
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            console.log('savePic' + url);

            var req = http.get(url, function(res) {
                var bufferHelper = new BufferHelper();
                var pageData = "";
                //res.setEncoding('UTF-8');
                //res.setEncoding("binary"); 
                res.on('data', function(chunk) {
                    bufferHelper.concat(chunk);
                });

                res.on('end', function() {
                    var pic = bufferHelper.toBuffer();
                    //  var html = iconv.decode(html, 'GBK');
                    console.log(pic);
                    if(fs.existsSync("./" + fileName)){
                    fs.writeFile("./" + fileName + "/" + (num++) + ".jpg", pic, "binary", function(err) {
                        if (err) {
                            console.log("down fail");
                        }

                        console.log("down success");
                    });
                     }else{
                     	//创建该文件夹
                     	fs.mkdirSync("./" + fileName);
                     	fs.writeFile("./" + fileName + "/" + (num++) + ".jpg", pic, "binary", function(err) {
                        if (err) {
                            console.log("down fail");
                        }

                        console.log("down success");
                    });
                     }

                });
            })
        }
    }


}

var SELF = {};
SELF['getUrl'] = getUrl;
SELF['getPic'] = getPic;
SELF['getInfo'] = getInfo;
SELF['savePic'] = savePic;
module.exports = SELF;
