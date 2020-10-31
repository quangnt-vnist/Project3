export const configTaskTempalte = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 2
    },
    name: {
        columnName: "Tên mẫu",
        description: "Tên tiêu đề ứng với tên mẫu",
        value: "Tên mẫu"
    },
    description: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
    organizationalUnit: {
        columnName: "Đơn vị",
        description: "Tên tiêu đề ứng với đơn vị",
        value: "Đơn vị"
    },
    readByEmployees: {
        columnName: "Người được xem",
        description: "Tên tiêu đề ứng với người được xem",
        value: "Người được xem"
    },
    priority: {
        columnName: "Độ ưu tiên",
        description: "Tên tiêu đề ứng với độ ưu tiên",
        value: "Độ ưu tiên"
    },
    responsibleEmployees: {
        columnName: "Người thực hiện",
        description: "Tên tiêu đề ứng với người thực hiện",
        value: "Người thực hiện"
    },
    accountableEmployees: {
        columnName: "Người phê duyệt",
        description: "Tên tiêu đề ứng với người phê duyệt",
        value: "Người phê duyệt"
    },
    consultedEmployees: {
        columnName: "Người tư vấn",
        description: "Tên tiêu đề ứng với người tư vấn",
        value: "Người tư vấn"
    },
    informedEmployees: {
        columnName: "Người quan sát",
        description: "Tên tiêu đề ứng với người quan sát",
        value: "Người quan sát"
    },
    formula: {
        columnName: "Công thức tính điểm",
        description: "Tên tiêu đề ứng với công thức tính điểm",
        value: "Công thức tính điểm"
    },
    taskActions: {
        columnName: "Danh sách hoạt động",
        description: "Tên tiêu đề ứng với tên hoạt động",
        value: ["Tên hoạt động", "Mô tả hoạt động", "Bắt buộc"]
    },
    taskInformations: {
        columnName: "Danh sách thông tin",
        description: "Tên tiêu đề ứng với tên thông tin",
        value: ["Tên thông tin", "Mô tả thông tin", "Kiểu dữ liệu", "Chỉ quản lý được điền"]
    },
    file: {
        fileName: 'templateImportTaskTemplate',
        fileUrl: '/upload/task/taskTemplateImportForm/templateImportTaskTemplate.xlsx'
    }
}

export const templateImportTaskTemplate = {
    fileName: "Mẫu import mẫu công việc",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách mẫu công việc',
        tables: [{
            rowHeader: 2,
            merges: [{
                key: "taskActions",
                columnName: "Danh sách hoạt động",
                keyMerge: 'actionName',
                colspan: 3
            }, {
                key: "taskInfomations",
                columnName: "Danh sách thông tin",
                keyMerge: 'infomationName',
                colspan: 4
            }],
            columns: [
                { key: "name", value: "Tên mẫu" },
                { key: "description", value: "Mô tả" },
                { key: "organizationalUnits", value: "Đơn vị" },
                { key: "priority", value: "Độ ưu tiên" },
                { key: "readByEmployees", value: "Người được xem" },
                { key: "responsibleEmployees", value: "Người thực hiện" },
                { key: "accountableEmployees", value: "Người phê duyệt" },
                { key: "consultedEmployees", value: "Người tư vấn" },
                { key: "informedEmployees", value: "Người quan sát" },
                { key: "formula", value: "Công thức tính điểm" },
                { key: "actionName", value: "Tên hoạt động" },
                { key: "actionDescription", value: "Mô tả hoạt động" },
                { key: "mandatory", value: "Bắt buộc" },
                { key: "infomationName", value: "Tên thông tin" },
                { key: "infomationDescription", value: "Mô tả thông tin" },
                { key: "type", value: "Kiểu dữ liệu" },
                { key: "filledByAccountableEmployeesOnly", value: "Chỉ quản lý được điền" }
            ],
            // Do ở file export, dữ liệu được đọc theo dòng nên đối với dữ liệu mảng (taskAction, taskInfomation), mỗi phần tử của mảng là 1 dòng
            data: [
                {
                    name: "Triển khai sản phẩm mới",
                    description: "Triển khai sản phẩm mới",
                    organizationalUnit: "Phòng kinh doanh",
                    readByEmployees: ["Trưởng phòng kinh doanh", "Nhân viên phòng kinh doanh"],
                    priority: 1,
                    responsibleEmployees: ["pdp.vnist@gmail.com"],
                    accountableEmployees: ["nvd.vnist@gmail.com"],
                    consultedEmployees: ["nvd.vnist@gmail.com"],
                    informedEmployees: ["nvd.vnist@gmail.com"],
                    formula: 80,
                    taskActions: [
                        {
                            name: "Xây dựng định mức kỹ thuật",
                            description: "Phòng R&D xây dựng kế hoạch và thực hiện nghiên cứu sản phẩm, xây dựng Định mức kỹ thuật",
                            mandatory: "true",
                        }, {
                            name: "Khảo sát nguyên liệu",
                            description: "Phòng Kế hoạch kho GSP khảo sát nguyên liệu, tài liệu nguyên liệu (CA)",
                            mandatory: "true",
                        }, {
                            name: "Thiết kế Maquette",
                            description: "Phòng Marketing xây dựng kế hoạch và thực hiện thiết kế maquette",
                            mandatory: "true",
                        }, {
                            name: "Duyệt maquette",
                            description: "Phòng Kinh doanh duyệt thiết kế maquette ",
                            mandatory: "true",
                        }, {
                            name: "Kiểm soát nội dung maquette",
                            description: "Phòng Đảm bảo chất lượng kiểm soát nội dung trên maquette",
                            mandatory: "true",
                        }, {
                            name: "Chuyển TGĐ ký duyệt maquette",
                            description: "Phòng Marketing chuyển maquette đã được Phòng Đảm bảo chất lượng kiểm soát nội dung cho TGĐ phê duyệt",
                            mandatory: "true",
                        }, {
                            name: "Gửi phòng Kế hoạch và nhà in bản maquette đã được TGĐ ký duyệt",
                            description: "Phòng Marketing có trách nhiệm chuyển bản maquette đã được TGĐ ký duyệt cho nhà in và Phòng Kế hoạch",
                            mandatory: "true",
                        }
                    ],
                    taskInformations: [
                        {
                            name: "Số lượng nguyên liệu",
                            description: "Số lượng nguyên liệu dùng để khảo sát",
                            type: "Number",
                            filledByAccountableEmployeesOnly: "true",
                        },
                    ],

                },
            ]
        }]
    }]
}
