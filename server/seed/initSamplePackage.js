const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('./terms');

const {
    Employee,
    Major,
    CareerPosition,
} = require('../models');

require('dotenv').config();

const initSampleCompanyDB = async () => {
    console.log("Init sample company database, ...");

    /**
     * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
     */

    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
        process.env.DB_AUTHENTICATION === 'true' ?
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                user: process.env.DB_USERNAME,
                pass: process.env.DB_PASSWORD
            } : {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            }
    );
    if (!vnistDB) throw ('DB vnist cannot connect');
    console.log("DB vnist connected");

    /**
     * 1.1 Khởi tạo model cho db
     */
    const initModels = (db) => {
        console.log("models", db.models);
        if (!db.models.Employee) Employee(db);
        if (!db.models.Major) Major(db);
        if (!db.models.CareerPosition) CareerPosition(db);

        console.log("models_list", db.models);
    }

    initModels(vnistDB);

    console.log("Tạo dữ liệu cho gán nhãn chuyên ngành");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        Khởi tạo thông tin chuyên ngành tương đương
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo thông tin chuyên ngành tương đương");

    var majors = await Major(vnistDB).insertMany([
        {
            name: "Máy tính và công nghệ thông tin",
            code: "748",
            group: [{
                name: "Máy tính",
                code: "74801",
                specialized: [{
                    name: "Khoa học máy tính",
                    code: "7480101",
                    type: 1,
                }, {
                    name: "Mạng máy tính và truyền thông dữ liệu",
                    code: "7480102",
                    type: 1,
                }, {
                    name: "Kỹ thuật phần mềm",
                    code: "7480103",
                    type: 1,
                }, {
                    name: "Hệ thống thông tin",
                    code: "7480104",
                    type: 1,
                }, {
                    name: "Kỹ thuật máy tính",
                    code: "7480106",
                    type: 1,
                }, {
                    name: "Công nghệ kỹ thuật máy tính",
                    code: "7480108",
                    type: 1,
                }]
            }, {
                name: "Công nghệ thông tin",
                code: "78402",
                specialized: [{
                    name: "Công nghệ thông tin",
                    code: "7840201",
                    type: 1,
                }, {
                    name: "An toàn thông tin",
                    code: "7840202",
                    type: 1,
                }]
            }]
        }, {
            name: "Công nghệ kỹ thuật",
            code: "751",
            group: [{
                name: "Công nghệ kỹ thuật điện, điện tử và viễn thông",
                code: "75103",
                specialized: [{
                    name: "Công nghệ kỹ thuật điện, điện tử",
                    code: "7510301",
                    type: 1,
                }, {
                    name: "Công nghệ kỹ thuật điện tử - viễn thông",
                    code: "7510302",
                    type: 1,
                }, {
                    name: "Công nghệ kỹ thuật điều khiển và tự động hóa",
                    code: "7510303",
                    type: 1,
                }]
            }]
        }, {
            name: "Kỹ thuật",
            code: "752",
            group: [{
                name: "Kỹ thuật điện, điện tử và viễn thông",
                code: "75202",
                specialized: [{
                    name: "Kỹ thuật ra đa- dẫn đường",
                    code: "7520204",
                    type: 1,
                }, {
                    name: "Kỹ thuật điện tử -  viễn thông",
                    code: "7520207",
                    type: 1,
                }]
            }, {
                name: "Vật lý kỹ thuật",
                code: "75204",
                specialized: [{
                    name: "Vật lý kỹ thuật",
                    code: "7520401",
                    type: 1,
                }, {
                    name: "Kỹ thuật hạt nhân",
                    code: "7520402",
                    type: 1,
                }]
            }]
        }
    ]);

    //END
    console.log("Tạo dữ liệu cho gán nhãn chuyên ngành");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        Khởi tạo thông tin công việc tương đương
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo thông tin công việc tương đương");

    var careerPosition = await CareerPosition(vnistDB).insertMany([
        {
            name: "Giáo dục",
            code: "giao_duc",
            position: [{
                name: "Giảng viên",
                code: "giang_vien",
                description: [{
                    name: "Giảng dạy",
                    code: ["giang_vien", "giang_day"],
                    type: 1,
                }, {
                    name: "Nghiên cứu phát triển ứng dụng công nghệ thông tin",
                    code: ["giang_vien", "nghien_cuu"],
                    type: 1,
                }]
            }, {
                name: "Trợ giảng",
                code: "tro_giang",
                description: [{
                    name: "Hỗ trợ giảng dạy",
                    code: ["tro_giang", "giang_day"],
                    type: 1,
                }, {
                    name: "Hỗ trợ nghiên cứu khoa học",
                    code: ["tro_giang", "nghien_cuu"],
                    type: 1,
                }]
            }]
        }, {
            name: "Công nghệ kỹ thuật",
            code: "cong_nghe_ky_thuat",
            position: [{
                name: "Kỹ thuật viên",
                code: "ky_thuat_vien",
                description: [{
                    name: "Giám sát kỹ thuật an toàn thông tin",
                    code: ["ky_thuat_vien", "giam_sat_attt"],
                    type: 1,
                }, {
                    name: "Giảng dạy đào tạo kĩ thuật ",
                    code: ["ky_thuat_vien", "giang_day"],
                    type: 1,
                }, {
                    name: "Quản lý hệ thống an toàn thông tin",
                    code: ["ky_thuat_vien", "quan_ly"],
                    type: 1,
                }]
            }, {
                name: "Chuyên viên hỗ trợ người dùng",
                code: "chuyen_vien_ho_tro_nguoi_dung",
                description: [{
                    name: "Phối hợp, giám sát và đốc thúc các đơn vị chức năng trong quá trình xử lý các yêu cầu hỗ trợ CNTT đảm bảo các SLA đã được cam kết",
                    code: ["chuyen_vien_ho_tro_nguoi_dung", "giam_sat"],
                    type: 1,
                }, {
                    name: "Thực hiện việc xử lý các yêu cầu hỗ trợ CNTT theo quy trình, hướng dẫn",
                    code: ["chuyen_vien_ho_tro_nguoi_dung", "ho_tro"],
                    type: 1,
                }]
            },{
                name: "Chuyên Viên Quản Trị và Bảo Trì Ứng Dụng",
                code: "chuyen_vien_quan_tri_bao_tri",
                description: [{
                    name: "Tham gia triển khai các dự án công nghệ theo yêu cầu của lãnh đạo",
                    code: ["chuyen_vien_quan_tri_bao_tri", "trien_khai_du_an"],
                    type: 1,
                }, {
                    name: "Xây dựng các quy trình liên quan đến quản trị/ bảo trì các hệ thống ứng dụng",
                    code: ["chuyen_vien_quan_tri_bao_tri", "quan_tri", "bao_tri"],
                    type: 1,
                }] 
            },{
                name: "IT Support - Kỹ Sư Máy Tính/ Mạng",
                code: "it_support",
                description: [{
                    name: "Tư vấn, hỗ trợ, khắc phục sự cố máy tính, mạng LAN, Internet và các thiết bị văn phòng",
                    code: ["it_support", "tu_van", "ho_tro"],
                    type: 1,
                }, {
                    name: "Bảo trì hệ thống máy tính, mạng máy tính và các thiết bị văn phòng",
                    code: ["it_support", "bao_tri"],
                    type: 1,
                }] 
            }]
        }
    ]);

    //END


    vnistDB.close();

    console.log("End init sample package database!");
}

initSampleCompanyDB().catch(err => {
    console.log(err);
    process.exit(0);
})