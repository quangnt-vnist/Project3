// Config import thông tin chung
export const configurationGeneralInformationOfAsset = {
    sheets: {
        description: "Tên các sheet",
        value: ["Thông tin chung"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    code: {
        columnName: "Mã tài sản",
        description: "Tên tiêu đề ứng với mã tài sản",
        value: "Mã tài sản"
    },
    assetName: {
        columnName: "Tên tài sản",
        description: "Tên tiêu đề ứng với tên tài sản",
        value: "Tên tài sản"
    },
    description: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
    group: {
        columnName: "Nhóm tài sản",
        description: "Tên tiêu để ứng với nhóm tài sản",
        value: "Nhóm tài sản"
    },
    assetType: {
        columnName: "Loại tài sản",
        description: "Tên tiêu để ứng với loại tài sản",
        value: "Loại tài sản"
    },
    purchaseDate: {
        columnName: "Ngày nhập",
        description: "Tên tiêu để ứng với ngày nhập",
        value: "Ngày nhập"
    },
    warrantyExpirationDate: {
        columnName: "Ngày hết hạn bảo hành",
        description: "Tên tiêu để ứng với ngày hết hạn bảo hành",
        value: "Ngày hết hạn bảo hành"
    },
    managedBy: {
        columnName: "Người quản lý",
        description: "Tên tiêu để ứng với người quản lý",
        value: "Người quản lý"
    },
    readByRoles: {
        columnName: "Những role có quyền",
        description: "Tên tiêu để ứng với những role có quyền",
        value: "Những role có quyền"
    },
    location: {
        columnName: "Vị trí tài sản",
        description: "Tên tiêu để ứng với vị trí tài sản",
        value: "Vị trí tài sản"
    },
    status: {
        columnName: "Trạng thái",
        description: "Tên tiêu để ứng với trạng thái",
        value: "Trạng thái"
    },
    typeRegisterForUse: {
        columnName: "Quyền đăng ký sử dụng",
        description: "Tên tiêu để ứng với quyền đăng ký sử dụng",
        value: "Quyền đăng ký sử dụng"
    }
}

// Config import thông tin sử dụng
export const configurationUsageInformationOfAssetTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Thông tin sử dụng"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    usedByUser: {
        columnName: "Người sử dụng",
        description: "Tên tiêu đề ứng với người sử dụng",
        value: "Người sử dụng"
    },
    usedByOrganizationalUnit: {
        columnName: "Đơn vị sử dụng",
        description: "Tên tiêu đề ứng với đơn vị sử dụng",
        value: "Đơn vị sử dụng"
    },
    startDate: {
        columnName: "Ngày bắt đầu sử dụng",
        description: "Tên tiêu để ứng với ngày bắt đầu sử dụng",
        value: "Ngày bắt đầu sử dụng"
    },
    endDate: {
        columnName: "Ngày kết thúc sử dụng",
        description: "Tên tiêu để ứng với ngày kết thúc sử dụng",
        value: "Ngày kết thúc sử dụng"
    },
    description: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
}

// Config import thông tin sự cố
export const configurationIncidentInformationOfAssetTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Thông tin sự cố"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    incidentCode: {
        columnName: "Mã sự cố",
        description: "Tên tiêu đề ứng với mã sự cố",
        value: "Mã sự cố"
    },
    type: {
        columnName: "Loại sự cố",
        description: "Tên tiêu đề ứng với loại sự cố",
        value: "Loại sự cố"
    },
    reportedBy: {
        columnName: "Người báo cáo",
        description: "Tên tiêu để ứng với người báo cáo",
        value: "Người báo cáo"
    },
    dateOfIncident: {
        columnName: "Ngày phát hiện",
        description: "Tên tiêu để ứng với ngày phát hiện",
        value: "Ngày phát hiện"
    },
    description: {
        columnName: "Nội dung",
        description: "Tên tiêu đề ứng với nội dung",
        value: "Nội dung"
    },
    statusIncident: {
        columnName: "Trạng thái",
        description: "Tên tiêu để ứng với trạng thái",
        value: "Trạng thái"
    }
}

