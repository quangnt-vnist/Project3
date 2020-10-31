export const configurationSalary = {
    configurationImport,
    templateImport,
};

function configurationImport(translate) {
    let config = {
        rowHeader: { // Số dòng tiêu đề của bảng
            description: translate('human_resource.rowHeader'),
            value: 2
        },
        sheets: { // Tên các sheet
            description: translate('human_resource.sheets_name'),
            value: ["Sheet1"]
        },
        employeeNumber: { // Mã nhân viên
            columnName: translate('human_resource.staff_number'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.staff_number').toLowerCase()}`,
            value: translate('human_resource.staff_number')
        },
        employeeName: { // Họ và tên
            columnName: translate('human_resource.staff_name'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.staff_name').toLowerCase()}`,
            value: translate('human_resource.staff_name')
        },
        mainSalary: { // Tiền lương chính
            columnName: translate('human_resource.salary.table.main_salary'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.salary.table.main_salary').toLowerCase()}`,
            value: translate('human_resource.salary.table.main_salary')
        },
        bonus: { // Lương thưởng khác
            columnName: translate('human_resource.salary.other_salary'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.salary.other_salary').toLowerCase()}`,
            value: ["Thưởng đầu hộp SanFoVet", "Thưởng đầu hộp ViaVet"],
        },
    };

    return config;
}

function templateImport(translate) {
    let templateImport = {
        fileName: translate('human_resource.salary.file_name_export'),
        dataSheets: [{
            sheetName: "Sheet1",
            sheetTitle: translate('human_resource.salary.file_name_export'),
            tables: [{
                rowHeader: 2,
                merges: [{
                    key: "other",
                    columnName: translate('human_resource.salary.other_salary'),
                    keyMerge: 'bonus0',
                    colspan: 2
                }],
                columns: [{
                        key: "STT",
                        value: translate('human_resource.stt'),
                        width: 7
                    },
                    {
                        key: "month",
                        value: translate('human_resource.month'),
                        width: 10
                    },
                    {
                        key: "year",
                        value: translate('human_resource.work_plan.year'),
                        width: 10
                    },
                    {
                        key: "employeeNumber",
                        value: translate('human_resource.staff_number')
                    },
                    {
                        key: "fullName",
                        value: translate('human_resource.staff_name'),
                        width: 20
                    },
                    {
                        key: "organizationalUnit",
                        value: translate('human_resource.unit'),
                        width: 25
                    },
                    {
                        key: "gender",
                        value: translate('human_resource.profile.gender')
                    },
                    {
                        key: "birthdate",
                        value: translate('human_resource.profile.date_birth')
                    },
                    {
                        key: "status",
                        value: translate('human_resource.profile.status_work')
                    },
                    {
                        key: "mainSalary",
                        value: translate('human_resource.salary.table.main_salary'),
                    },
                    {
                        key: 'bonus0',
                        value: 'Thưởng đầu hộp SanFoVet'
                    },
                    {
                        key: 'bonus1',
                        value: 'Thưởng đầu hộp ViaVet'
                    },
                    {
                        key: "total",
                        value: translate('human_resource.salary.table.total_salary'),
                    },
                ],
                data: [{
                    STT: 1,
                    employeeNumber: 'MS1256398',
                    fullName: "Nguyễn Văn A",
                    mainSalary: 15000000,
                    birthdate: new Date("1995-12-10"),
                    status: translate('human_resource.profile.active'),
                    gender: translate('human_resource.profile.male'),
                    organizationalUnit: 'Ban giám đốc',
                    total: 30000000,
                    month: 5,
                    year: 2020,
                    bonus0: 10000000,
                    bonus1: 5000000
                }, {
                    STT: 2,
                    employeeNumber: 'MS1256596',
                    fullName: "Nguyễn Thị C",
                    mainSalary: 15000000,
                    birthdate: new Date("1989-5-25"),
                    status: translate('human_resource.profile.active'),
                    gender: translate('human_resource.profile.male'),
                    organizationalUnit: 'Phòng kinh doanh',
                    total: 30000000,
                    month: 5,
                    year: 2020,
                    bonus0: 10000000,
                    bonus1: 5000000
                }]
            }, ]
        }, ]
    }

    return templateImport;
}