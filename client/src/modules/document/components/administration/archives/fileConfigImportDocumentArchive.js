export const configArchive = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    name: {
        columnName: "Tên vị trí lưu trữ",
        description: "Tên tiêu đề ứng với tên vị trí lưu trữ",
        value: "Tên vị trí lưu trữ"
    },
    description: {
        columnName: "Mô tả vị trí lưu trữ",
        description: "Tên tiêu đề ứng với mô tả vị trí lưu trữ",
        value: "Mô tả vị trí lưu trữ"
    },
    pathParent: {
        columnName: "Đường dẫn vị trí lưu trữ cha",
        description: "Đường dẫn tiêu đề ứng với tên vị trí lưu trữ cha",
        value: "Đường dẫn vị trí lưu trữ cha"
    },
}

export const exportArchive = {
    fileName: "Mẫu import vị trí lưu trữ",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: "Danh sách vị trí lưu trữ",
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "name", value: "Tên vị trí lưu trữ" },
                { key: "description", value: "Mô tả vị trí lưu trữ" },
                { key: "pathParent", value: "Đường dẫn vị trí lưu trữ cha" },
            ],
            data: [
                {
                    name: "B4",
                    description: "B4",
                },
                {
                    name: "Phòng 201",
                    pathParent: "B4",
                },
                {
                    name: "Ngăn 1",
                    pathParent: "B4 - Phòng 201",
                },
            ]
        }]

    }]
}