// Config import thông tin bảo trì
export const configurationMaintainanceInformationOfAssetTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Thông tin bảo trì"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    maintainanceCode: {
        columnName: "Mã phiếu",
        description: "Tên tiêu đề ứng với mã phiếu",
        value: "Mã phiếu"
    },
    createDate: {
        columnName: "Ngày lập",
        description: "Tên tiêu đề ứng với ngày lập",
        value: "Ngày lập"
    },
    type: {
        columnName: "Phân loại",
        description: "Tên tiêu để ứng với phân loại",
        value: "Phân loại"
    },
    description: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
    startDate: {
        columnName: "Ngày bắt đầu chỉnh sửa",
        description: "Tên tiêu đề ứng với ngày bắt đầu chỉnh sửa",
        value: "Ngày bắt đầu chỉnh sửa"
    },
    endDate: {
        columnName: "Ngày hoàn thành",
        description: "Tên tiêu đề ứng với ngày hoàn thành",
        value: "Ngày hoàn thành"
    },
    expense: {
        columnName: "Chi phí (VNĐ)",
        description: "Tên tiêu đề ứng với chi phí",
        value: "Chi phí (VNĐ)"
    },
    status: {
        columnName: "Trạng thái",
        description: "Tên tiêu để ứng với trạng thái",
        value: "Trạng thái"
    }
}

// Config import thông tin khấu hao
export const configurationDepreciationInformationOfAssetTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Thông tin khấu hao"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    cost: {
        columnName: "Nguyên giá (VNĐ)",
        description: "Tên tiêu đề ứng với nguyên giá",
        value: "Nguyên giá (VNĐ)"
    },
    residualValue: {
        columnName: "Giá trị thu hồi ước tính (VNĐ)",
        description: "Tên tiêu đề ứng với giá trị thu hồi ước tính",
        value: "Giá trị thu hồi ước tính (VNĐ)"
    },
    usefulLife: {
        columnName: "Thời gian sử dụng (Tháng)",
        description: "Tên tiêu để ứng với thời gian sử dụng",
        value: "Thời gian sử dụng (Tháng)"
    },
    startDepreciation: {
        columnName: "Thời gian bắt đầu trích khấu hao",
        description: "Tên tiêu đề ứng với thời gian bắt đầu trích khấu hao",
        value: "Thời gian bắt đầu trích khấu hao"
    },
    depreciationType: {
        columnName: "Phương pháp khấu hao",
        description: "Tên tiêu đề ứng với phương pháp khấu hao",
        value: "Phương pháp khấu hao"
    },
}

// Config import thông tin thanh lý
export const configurationDisposalInformationOfAssetTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Thông tin thanh lý"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    disposalDate: {
        columnName: "Thời gian thanh lý",
        description: "Tên tiêu đề ứng với thời gian thanh lý",
        value: "Thời gian thanh lý"
    },
    disposalType: {
        columnName: "Hình thức thanh lý",
        description: "Tên tiêu đề ứng với hình thức thanh lý",
        value: "Hình thức thanh lý"
    },
    disposalCost: {
        columnName: "Giá trị thanh lý (VNĐ)",
        description: "Tên tiêu để ứng với giá trị thanh lý",
        value: "Giá trị thanh lý (VNĐ)"
    },
    disposalDesc: {
        columnName: "Nội dung thanh lý",
        description: "Tên tiêu để ứng với nội dung thanh lý",
        value: "Nội dung thanh lý"
    }
} 



// Dữliệu file export mẫu thông tin chung
const importGeneralInformationOfAssetTemplate = {
    type: "General",
    sheetName: "Thông tin chung",
    sheetTitle: 'Danh sách tài sản',
    tables: [{
        rowHeader: 1,
        columns: [
            { key: "code", value: "Mã tài sản" },
            { key: "assetName", value: "Tên tài sản" },
            { key: "serial", value: "Số serial" },
            { key: "group", value: "Nhóm tài sản" },
            { key: "assetType", value: "Loại tài sản" },
            { key: "purchaseDate", value: "Ngày nhập" },
            { key: "warrantyExpirationDate", value: "Ngày hết hạn bảo hành" },
            { key: "managedBy", value: "Người quản lý" },
            { key: "readByRoles", value: "Những role có quyền" },
            { key: "location", value: "Vị trí tài sản" },
            { key: "status", value: "Trạng thái" },
            { key: "typeRegisterForUse", value: "Quyền đăng ký sử dụng" },
            { key: "description", value: "Mô tả" }
        ],
        data: [
            {
                code: "BG",
                assetName: "Bàn gỗ",
                serial: "BG1234",
                purchaseDate: "2020-09-01",
                warrantyExpirationDate: "2021-09-01",
                description: "Bàn gỗ xoan"
            }
        ]
    }]
}

