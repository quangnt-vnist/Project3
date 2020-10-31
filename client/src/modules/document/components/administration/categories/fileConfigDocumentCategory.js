export const configCategory = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    name: {
        columnName: "Tên loại tài liệu",
        description: "Tên tiêu đề ứng với tên loại tài liệu",
        value: "Tên loại tài liệu"
    },
    description: {
        columnName: "Mô tả loại tài liệu",
        description: "Tên tiêu đề ứng với mô tả loại tài liệu",
        value: "Mô tả loại tài liệu"
    },
}
export const exportCategory = {
    fileName: "Mẫu import loại tài liệu",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: "Danh sách loại tài liệu",
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "name", value: "Tên loại tài liệu" },
                { key: "description", value: "Mô tả loại tài liệu" },
            ],
            data: [
                {
                    name: "Bản kiểm điểm",
                    description: "Bản kiểm điểm",
                },
                {
                    name: "Đơn",
                    description: "Đơn dùng dể xin phép",
                },

            ]
        }]

    }]
}