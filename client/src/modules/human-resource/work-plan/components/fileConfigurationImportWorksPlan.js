export const configurationWorkPlan = {
    configurationImport,
    templateImport,
};

function configurationImport(translate) {
    let config = {
        rowHeader: { // Số dòng tiêu đề của bảng
            description: translate('human_resource.rowHeader'),
            value: 1
        },
        sheets: { // Tên các sheet
            description: translate('human_resource.sheets_name'),
            value: ["Sheet1"]
        },
        type: { // Thể loại
            columnName: translate('human_resource.work_plan.table.type'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.work_plan.table.type').toLowerCase()}`,
            value: translate('human_resource.work_plan.table.type')
        },
        startDate: { // Ngày bắt đầu
            columnName: translate('human_resource.work_plan.table.start_date'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.work_plan.table.start_date').toLowerCase()}`,
            value: translate('human_resource.work_plan.table.start_date')
        },
        endDate: { // Ngày kết thúc
            columnName: translate('human_resource.work_plan.table.end_date'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.work_plan.table.end_date').toLowerCase()}`,
            value: translate('human_resource.work_plan.table.end_date')
        },
        description: { // Mô tả lịch nghỉ
            columnName: translate('human_resource.work_plan.table.describe_timeline'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.work_plan.table.describe_timeline').toLowerCase()}`,
            value: translate('human_resource.work_plan.table.describe_timeline')
        },
    };

    return config;

}

function templateImport(translate) {
    let templateImport = {
        fileName: translate('human_resource.work_plan.file_name_export'),
        dataSheets: [{
            sheetName: "sheet1",
            sheetTitle: translate('human_resource.work_plan.file_name_export'),
            tables: [{
                columns: [{
                        key: "STT",
                        value: translate('human_resource.stt'),
                        width: 7
                    },
                    {
                        key: 'type',
                        value: translate('human_resource.work_plan.table.type'),
                        width: 35
                    },
                    {
                        key: "startDate",
                        value: translate('human_resource.work_plan.table.start_date')
                    },
                    {
                        key: "endDate",
                        value: translate('human_resource.work_plan.table.end_date')
                    },
                    {
                        key: "description",
                        value: translate('human_resource.work_plan.table.describe_timeline'),
                        width: 35
                    },
                ],
                data: [{
                        STT: 1,
                        description: "Nghỉ quốc khánh 2/9",
                        endDate: new Date('2020-09-02'),
                        startDate: new Date('2020-09-02'),
                        type: translate('human_resource.work_plan.time_for_holiday'),
                    },
                    {
                        STT: 2,
                        description: "Không cần nhiều nhân sự",
                        endDate: new Date('2020-09-23'),
                        startDate: new Date('2020-09-26'),
                        type: translate('human_resource.work_plan.time_allow_to_leave'),
                    },
                ]
            }]
        }, ]
    };
    return templateImport;
};