// Dữliệu file export mẫu thông tin khấu hao
const importDepreciationInformationOfAssetTemplate = {
    type: "Depreciation",
    sheetName: "Thông tin khấu hao",
    sheetTitle: 'Thông tin khấu hao',
    tables: [{
        rowHeader: 1,
        columns: [
            { key: "cost", value: "Nguyên giá (VNĐ)" },
            { key: "residualValue", value: "Giá trị thu hồi ước tính (VNĐ)" },
            { key: "usefulLife", value: "Thời gian sử dụng (Tháng)" },
            { key: "startDepreciation", value: "Thời gian bắt đầu trích khấu hao" },
            { key: "depreciationType", value: "Phương pháp khấu hao" }
        ],
        data: [
            {
                cost: "2000000",
                residualValue: "1600000",
                usefulLife: "12",
                startDepreciation: "2020-03-20",
            }
        ]
    }]
}

// Dữliệu file export mẫu thông tin sử dụng
const importUsageInformationOfAssetTemplate = {
    type: "Usage",
    sheetName: "Thông tin sử dụng",
    sheetTitle: 'Thông tin sử dụng',
    tables: [{
        rowHeader: 1,
        columns: [
            { key: "usedByUser", value: "Người sử dụng" },
            { key: "usedByOrganizationalUnit", value: "Đơn vị sử dụng" },
            { key: "startDate", value: "Ngày bắt đầu sử dụng" },
            { key: "endDate", value: "Ngày kết thúc sử dụng" },
            { key: "description", value: "Mô tả" }
        ],
        data: [
            {
                startDate: "2020-03-20",
                endDate: "2020-09-20",
                description: "Cho phép sử dụng"
            },
            {
                startDate: "2020-03-20",
                endDate: "2020-09-20",
                description: "Cho phép sử dụng"
            }
        ]
    }]
}

// Dữliệu file export mẫu thông tin sự cố
const importIncidentInformationOfAssetTemplate = {
    type: "Incident",
    sheetName: "Thông tin sự cố",
    sheetTitle: 'Thông tin sự cố',
    tables: [{
        rowHeader: 1,
        columns: [
            { key: "incidentCode", value: "Mã sự cố" },
            { key: "type", value: "Loại sự cố" },
            { key: "reportedBy", value: "Người báo cáo" },
            { key: "dateOfIncident", value: "Ngày phát hiện" },
            { key: "description", value: "Nội dung" },
            { key: "statusIncident", value: "Trạng thái" }
        ],
        data: [
            {
                incidentCode: "IS_20",
                dateOfIncident: "2020-03-20",
                description: "Sự cố do ăn mòn"
            }
        ]
    }]
}

// Dữliệu file export mẫu thông tin bảo trì
const importMaintainanceInformationOfAssetTemplate = {
    type: "Maintainance",
    sheetName: "Thông tin bảo trì",
    sheetTitle: 'Thông tin bảo trì',
    tables: [{
        rowHeader: 1,
        columns: [
            { key: "maintainanceCode", value: "Mã phiếu" },
            { key: "createDate", value: "Ngày lập" },
            { key: "type", value: "Phân loại" },
            { key: "description", value: "Mô tả" },
            { key: "startDate", value: "Ngày bắt đầu chỉnh sửa" },
            { key: "endDate", value: "Ngày hoàn thành"},
            { key: "expense", value: "Chi phí (VNĐ)" },
            { key: "status", value: "Trạng thái" }
        ],
        data: [
            {
                maintainanceCode: "IS_20",
                createDate: "2020-03-20",
                description: "Bảo trì do ăn mòn",
                startDate: "2020-04-20",
                endDate: "2020-05-20",
                expense: "2000000"
            }
        ]
    }]
}

// Dữliệu file export mẫu thông tin thanh lý
const importDisposalInformationOfAssetTemplate = {
    type: "Disposal",
    sheetName: "Thông tin thanh lý",
    sheetTitle: 'Thông tin thanh lý',
    tables: [{
        rowHeader: 1,
        columns: [
            { key: "disposalDate", value: "Thời gian thanh lý" },
            { key: "disposalType", value: "Hình thức thanh lý" },
            { key: "disposalCost", value: "Giá trị thanh lý (VNĐ)" },
            { key: "disposalDesc", value: "Nội dung thanh lý" }
        ],
        data: [
            {
                disposalDate: "2020-05-20",
                disposalCost: "2000000",
                disposalDesc: "Thanh lý do ăn mòn"
            }
        ]
    }]
}


export const importAssetTemplate = {
    fileName: "Mẫu import tài sản",
    dataSheets: [
        importGeneralInformationOfAssetTemplate,
        importDepreciationInformationOfAssetTemplate,
        importUsageInformationOfAssetTemplate,
        importIncidentInformationOfAssetTemplate,
        importMaintainanceInformationOfAssetTemplate,
        importDisposalInformationOfAssetTemplate
    ]
}