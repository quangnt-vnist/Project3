export const configProcessTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 3,
    },
    processName: {
        columnName: "Tên mẫu quy trình",
        description: "Tên tiêu đề ứng với tên mẫu quy trình",
        value: "Tên mẫu quy trình"
    },
    processDescription: {
        columnName: "Mô tả mẫu quy trình",
        description: "Tên tiêu đề ứng với mô tả mẫu quy trình",
        value: "Mô tả mẫu quy trình"
    },
    manager: {
        columnName: "Người quản lý quy trình",
        description: "Tên tiêu đề ứng với người quản lý",
        value: "Người quản lý quy trình"
    },
    viewer: {
        columnName: "Người được xem quy trình",
        description: "Tên tiêu đề ứng với người được xem",
        value: "Người được xem quy trình"
    },
    xmlDiagram: {
        columnName: "Biểu đồ quy trình",
        description: "Tên tiêu đề ứng với biểu đồ quy trình dạng xml",
        value: "Biểu đồ quy trình"
    },
    taskName: {
        columnName: "Tên công việc",
        description: "Tên tiêu đề ứng với tên mẫu",
        value: "Tên công việc"
    },
    code: {
        columnName: "Mã công việc trong quy trình",
        description: "Tên tiêu đề ứng với mã công việc trong quy trình",
        value: "Mã công việc trong quy trình"
    },
    taskDescription: {
        columnName: "Mô tả công việc",
        description: "Tên tiêu đề ứng với mô tả công việc",
        value: "Mô tả công việc"
    },
    organizationalUnit: {
        columnName: "Đơn vị",
        description: "Tên tiêu đề ứng với đơn vị",
        value: "Đơn vị"
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
    // tasks: {
    //     columnName: "Danh sách công việc trong quy trình",
    //     description: "Tên tiêu đề ứng với danh sách công việc trong quy trình",
    //     value: [
    //         "Mã công việc trong quy trình", "Tên mẫu", "Mô tả", "Đơn vị", "Độ ưu tiên",
    //         "Người thực hiện", "Người phê duyệt", "Người tư vấn", "Người quan sát",
    //         "Công thức tính điểm", "Danh sách hoạt động", "Danh sách thông tin"
    //     ]
    // }
}

export const templateImportProcessTemplate = {
    fileName: "Mẫu import quy trình",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách mẫu quy trình',
        tables: [{
            rowHeader: 3,
            merges: [{
                key: "generalInfoTask",
                columnName: "Thông tin chung",
                keyMerge: 'taskName',
                colspan: 10,
            }, {
                key: "taskActions",
                columnName: "Danh sách hoạt động",
                keyMerge: 'actionName',
                colspan: 3,
            }, {
                key: "taskInfomations",
                columnName: "Danh sách thông tin",
                keyMerge: 'infomationName',
                colspan: 4,
            }, {
                key: "tasks",
                columnName: "Danh sách công việc",
                keyMerge: 'generalInfoTask',
                colspan: 17,
            }],
            columns: [
                { key: "STT", value: "STT" },
                { key: "processName", value: "Tên mẫu quy trình" },
                { key: "processDescription", value: "Mô tả mẫu quy trình" },
                { key: "manager", value: "Người quản lý quy trình" },
                { key: "viewer", value: "Người được xem quy trình" },
                { key: "xmlDiagram", value: "Biểu đồ quy trình" },

                { key: "taskName", value: "Tên công việc" },
                { key: "code", value: "Mã công việc trong quy trình" },
                { key: "taskDescription", value: "Mô tả công việc" },
                { key: "organizationalUnits", value: "Đơn vị" },
                { key: "priority", value: "Độ ưu tiên" },
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
                    processName: "Triển khai sản phẩm mới qquy trình",
                    processDescription: "Triển khai sản phẩm mới",
                    manager: "Giám đốc",
                    viewer: "Thành viên ban giám đốc",
                    xmlDiagram: "abc xyz",

                    tasks: [
                        {
                            taskName: "cv1",
                            taskDescription: "moota cv1",
                            code: "activity-1",
                            organizationalUnit: "Phòng kinh doanh",
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
                        {
                            taskName: "cv2",
                            taskDescription: "mta cv2",
                            code: "activity-0",
                            organizationalUnit: "Phòng kinh doanh",
                            priority: 1,
                            responsibleEmployees: ["pdp.vnist@gmail.com"],
                            accountableEmployees: ["nvd.vnist@gmail.com"],
                            consultedEmployees: ["nvd.vnist@gmail.com"],
                            informedEmployees: ["nvd.vnist@gmail.com"],
                            formula: 90,
                            taskActions: [
                                {
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
                                }
                            ],
                            taskInformations: [
                                {
                                    name: "Số nợ cần thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                                {
                                    name: "Số nợ đã thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                            ],
                        }
                    ]
                },
                {
                    processName: "QT2",
                    processDescription: "Triển khai sản phẩm mới",
                    manager: "Giám đốc",
                    viewer: "Thành viên ban giám đốc",
                    xmlDiagram: "abc xyz",

                    tasks: [
                        {
                            taskName: "cv1",
                            taskDescription: "moota cv1",
                            code: "activity-1",
                            organizationalUnit: "Phòng kinh doanh",
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
                                },
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
                        {
                            taskName: "cv2",
                            taskDescription: "mta cv2",
                            code: "activity-0",
                            organizationalUnit: "Phòng kinh doanh",
                            priority: 1,
                            responsibleEmployees: ["pdp.vnist@gmail.com"],
                            accountableEmployees: ["nvd.vnist@gmail.com"],
                            consultedEmployees: ["nvd.vnist@gmail.com"],
                            informedEmployees: ["nvd.vnist@gmail.com"],
                            formula: 90,
                            taskActions: [
                                {
                                    name: "Duyệt maquette",
                                    description: "Phòng Kinh doanh duyệt thiết kế maquette ",
                                    mandatory: "true",
                                },
                            ],
                            taskInformations: [
                                {
                                    name: "Số nợ cần thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                                {
                                    name: "Số nợ đã thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                            ],
                        }
                    ]
                },
            ]
        }]
    }]
}