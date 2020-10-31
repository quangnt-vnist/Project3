export const configDocument = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    name: {
        columnName: "Tên tài liệu",
        description: "Tên tiêu đề ứng với tên tài liệu",
        value: "Tên tài liệu"
    },
    description: {
        columnName: "Mô tả tài liệu",
        description: "Tên tiêu đề ứng với mô tả tài liệu",
        value: "Mô tả tài liệu"
    },
    archives: {
        columnName: "Tên đường dẫn vị trí lưu",
        description: "Tên tiêu đề ứng với Tên đường dẫn vị trí lưu",
        value: "Tên đường dẫn vị trí lưu",
    },
    domains: {
        columnName: "Tên danh mục",
        description: "Tên tiêu đề ứng với tên tài liệu",
        value: "Tên danh mục",
    },
    issuingBody: {
        columnName: "Cơ quan ban hành",
        description: "Tên tiêu đề ứng với cơ quan ban hành",
        value: "Cơ quan ban hành",
    },
    signer: {
        columnName: "Người kí",
        description: "Tên tiêu đề ứng với người kí",
        value: "Người kí",
    },
    officialNumber: {
        columnName: "Số hiệu",
        description: "Tên tiêu đề ứng với số hiệu",
        value: "Số hiệu",
    },
    versionName: {
        columnName: "Tên phiên bản",
        description: "Tên tiêu đề ứng với tên phiên bản",
        value: "Tên phiên bản",
    },
    issuingDate: {
        columnName: "Ngày ban hành",
        description: "Tên tiêu đề ứng với ngày ban hành",
        value: "Ngày ban hành",
    },
    effectiveDate: {
        columnName: "Ngày hiệu lực",
        description: "Tên tiêu đề ứng với ngày hiệu lực",
        value: "Ngày hiệu lực",
    },
    expiredDate: {
        columnName: "Ngày hết hạn",
        description: "Tên tiêu đề ứng với ngày hết hạn",
        value: "Ngày hết hạn",
    },
    category: {
        columnName: "Loại tài liệu",
        description: "Tên tiêu đề ứng với loại tài liệu",
        value: "Loại tài liệu",
    },
    relationshipDescription: {
        columnName: "Mô tả quan hệ liên kết",
        description: "Tên tiêu đề ứng với mô tả quan hệ liên kết",
        value: "Mô tả quan hệ liên kết",
    },
    documentRelationshipList: {
        columnName: "Các tài liệu liên kết",
        description: "Tên tiêu đề ứng với các tài liệu liên kết",
        value: "Các tài liệu liên kết",
    },
    roles: {
        columnName: "Các chức vụ có quyền xem",
        description: "Tên tiêu đề ứng với các chức vụ có quyền xem",
        value: "Các chức vụ có quyền xem",
    },
    organizationUnitManagement: {
        columnName: "Đơn vị quản lí",
        description: "Tên tiêu đề ứng với đơn vị quản lí",
        value: "Đơn vị quản lí",
    },
}

export const exportDocument = {
    fileName: "Mẫu import tài liệu",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: "Danh sách tài liệu",
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "name", value: "Tên tài liệu" },
                { key: "description", value: "Mô tả tài liệu" },
                { key: "archives", value: "Tên đường dẫn vị trí lưu" },
                { key: "domains", value: "Tên danh mục" },
                { key: "issuingBody", value: "Cơ quan ban hành" },
                { key: "signer", value: "Người kí" },
                { key: "versionName", value: "Tên phiên bản" },
                { key: "officialNumber", value: "Số hiệu" },
                { key: "issuingDate", value: "Ngày ban hành" },
                { key: "effectiveDate", value: "Ngày hiệu lực" },
                { key: "expiredDate", value: "Ngày hết hạn" },
                { key: "category", value: "Loại tài liệu" },
                { key: "relationshipDescription", value: "Mô tả quan hệ liên kết" },
                { key: "documentRelationshipList", value: "Các tài liệu liên kết" },
                { key: "roles", value: "Các chức vụ có quyền xem" },
                { key: "organizationUnitManagement", value: "Đơn vị quản lí" },


            ],
            data: [
                {
                    name: "Hello",
                    description: "xin chào",
                    archives: ["Văn phòng B2 - Phòng 301 - Tủ A"],
                    domains: ["Quy chế quản lý nội bộ công ty"],
                    issuingBody: "Bam giám đốc",
                    signer: "Mr.Happy",
                    versionName: "vs 2",
                    officialNumber: "OI4",
                    issuingDate: "3/4/2020",
                    effectiveDate: "5/4/2020",
                    expiredDate: "4/5/2020",
                    category: "Văn bản",
                    relationshipDescription: "",
                    documentRelationshipList: ["Đi chơi"],
                    roles: ["Admin", "Dean"],
                    organizationUnitManagement: "Ban giám đốc",

                },
            ]
        }]

    }]
}