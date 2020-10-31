const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('./terms');

const {
    EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet,
    User,
    OrganizationalUnit,
    Task
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
        if (!db.models.EmployeeKpi) EmployeeKpi(db);
        if (!db.models.EmployeeKpiSet) EmployeeKpiSet(db);
        if (!db.models.OrganizationalUnitKpi) OrganizationalUnitKpi(db);
        if (!db.models.OrganizationalUnitKpiSet) OrganizationalUnitKpiSet(db);
        if (!db.models.User) User(db);
        if (!db.models.OrganizationalUnit) OrganizationalUnit(db);
        if (!db.models.Task) Task(db);
        console.log("models_list", db.models);
    }

    initModels(vnistDB);

    console.log("Tạo dữ liệu cho ban giám đốc");

    /**
     * Tạo dữ liệu cho ban giám đốc
     * @organizationalUnit Ban giám đốc
     * @dean Nguyễn Văn An
     * @viceDean Trần Văn Bình
     * @employee_1 Vũ Thị Cúc
     * @employee_2 Nguyễn Văn Danh
     * @currentYear Năm hiện tại
     * @currentMonth Tháng hiện tại
     */
    var dean = await User(vnistDB).findOne({ name: "Nguyễn Văn An" });
    var viceDean = await User(vnistDB).findOne({ name: "Trần Văn Bình" });
    var employee_1 = await User(vnistDB).findOne({ name: "Vũ Thị Cúc" });
    var employee_2 = await User(vnistDB).findOne({ name: "Nguyễn Văn Danh" });
    var employee_3 = await User(vnistDB).findOne({ name: "Phạm Đình Phúc" });
    var organizationalUnit_1 = await OrganizationalUnit(vnistDB).findOne({ name: "Ban giám đốc" });
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();

    console.log("Đang tạo dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi Set
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi Set");

    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet(vnistDB).insertMany([
        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: 85,
            employeePoint: 89,
            approvedPoint: 79,
            status: 1
        }, {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: 86,
            employeePoint: 94,
            approvedPoint: 81,
            status: 0
        },
    ]);

    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi");

    var organizationalUnitKpiArray_1 = []; // organizationalUnitKpiArray_1[i] là mảng các kpi ban giám đốc 

    organizationalUnitKpiArray_1[0] = await OrganizationalUnitKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: null,
            weight: 5,
            criteria: "Phê duyệt công việc",
            type: 1,
            automaticPoint: 79,
            employeePoint: 90,
            approvedPoint: 83
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: null,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            type: 2,
            automaticPoint: 89,
            employeePoint: 90,
            approvedPoint: 88
        }, {
            name: "Tăng doanh số bán hàng 20 tỷ",
            parent: null,
            weight: 40,
            criteria: "Doanh số bán hàng",
            type: 0,
            automaticPoint: 85,
            employeePoint: 88,
            approvedPoint: 78
        }, {
            name: "Phát triển chuỗi bán hàng ở Đà Nẵng",
            parent: null,
            weight: 50,
            criteria: "Tăng số lượng cửa hàng",
            type: 0,
            automaticPoint: 85,
            employeePoint: 90,
            approvedPoint: 79
        }
    ]);

    organizationalUnitKpiArray_1[1] = await OrganizationalUnitKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: null,
            weight: 5,
            criteria: "Phê duyệt công việc",
            type: 1,
            automaticPoint: 84,
            employeePoint: 90,
            approvedPoint: 81
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: null,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            type: 2,
            automaticPoint: 93,
            employeePoint: 93,
            approvedPoint: 88
        }, {
            name: "Mở rộng thị trường ở ở các nước",
            parent: null,
            weight: 35,
            criteria: "Mở rộng thị trường",
            type: 0,
            automaticPoint: 93,
            employeePoint: 95,
            approvedPoint: 88
        }, {
            name: "Củng cố nguồn nhân lực ở HN",
            parent: null,
            weight: 55,
            criteria: "Củng cố nhân sự",
            type: 0,
            automaticPoint: 80,
            employeePoint: 93,
            approvedPoint: 75
        }
    ]);


    /**
     * Gắn các KPI vào tập KPI của đơn vị
     */
    for (let i = 0; i < 2; i++) {
        organizationalUnitKpiSet[i] = await OrganizationalUnitKpiSet(vnistDB).findByIdAndUpdate(
            organizationalUnitKpiSet[i], { $push: { kpis: organizationalUnitKpiArray_1[i].map(x => { return x._id }) } }, { new: true }
        );
    }


    console.log("Khởi tạo Employee Kpi Set");


    var employeeKpiSet_1 = await EmployeeKpiSet(vnistDB).insertMany([
        {
            organizationalUnit: organizationalUnit_1,
            creator: employee_1,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: 86,
            employeePoint: 88,
            approvedPoint: 79,
            status: 2,
        }, {
            organizationalUnit: organizationalUnit_1,
            creator: employee_1,
            approver: viceDean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: 93,
            employeePoint: 95,
            approvedPoint: 87,
            status: 2,
        },
    ]);

    var employeeKpiSet_2 = await EmployeeKpiSet(vnistDB).insertMany([
        {
            organizationalUnit: organizationalUnit_1,
            creator: employee_2,
            approver: dean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: 86,
            employeePoint: 90,
            approvedPoint: 80,
            status: 2,
        }, {
            organizationalUnit: organizationalUnit_1,
            creator: employee_2,
            approver: dean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: 82,
            employeePoint: 92,
            approvedPoint: 77,
            status: 2,
        },
    ]);

    var employeeKpiSet_3 = await EmployeeKpiSet(vnistDB).insertMany([
        {
            organizationalUnit: organizationalUnit_1,
            creator: employee_3,
            approver: dean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: 75,
            employeePoint: 90,
            approvedPoint: 80,
            status: 2,
        }, {
            organizationalUnit: organizationalUnit_1,
            creator: employee_3,
            approver: dean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: 82,
            employeePoint: 75,
            approvedPoint: 77,
            status: 2,
        },
    ]);


    console.log("Khởi tạo Employee Kpi");

    var employee_1KpiArray = []; // employee_1KpiArray[i] là mảng các kpi

    employee_1KpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[0][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 2,
            type: 1,
            automaticPoint: 80,
            employeePoint: 90,
            approvedPoint: 83
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[0][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 2,
            type: 2,
            automaticPoint: 92,
            employeePoint: 90,
            approvedPoint: 87
        }, {
            name: "Tăng doanh số bán hàng 10 tỷ",
            parent: organizationalUnitKpiArray_1[0][2]._id,
            weight: 40,
            criteria: "Doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: 80,
            employeePoint: 86,
            approvedPoint: 75
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray_1[0][2]._id,
            weight: 50,
            criteria: "Tham gia xây dựng kế hoạch bán",
            status: 2,
            type: 0,
            automaticPoint: 90,
            employeePoint: 90,
            approvedPoint: 80
        },
    ]);

    employee_1KpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[1][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 1,
            type: 1,
            automaticPoint: 87,
            employeePoint: 90,
            approvedPoint: 78
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[1][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 1,
            type: 2,
            automaticPoint: 93,
            employeePoint: 93,
            approvedPoint: 80
        }, {
            name: "Mở rộng thị trường ở Đài Loan",
            parent: organizationalUnitKpiArray_1[1][2]._id,
            weight: 40,
            criteria: "Mức độ mở rộng thị trường ở Đài Loan",
            status: 1,
            type: 0,
            automaticPoint: 90,
            employeePoint: 95,
            approvedPoint: 80
        }, {
            name: "Khảo sát thị trường bán hàng ở trong nước",
            parent: organizationalUnitKpiArray_1[1][2]._id,
            weight: 50,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 1,
            type: 0,
            automaticPoint: 95,
            employeePoint: 95,
            approvedPoint: 95
        },
    ]);

    var employee_2KpiArray = []; // employee_2KpiArray[i] là mảng các kpi

    employee_2KpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[0][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 2,
            type: 1,
            automaticPoint: 77,
            employeePoint: 90,
            approvedPoint: 83
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[0][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 2,
            type: 2,
            automaticPoint: 96,
            employeePoint: 90,
            approvedPoint: 88
        }, {
            name: "Khảo sát các chuỗi bán hàng",
            parent: organizationalUnitKpiArray_1[0][3]._id,
            weight: 40,
            criteria: "Các cuộc khảo sát chuỗi bán hàng ở Đà Nẵng",
            status: 2,
            type: 0,
            automaticPoint: 75,
            employeePoint: 90,
            approvedPoint: 78
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray_1[0][3]._id,
            weight: 50,
            criteria: "Tham gia xây dựng kế hoạch bán",
            status: 2,
            type: 0,
            automaticPoint: 95,
            employeePoint: 90,
            approvedPoint: 80
        },
    ]);

    employee_2KpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[1][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 1,
            type: 1,
            automaticPoint: 80,
            employeePoint: 90,
            approvedPoint: 83
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[1][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 1,
            type: 2,
            automaticPoint: 93,
            employeePoint: 93,
            approvedPoint: 95
        }, {
            name: "Tiến hành các cuộc khảo sát nguồn nhân lực ở HN",
            parent: organizationalUnitKpiArray_1[1][3]._id,
            weight: 40,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 1,
            type: 0,
            automaticPoint: 70,
            employeePoint: 95,
            approvedPoint: 70
        }, {
            name: "Tìm kiếm, củng cố nguồn nhân lực ở các vùng",
            parent: organizationalUnitKpiArray_1[1][3]._id,
            weight: 50,
            criteria: "Nguồn nhân lực củng cố được",
            status: 1,
            type: 0,
            automaticPoint: 90,
            employeePoint: 90,
            approvedPoint: 80
        },
    ]);

    var employee_3KpiArray = [];

    employee_3KpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[0][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 1,
            type: 1,
            automaticPoint: 80,
            employeePoint: 90,
            approvedPoint: 83
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[0][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 1,
            type: 2,
            automaticPoint: 93,
            employeePoint: 93,
            approvedPoint: 95
        }, {
            name: "Tiến hành các cuộc khảo sát nguồn nhân lực ở HCM",
            parent: organizationalUnitKpiArray_1[0][2]._id,
            weight: 40,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 1,
            type: 0,
            automaticPoint: 70,
            employeePoint: 95,
            approvedPoint: 70
        }, {
            name: "Tìm kiếm, củng cố nguồn nhân lực ở Đà Nẵng",
            parent: organizationalUnitKpiArray_1[0][3]._id,
            weight: 50,
            criteria: "Nguồn nhân lực củng cố được",
            status: 1,
            type: 0,
            automaticPoint: 90,
            employeePoint: 90,
            approvedPoint: 80
        },
    ]);

    employee_3KpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[1][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 1,
            type: 1,
            automaticPoint: 80,
            employeePoint: 90,
            approvedPoint: 83
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[1][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 1,
            type: 2,
            automaticPoint: 93,
            employeePoint: 93,
            approvedPoint: 95
        }, {
            name: "Tiến hành các cuộc khảo sát nguồn nhân lực ở Cần Thơ",
            parent: organizationalUnitKpiArray_1[1][2]._id,
            weight: 40,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 1,
            type: 0,
            automaticPoint: 70,
            employeePoint: 95,
            approvedPoint: 70
        }, {
            name: "Tìm kiếm, củng cố nguồn nhân lực ở Bình Thuận",
            parent: organizationalUnitKpiArray_1[1][3]._id,
            weight: 50,
            criteria: "Nguồn nhân lực củng cố được",
            status: 1,
            type: 0,
            automaticPoint: 90,
            employeePoint: 90,
            approvedPoint: 80
        },
    ]);

    /**
     * Gắn các KPI vào tập KPI cá nhân
     */
    for (let i = 0; i < 2; i++) {
        // Gắn các kpi vào tập kpi của Vũ Thị Cúc
        employeeKpiSet_1[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
            employeeKpiSet_1[i], { $push: { kpis: employee_1KpiArray[i].map(x => { return x._id }) } }, { new: true }
        );

        // Gắn các kpi vào tập kpi của Nguyễn Văn Danh
        employeeKpiSet_2[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
            employeeKpiSet_2[i], { $push: { kpis: employee_2KpiArray[i].map(x => { return x._id }) } }, { new: true }
        );

        // Gắn các kpi vào tập kpi của Phạm Đình Phúc
        employeeKpiSet_3[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
            employeeKpiSet_3[i], { $push: { kpis: employee_3KpiArray[i].map(x => { return x._id }) } }, { new: true }
        );
        console.log(employeeKpiSet_3)
    }



    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CÔNG VIỆC 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    // Tạo công việc tương ứng với kpi của employee_1
    var task_employee_1 = await Task(vnistDB).insertMany([
        // Tháng trước
        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Mở rộng việc bán hàng ở các khu vực trong Hà Nội",
            description: "Doanh thu thu được từ hoạt động bán hàng so với kế hoạch đã xây dựng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [employee_2], // Người phê duyệt
            consultedEmployees: [employee_2], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee_1].concat([employee_2]).concat([employee_2]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_1KpiArray[0][2]],
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 50,
                        taskImportanceLevel: 7,
                    },
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_2KpiArray[0][0]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    },
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_2KpiArray[0][1]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 90,
        },

        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tham gia vào đội ngũ xây dựng kế hoạch ban hàng",
            description: "KHBH tháng. Cần có vào 25 tháng trước. Yêu cầu kịp thời và sát nhu cầu thị trường",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [employee_2], // Người phê duyệt
            consultedEmployees: [employee_2], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee_1].concat([employee_2]).concat([employee_2]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_1KpiArray[0][3]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 60,
                        taskImportanceLevel: 8,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_2KpiArray[0][0]],
                        automaticPoint: 70,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_2KpiArray[0][1]],
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 10,
                        taskImportanceLevel: 6,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 100,
        },

        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tăng doanh số bán hàng",
            description: "Doanh số bán hàng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth, 25, 12),
            priority: 2, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [employee_2], // Người phê duyệt
            consultedEmployees: [employee_2], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee_1].concat([employee_2]).concat([employee_2]).includes(dean) ? dean : [],
            evaluations: [
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth - 1, 30),
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1,
                            organizationalUnit: organizationalUnit_1,
                            role: "responsible",
                            kpis: [employee_1KpiArray[0][2]],
                            automaticPoint: 80,
                            employeePoint: 80,
                            approvedPoint: 60,
                            contribution: 70,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_2,
                            organizationalUnit: organizationalUnit_1,
                            role: "accountable",
                            kpis: [employee_2KpiArray[0][0]],
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 10,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_2,
                            organizationalUnit: organizationalUnit_1,
                            role: "consulted",
                            kpis: [employee_2KpiArray[0][1]],
                            automaticPoint: 100,
                            employeePoint: 90,
                            approvedPoint: 90,
                            contribution: 20,
                            taskImportanceLevel: 3,
                        },
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                },
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth, 30),
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1,
                            organizationalUnit: organizationalUnit_1,
                            role: "responsible",
                            kpis: [employee_1KpiArray[1][2]],
                            automaticPoint: 90,
                            employeePoint: 100,
                            approvedPoint: 80,
                            contribution: 70,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_2,
                            organizationalUnit: organizationalUnit_1,
                            role: "accountable",
                            kpis: [employee_2KpiArray[1][0]],
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 20,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_2,
                            organizationalUnit: organizationalUnit_1,
                            role: "consulted",
                            kpis: [employee_2KpiArray[1][1]],
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 90,
                            contribution: 10,
                            taskImportanceLevel: 5,
                        },
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                }
            ],
            progress: 40,
        },

        // Tháng hiện tại
        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Ký kết các hợp đồng với các đối tác nước ngoài",
            description: "Đánh giá theo các bản hợp đồng ký kết thành công",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [employee_2], // Người phê duyệt
            consultedEmployees: [employee_2], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee_1].concat([employee_2]).concat([employee_2]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_1KpiArray[1][2]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 60,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_2KpiArray[1][0]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_2KpiArray[1][1]],
                        automaticPoint: 90,
                        employeePoint: 100,
                        approvedPoint: 100,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 80,
        },

        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tiến hành các cuộc khảo sát nhanh",
            description: "Đánh giá theo các cuộc khảo sát được tiến hành",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [employee_2], // Người phê duyệt
            consultedEmployees: [employee_2], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee_1].concat([employee_2]).concat([employee_2]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_1KpiArray[1][3]],
                        automaticPoint: 95,
                        employeePoint: 95,
                        approvedPoint: 95,
                        contribution: 60,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_2KpiArray[1][0]],
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 10,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_2KpiArray[1][1]],
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 95,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 90,
        },


    ]);

    // Tạo công việc tương ứng với kpi của employee_2
    var task_employee_2 = await Task(vnistDB).insertMany([
        // Tháng trước
        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tiến hành các cuộc khảo sát chuỗi bán hàng",
            description: "Đánh giá theo các cuộc khảo sát được tiến hành",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: 1, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [employee_1], // Người phê duyệt
            consultedEmployees: [employee_1], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee_2].concat([employee_1]).concat([employee_1]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_2KpiArray[0][2]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 50,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_1KpiArray[0][0]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_1KpiArray[0][1]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 75,
        },

        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tham gia vào đội ngũ xây dựng kế hoạch ban hàng",
            description: "KHBH tháng. Cần có vào 25 tháng trước. Yêu cầu kịp thời và sát nhu cầu thị trường",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [employee_1], // Người phê duyệt
            consultedEmployees: [employee_1], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee_2].concat([employee_1]).concat([employee_1]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_2KpiArray[0][3]],
                        automaticPoint: 95,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 80,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_1KpiArray[0][0]],
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 10,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_1KpiArray[0][1]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 10,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 50,
        },

        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tăng doanh số bán hàng ở trong nước",
            description: "Doanh số bán hàng trong nước",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth, 28, 12),
            priority: 2, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [employee_1], // Người phê duyệt
            consultedEmployees: [employee_1], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee_2].concat([employee_1]).concat([employee_1]).includes(dean) ? dean : [],
            evaluations: [
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth - 1, 30),
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_2,
                            organizationalUnit: organizationalUnit_1,
                            role: "responsible",
                            kpis: [employee_2KpiArray[0][2]],
                            automaticPoint: 60,
                            employeePoint: 90,
                            approvedPoint: 70,
                            contribution: 80,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1,
                            organizationalUnit: organizationalUnit_1,
                            role: "accountable",
                            kpis: [employee_1KpiArray[0][0]],
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 10,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1,
                            organizationalUnit: organizationalUnit_1,
                            role: "consulted",
                            kpis: [employee_1KpiArray[0][1]],
                            automaticPoint: 95,
                            employeePoint: 90,
                            approvedPoint: 90,
                            contribution: 10,
                            taskImportanceLevel: 5,
                        },
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                },
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth, 30),
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_2,
                            organizationalUnit: organizationalUnit_1,
                            role: "responsible",
                            kpis: [employee_2KpiArray[1][2]],
                            automaticPoint: 90,
                            employeePoint: 100,
                            approvedPoint: 80,
                            contribution: 50,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1,
                            organizationalUnit: organizationalUnit_1,
                            role: "accountable",
                            kpis: [employee_1KpiArray[1][0]],
                            automaticPoint: 80,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 20,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1,
                            organizationalUnit: organizationalUnit_1,
                            role: "consulted",
                            kpis: [employee_1KpiArray[1][1]],
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 30,
                            taskImportanceLevel: 5,
                        },
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                }
            ],
            progress: 85,
        },

        // Tháng hiện tại
        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tiến hành các khảo sát về nguồn nhân lực",
            description: "Đánh giá theo các cuộc khảo sát thực hiện được",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: 2, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [employee_1], // Người phê duyệt
            consultedEmployees: [employee_1], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee_2].concat([employee_1]).concat([employee_1]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_2KpiArray[1][2]],
                        automaticPoint: 50,
                        employeePoint: 90,
                        approvedPoint: 60,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_1KpiArray[1][0]],
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 95,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_1KpiArray[1][1]],
                        automaticPoint: 90,
                        employeePoint: 100,
                        approvedPoint: 80,
                        contribution: 60,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 60,
        },

        {
            organizationalUnit: organizationalUnit_1,
            creator: dean,
            name: "Tìm kiếm nguồn nhân lực ở các trường đại học",
            description: "Thông qua thống kê khảo sát. Đánh giá theo số lần chậm do lỗi chủ quan. Không chậm: 100%. Chậm 3 lần: 95%. Chậm 5 lần : 90%. Chậm 7 lần: 85%. Chậm >7 lần: 80%",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [employee_1], // Người phê duyệt
            consultedEmployees: [employee_1], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee_2].concat([employee_1]).concat([employee_1]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2,
                        organizationalUnit: organizationalUnit_1,
                        role: "responsible",
                        kpis: [employee_2KpiArray[1][3]],
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 40,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "accountable",
                        kpis: [employee_1KpiArray[1][0]],
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 60,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1,
                        organizationalUnit: organizationalUnit_1,
                        role: "consulted",
                        kpis: [employee_1KpiArray[1][1]],
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 40,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 80,
        },

    ]);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CHO PHÒNG KINH DOANH
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo dữ liệu cho phòng kinh doanh");

    /**
     * Tạo dữ liệu cho phòng kinh doanh
     * @organizationalUnit Phòng kinh doanh
     * @dean Nguyễn Văn Danh
     * @viceDean Trần Thị Én
     * @employee Phạm Đình Phúc
     * @currentYear Năm hiện tại
     * @currentMonth Tháng hiện tại
     */
    dean = await User(vnistDB).findOne({ name: "Nguyễn Văn Danh" });
    viceDean = await User(vnistDB).findOne({ name: "Trần Thị Én" });
    employee = await User(vnistDB).findOne({ name: "Phạm Đình Phúc" });
    var organizationalUnit_2 = await OrganizationalUnit(vnistDB).findOne({ name: "Phòng kinh doanh" });
    now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();

    console.log("Đang tạo dữ liệu ...");

    /**
     * TẠO DỮ LIỆU Organizational Unit Kpi Set
     */

    console.log("Khởi tạo Organizational Unit Kpi Set");

    organizationalUnitKpiSet = await OrganizationalUnitKpiSet(vnistDB).insertMany([
        {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: 88,
            employeePoint: 75,
            approvedPoint: 55,
            status: 1
        }, {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: 89,
            employeePoint: 77,
            approvedPoint: 62,
            status: 1
        },
    ]);

    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi");

    var organizationalUnitKpiArray_2 = []; // organizationalUnitKpiArray_2[i] là mảng các kpi 

    organizationalUnitKpiArray_2[0] = await OrganizationalUnitKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[0][0],
            weight: 5,
            criteria: "Phê duyệt công việc",
            type: 1,
            automaticPoint: 73,
            employeePoint: 73,
            approvedPoint: 45
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[0][1],
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            type: 2,
            automaticPoint: 81,
            employeePoint: 56,
            approvedPoint: 41
        }, {
            name: "Giảm tỷ lệ chi phí bán hàng/Doanh số",
            parent: organizationalUnitKpiArray_1[0][2],
            weight: 50,
            criteria: "Tỷ lệ chi phí bán hàng/Doanh số",
            type: 0,
            automaticPoint: 80,
            employeePoint: 65,
            approvedPoint: 45
        }, {
            name: "Tăng lợi nhuận thu được từ bán hàng",
            parent: organizationalUnitKpiArray_1[0][3],
            weight: 40,
            criteria: "Lợi nhuận thu được từ bán hàng",
            type: 0,
            automaticPoint: 10,
            employeePoint: 90,
            approvedPoint: 70
        }
    ]);

    organizationalUnitKpiArray_2[1] = await OrganizationalUnitKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_1[1][0],
            weight: 5,
            criteria: "Phê duyệt công việc",
            type: 1,
            automaticPoint: 80,
            employeePoint: 80,
            approvedPoint: 47
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_1[1][1],
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            type: 2,
            automaticPoint: 73,
            employeePoint: 64,
            approvedPoint: 42
        }, {
            name: "Mở rộng nghiên cứu thị trường",
            parent: organizationalUnitKpiArray_1[1][2],
            weight: 35,
            criteria: "Các lần nghiên cứu thị trường được thực hiện",
            type: 0,
            automaticPoint: 90,
            employeePoint: 75,
            approvedPoint: 70
        }, {
            name: "Giảm tỷ lệ chi phí mua hàng/Doanh số mua",
            parent: organizationalUnitKpiArray_1[1][3],
            weight: 55,
            criteria: "Tỷ lệ chi phí mua hàng/Doanh số mua",
            type: 0,
            automaticPoint: 90,
            employeePoint: 80,
            approvedPoint: 60
        }
    ]);


    /**
     * Gắn các KPI vào tập KPI của đơn vị
     */
    for (let i = 0; i < 2; i++) {
        organizationalUnitKpiSet[i] = await OrganizationalUnitKpiSet(vnistDB).findByIdAndUpdate(
            organizationalUnitKpiSet[i], { $push: { kpis: organizationalUnitKpiArray_2[i].map(x => { return x._id }) } }, { new: true }
        );
    }


    console.log("Khởi tạo Employee Kpi Set");

    var employeeKpiSet = await EmployeeKpiSet(vnistDB).insertMany([
        {
            organizationalUnit: organizationalUnit_2,
            creator: employee,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: 90,
            employeePoint: 77,
            approvedPoint: 57,
            status: 2,
        }, {
            organizationalUnit: organizationalUnit_2,
            creator: employee,
            approver: viceDean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: 89,
            employeePoint: 77,
            approvedPoint: 62,
            status: 2,
        },
    ]);


    console.log("Khởi tạo Employee Kpi");

    var employeeKpiArray = []; // employee_1KpiArray[i] là mảng các kpi

    employeeKpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_2[0][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 2,
            type: 1,
            automaticPoint: 73,
            employeePoint: 73,
            approvedPoint: 45
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_2[0][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 2,
            type: 2,
            automaticPoint: 81,
            employeePoint: 56,
            approvedPoint: 41
        }, {
            name: "Giảm chi phí bán hàng, tăng doanh số bán hàng",
            parent: organizationalUnitKpiArray_2[0][2]._id,
            weight: 40,
            criteria: "Chi phí mua hàng, doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: 80,
            employeePoint: 65,
            approvedPoint: 45
        }, {
            name: "Tăng lợi nhuận từ bán hàng",
            parent: organizationalUnitKpiArray_2[0][3]._id,
            weight: 50,
            criteria: "Lợi nhuận bán hàng",
            status: 2,
            type: 0,
            automaticPoint: 100,
            employeePoint: 90,
            approvedPoint: 70
        },
    ]);

    employeeKpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
        {
            name: "Phê duyệt công việc",
            parent: organizationalUnitKpiArray_2[1][0]._id,
            weight: 5,
            criteria: "Phê duyệt công việc",
            status: 1,
            type: 1,
            automaticPoint: 80,
            employeePoint: 80,
            approvedPoint: 47
        }, {
            name: "Tư vấn thực hiện công việc",
            parent: organizationalUnitKpiArray_2[1][1]._id,
            weight: 5,
            criteria: "Tư vấn thực hiện công việc",
            status: 1,
            type: 2,
            automaticPoint: 73,
            employeePoint: 64,
            approvedPoint: 42
        }, {
            name: "Tổ chức các cuộc nghiên cứu thị trường trong nước và ngoài nước",
            parent: organizationalUnitKpiArray_2[1][2]._id,
            weight: 40,
            criteria: "Các cuộc nghiên cứu nhu cầu thị trường",
            status: 1,
            type: 0,
            automaticPoint: 90,
            employeePoint: 75,
            approvedPoint: 70
        }, {
            name: "Tăng doanh số bán hàng",
            parent: organizationalUnitKpiArray_2[1][3]._id,
            weight: 50,
            criteria: "Doanh số bán hàng",
            status: 1,
            type: 0,
            automaticPoint: 90,
            employeePoint: 80,
            approvedPoint: 60
        },
    ]);


    /**
     * Gắn các KPI vào tập KPI cá nhân
     */
    for (let i = 0; i < 2; i++) {
        // Gắn các kpi vào tập kpi của Phạm Đình Phúc
        employeeKpiSet[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
            employeeKpiSet[i], { $push: { kpis: employeeKpiArray[i].map(x => { return x._id }) } }, { new: true }
        );

    }



    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CÔNG VIỆC 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    // Tạo công việc tương ứng với kpi của employee
    var task_employee = await Task(vnistDB).insertMany([
        // Tháng trước
        {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            name: "Giảm chi phí bán hàng, tăng doanh số bán hàng trong nước",
            description: "Doanh thu thu được từ hoạt động bán hàng so với kế hoạch đã xây dựng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: 2, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee], // Người thực hiện
            accountableEmployees: [employee], // Người phê duyệt
            consultedEmployees: [employee], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee].concat([employee]).concat([employee]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "responsible",
                        kpis: [employeeKpiArray[0][2]],
                        automaticPoint: 80,
                        employeePoint: 60,
                        approvedPoint: 40,
                        contribution: 60,
                        taskImportanceLevel: 7,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "accountable",
                        kpis: [employeeKpiArray[0][0]],
                        automaticPoint: 80,
                        employeePoint: 70,
                        approvedPoint: 50,
                        contribution: 10,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "consulted",
                        kpis: [employeeKpiArray[0][1]],
                        automaticPoint: 90,
                        employeePoint: 50,
                        approvedPoint: 30,
                        contribution: 30,
                        taskImportanceLevel: 7,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 75,
        },

        {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            name: "Thực hiện các biện pháp để tăng lợi nhận từ việc bán hàng",
            description: "Đánh giá theo lợi nhuận bán hàng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee], // Người thực hiện
            accountableEmployees: [employee], // Người phê duyệt
            consultedEmployees: [employee], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee].concat([employee]).concat([employee]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "responsible",
                        kpis: [employeeKpiArray[0][3]],
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 70,
                        contribution: 60,
                        taskImportanceLevel: 8,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "accountable",
                        kpis: [employeeKpiArray[0][0]],
                        automaticPoint: 70,
                        employeePoint: 60,
                        approvedPoint: 50,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "consulted",
                        kpis: [employeeKpiArray[0][1]],
                        automaticPoint: 60,
                        employeePoint: 50,
                        approvedPoint: 35,
                        contribution: 20,
                        taskImportanceLevel: 6,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 50,
        },
        {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            name: "Tăng doanh số bán hàng",
            description: "Doanh số bán hàng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth, 25, 12),
            priority: 1, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee], // Người thực hiện
            accountableEmployees: [employee], // Người phê duyệt
            consultedEmployees: [employee], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee].concat([employee]).concat([employee]).includes(dean) ? dean : [],
            evaluations: [
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth - 1, 30),
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee,
                            organizationalUnit: organizationalUnit_2,
                            role: "responsible",
                            kpis: [employeeKpiArray[0][2]],
                            automaticPoint: 80,
                            employeePoint: 70,
                            approvedPoint: 50,
                            contribution: 30,
                            taskImportanceLevel: 7,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee,
                            organizationalUnit: organizationalUnit_2,
                            role: "accountable",
                            kpis: [employeeKpiArray[0][0]],
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 35,
                            contribution: 50,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee,
                            organizationalUnit: organizationalUnit_2,
                            role: "consulted",
                            kpis: [employeeKpiArray[0][1]],
                            automaticPoint: 100,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 20,
                            taskImportanceLevel: 3,
                        },
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                },
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth, 30),
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee,
                            organizationalUnit: organizationalUnit_2,
                            role: "responsible",
                            kpis: [employeeKpiArray[1][2]],
                            automaticPoint: 90,
                            employeePoint: 80,
                            approvedPoint: 60,
                            contribution: 50,
                            taskImportanceLevel: 7,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee,
                            organizationalUnit: organizationalUnit_2,
                            role: "accountable",
                            kpis: [employeeKpiArray[1][0]],
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 40,
                            contribution: 20,
                            taskImportanceLevel: 5,
                        }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee,
                            organizationalUnit: organizationalUnit_2,
                            role: "consulted",
                            kpis: [employeeKpiArray[1][1]],
                            automaticPoint: 90,
                            employeePoint: 70,
                            approvedPoint: 60,
                            contribution: 30,
                            taskImportanceLevel: 5,
                        },
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                }

            ],
            progress: 80,
        },

        // Tháng hiện tại
        {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            name: "Tiến hành các cuộc nghiên cứu thị trường",
            description: "Đánh giá theo các cuộc nghiên cứu thị trường",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: 2, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee], // Người thực hiện
            accountableEmployees: [employee], // Người phê duyệt
            consultedEmployees: [employee], // Người tư vấn
            informedEmployees: [viceDean], // Người quan sát
            confirmedByEmployees: [employee].concat([employee]).concat([employee]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "responsible",
                        kpis: [employeeKpiArray[1][2]],
                        automaticPoint: 90,
                        employeePoint: 70,
                        approvedPoint: 80,
                        contribution: 50,
                        taskImportanceLevel: 7,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "accountable",
                        kpis: [employeeKpiArray[1][0]],
                        automaticPoint: 90,
                        employeePoint: 80,
                        approvedPoint: 60,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "consulted",
                        kpis: [employeeKpiArray[1][1]],
                        automaticPoint: 90,
                        employeePoint: 100,
                        approvedPoint: 60,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 60,
        },

        {
            organizationalUnit: organizationalUnit_2,
            creator: dean,
            name: "Tăng doanh số bán hàng",
            description: "Doanh số bán hàng",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: 3, // Mức độ ưu tiên
            isArchived: false,
            status: "finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee], // Người thực hiện
            accountableEmployees: [employee], // Người phê duyệt
            consultedEmployees: [employee], // Người tư vấn
            informedEmployees: [dean], // Người quan sát
            confirmedByEmployees: [employee].concat([employee]).concat([employee]).includes(dean) ? dean : [],
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "responsible",
                        kpis: [employeeKpiArray[1][3]],
                        automaticPoint: 90,
                        employeePoint: 80,
                        approvedPoint: 60,
                        contribution: 10,
                        taskImportanceLevel: 10,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "accountable",
                        kpis: [employeeKpiArray[1][0]],
                        automaticPoint: 80,
                        employeePoint: 70,
                        approvedPoint: 40,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    }, { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee,
                        organizationalUnit: organizationalUnit_2,
                        role: "consulted",
                        kpis: [employeeKpiArray[1][1]],
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 50,
                        contribution: 30,
                        taskImportanceLevel: 7,
                    },
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 40,
        },


    ]);

    vnistDB.close();

    console.log("End init sample company database!");
}

initSampleCompanyDB().catch(err => {
    console.log(err);
    process.exit(0);
})