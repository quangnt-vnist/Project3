export const configDepartment = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 2
    },
    name: {
        columnName: "Tên đơn vị",
        description: "Tên tiêu đề ứng với tên đơn vị",
        value: "Tên đơn vị"
    },
    description: {
        columnName: "Mô tả đơn vị",
        description: "Tên tiêu đề ứng với mô tả đơn vị",
        value: "Mô tả đơn vị"
    },
    parent: {
        columnName: "Đơn vị cha",
        description: "Tên tiêu đề ứng với đơn vị cha",
        value: "Đơn vị cha"
    },
    deans: {
        columnName: "Tên các chức danh trưởng đơn vị",
        description: "Tên tiêu đề ứng với tên các chức danh trưởng đơn vị",
        value: "Tên các chức danh trưởng đơn vị"
    },
    viceDeans: {
        columnName: "Tên các chức danh phó đơn vị",
        description: "Tên tiêu đề ứng với tên các chức danh phó đơn vị",
        value: "Tên các chức danh phó đơn vị"
    },
    employees: {
        columnName: "Tên các chức danh nhân viên đơn vị",
        description: "Tên tiêu đề ứng với tên các chức danh nhân viên đơn vị",
        value: "Tên các chức danh nhân viên đơn vị"
    }
}

export const templateImportDepartment = {
    fileName: "Mẫu import cơ cấu tổ chức",
    dataSheets: [{
        sheetName: "sheet1",
        sheetTitle: 'Danh sách cơ cấu tổ chức',
        tables: [{
            rowHeader: 2,
            columns: [
                { key: "name", value: "Tên đơn vị" },
                { key: "description", value: "Mô tả đơn vị" },
                { key: "parent", value: "Đơn vị cha"},
                { key: "deans", value: "Tên các chức danh trưởng đơn vị" },
                { key: "viceDeans", value: "Tên các chức danh phó đơn vị"},
                { key: "employees", value: "Tên các chức danh nhân viên đơn vị"}
            ],
            data: [
                {
                    name: "Phòng nhân sự",
                    description: "Phòng nhân sự Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
                    parent: "Ban giám đốc",
                    deans: ["Trưởng phòng nhân sự"],
                    viceDeans: ["Phó phòng nhân sự", "Quản lý nhân viên"],
                    employees: ["Nhân viên phòng nhân sự"],
                }, {
                    name: "Ban tuyển dụng",
                    description: "Ban tuyển dụng Phòng nhân sự Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
                    parent: "Phòng nhân sự",
                    deans: ["Trưởng ban tuyển dụng"],
                    viceDeans: ["Phó ban tuyển dụng"],
                    employees: ["Thành viên ban tuyển dụng"],
                }
            ]
        }]
        }
    ]
}