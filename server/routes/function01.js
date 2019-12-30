let express = require('express');
let router = express.Router();
let sql_operation = require("./operation");
let d3 = require('d3');

router.get("/test", function(req, res, next) {
    sql_operation.query('select * from students_origin', data=>{
        res.send(data);
    });
});

//http://localhost:3000/major_sex?major=18软件技术
router.get("/major_sex", function(req, res, next) {
    sql_operation.query(`select Sex,Major from students_origin where Major = '${req.query.major}'`, data=>{
        res.send(d3.nest().key(d=>d.Sex).entries(data).map(d=>{
            return {name: d.key, value:d.values.length}
        }));
    });
});

router.get("/major_dept", function(req, res, next) {
    sql_operation.query(`select Dept from cost_pro where Major = '${req.query.major}'`, data=>{
        res.send(d3.nest().key(d=>d.Dept).entries(data).map(d=>{
            return {name: d.key, value:d.values.length}
        }));
    });
});

router.get("/major_num", function(req, res, next) {
    sql_operation.query(`select Major from students_origin`, data=>{
        res.send(d3.nest().key(d=>d.Major).entries(data).map(d=>{
            return {name: d.key, value:d.values.length}
        }));
    });
});

router.get("/major_sex_dept", function(req, res, next) {
    sql_operation.query(`select Sex, Dept from cost_pro where Major =  '${req.query.major}'`, data=>{
        let Dept = [
            "第一食堂",
            "第二食堂",
            "第三食堂",
            "第四食堂",
            "第五食堂",
            "好利来食品店",
            "财务处",
            "红太阳超市"
        ];
        res.send(d3.nest().key(d=>d.Sex).entries(data).map(d=>{
            let total = d.values.length;
            return {name:d.key,data:d3.nest().key(d=>d.Dept).entries(d.values).map(d=>{
                    return {
                        name:d.key,
                        value:d.values.length/total
                    }
                })
                    .filter(d=>Dept.includes(d.name))
                    .sort((a,b)=>Dept.indexOf(a.name)-Dept.indexOf(b.name))
            }
        }))

    });
});

router.get("/all_dept", function(req, res, next) {
    sql_operation.query(`select Dept from cost_pro`, data=>{
        res.send(d3.nest().key(d=>d.Dept).entries(data).map(d=>{
            return {name: d.key, value:d.values.length}
        }));
    });
});


router.get("/major_cost", function(req, res, next) {
    let DateFormat = d3.timeFormat('%Y-%m-%d %H:%M');
    sql_operation.query(`select Date,Major from cost_pro where Major =  '${req.query.major}'`, data=>{
        data.forEach(d=>{
            d.Date = new Date(d.Date);
            d.Date.setSeconds(0);
            d.Date.setMinutes(d.Date.getMinutes() - d.Date.getMinutes()%10);
        });
        res.send(d3.nest().key(d=>d.Date).entries(data).map(d=>{
            return {
                date:DateFormat(new Date(d.key)),
                value:d.values.length
            }
        }));
    });
});
module.exports = router;
