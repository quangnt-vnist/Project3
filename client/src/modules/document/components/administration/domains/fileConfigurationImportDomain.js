export const configDomain = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    name: {
        columnName: "Tên danh mục",
        description: "Tên tiêu đề ứng với tên danh mục",
        value: "Tên danh mục"
    },
    description: {
        columnName: "Mô tả danh mục",
        description: "Tên tiêu đề ứng với mô tả danh mục",
        value: "Mô tả danh mục"
    },
    parent: {
        columnName: "Tên danh mục cha",
        description: "Tên tiêu đề ứng với tên danh mục cha",
        value: "Tên danh mục cha"
    },
}
export const exportDomain = {
    fileName: "Mẫu import danh mục",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: "Danh sách danh mục",
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "name", value: "Tên danh mục" },
                { key: "description", value: "Mô tả danh mục" },
                { key: "parent", value: "Tên danh mục cha" },
            ],
            data: [
                {
                    name: "Hello",
                    description: "xin chào",
                },
                {
                    name: "abc",
                    pathParent: "Hello",
                },

            ]
        }]

    }]
}