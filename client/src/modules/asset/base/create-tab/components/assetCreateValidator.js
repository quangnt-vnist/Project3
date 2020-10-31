import {
    VALIDATOR
} from '../../../../../helpers/validator';
export const AssetCreateValidator = {

    /** 
     * Thông tin chung
     */
    validateCode, //mã tài sản
    validateAssetName, //tên tài sản
    validateSerial, //Số serial
    validateAssetType, //loại tài sản
    validatePurchaseDate, //ngày nhập
    validateWarrantyExpirationDate, //ngày bảo hành
    validateManagedBy, //người quản lý
    validateAssignedToUser, //người sử dụng
    validateAssignedToOrganizationalUnit,

    validateLocation, //vị trí tài sản
    validateNameField, //tên trường dữ liệu
    validateValue, //giá trị

    /**
     * Sửa chữa - thay thế - nâng cấp
     */
    validateMaintainanceCode, //mã phiếu
    validateCreateDate, // ngày lập
    validateDescription, // nội dung bảo trì
    validateExpense,


    /**
     * Cấp phát - điều chuyển - thu hồi - lịch sử sử dụng
     */
    validateStartDate, // ngày bắt đầu sử dụng
    validateEndDate, // ngày kết thúc sử dụng
    validateUsedByUser, // người sử dụng
    validateUsedByOrganiztionalUnit, // đơn vị sử dụng

    /** 
     * Thông tin khấu hao
     */
    validateCost, //Nguyên giá
    validateResidualValue, //Giá trị thu hồi dự tính
    validateUsefulLife, // Thời gian trích khấu hao
    validateStartDepreciation, // Thời gian bắt đầu trích khấu hao
    validateDepreciationType, // Thời gian bắt đầu trích khấu hao
    validateUnitsProducedDuringTheYear,
    validateEstimatedTotalProduction,

    /**
     * Thông tin sự cố
     */
    validateIncidentCode,
    validateDateOfIncident,
    validateIncidentDescription,

    /** 
     * Tài liệu đính kèm 
     */
    validateNameFile,
    validateDiscFile,
    validateNumberFile,

    /**
     * Thông tin thanh lý
     */
    validateDisposalDate,
    validateDisposalType,
    validateDisposalCost,
    validateDisposalDescription,

}

/**
 * Validate TabGeneralContent (Thông tin chung)
 */
/**
 * Kiểm tra mã tài sản nhập vào
 */
function validateCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã tài sản không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã tài sản không được chứa kí tự đặc biệt";
    }
    return msg;
}

//kiểm tra tên tài sản
function validateAssetName(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên tài sản không được để trống";
    }
    return msg;
}

/**
 * kiểm tra số serial
 */
function validateSerial(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số serial không được để trống";
    }
    return msg;
}

/**
 * kiểm tra loại tài sản
 */
function validateAssetType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Loại tài sản không được để trống";
    }
    return msg;
}

/**
 * kiểm tra ngày nhập
 */
function validatePurchaseDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày nhập không được để trống";
    }
    return msg;
}

/**
 * kiểm tra ngày bảo hành
 */
function validateWarrantyExpirationDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày bảo hành không được để trống";
    }
    return msg;
}

//kiểm tra người quản lý
function validateManagedBy(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người quản lý không được để trống";
    }
    return msg;
}

//kiểm tra người sử dụng
function validateAssignedToUser(value, translate) {
    return undefined;
}

function validateAssignedToOrganizationalUnit(value, translate) {
    return undefined;
}
//kiểm tra vị trí tài sản
function validateLocation(value, translate) {
    let msg = undefined;
    // if (value.trim() === "") {
    //     msg = "Vị trí tài sản không được để trống";
    // }
    return msg;
}

//kiểm tra giá trị ban đầu của tài sản
function validateInitialPrice(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị ban đầu không được để trống";
    }
    return msg;
}

// Function kiểm tra tên trường dữ liệu
function validateNameField(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên trường dữ liệu không được để trống";
    }
    return msg;
}
// Function kiểm tra giá trị trường dữ liệu
function validateValue(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị không được để trống";
    }
    return msg;
}

/**
 * Validate TabMaintainance (Thông tin bảo trì)
 */
/**
 * Kiểm tra số phiếu nhập vào
 */
function validateMaintainanceCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã phiếu không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã phiếu không được chứa kí tự đặc biệt";
    }
    return msg;
}

// Function kiểm tra ngày lập
function validateCreateDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày lập không được để trống";
    }
    return msg;
}

// Function kiểm tra nội dung bảo trì
function validateDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung không được để trống";
    }
    return msg;
}

function validateExpense(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Chi phí không được để trống";
    }
    return msg;
}

/**
 * Validate TabMaintainance (Lịch sử sử dụng)
 */
//

function validateUsedByUser(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Người sử dụng không được để trống";
    }
    return msg;
}

function validateUsedByOrganiztionalUnit(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Đơn vị sử dụng không được để trống";
    }
    return msg;
}

function validateStartDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày bắt đầu sử dụng không được để trống";
    }
    return msg;
}

function validateEndDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày kết thúc sử dụng không được để trống";
    }
    return msg;
}

/**
 * Validate TabDepreciation (Thông tin khấu hao)
 */

//kiểm tra Nguyên giá
function validateCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nguyên giá không được để trống";
    }
    return msg;
}

//kiểm tra Giá trị thu hồi dự tính
function validateResidualValue(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị thu hồi dự tính không được để trống";
    }
    return msg;
}

//kiểm tra thời  gian bắt đầu trích khấu hao
function validateStartDepreciation(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thời gian bắt đầu trích khấu hao không được để trống";
    }
    return msg;
}

//kiểm tra phương pháp trích trích khấu hao
function validateDepreciationType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Phương pháp trích khấu hao không được để trống";
    }
    return msg;
}

//kiểm tra thời gian trích khấu hao
function validateUsefulLife(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Thời gian sử dụng không được để trống";
    }
    return msg;
}

/**
 * Validate Tab IncidentLog (Thông tin sự cố)
 */
function validateIncidentCode(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mã sự cố không được để trống";
    } else if (!VALIDATOR.isValidEmployeeNumber(value)) {
        msg = "Mã sự cố không được chứa kí tự đặc biệt";
    }
    return msg;
}

// Function kiểm tra ngày phát hiện sự cố
function validateDateOfIncident(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày phát hiện không được để trống";
    }
    return msg;
}

// Function kiểm tra nội dung sự cố
function validateIncidentDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Nội dung sự cố không được để trống";
    }
    return msg;
}
/**
 * Validate TabAttachmentsContent (Tài liệu đính kèm)
 */

// kiểm tra tên file
function validateNameFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên tài liệu đính kèm không được để trống";
    }
    return msg;
}

// kiểm tra mô tả file
function validateDiscFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả không được để trống";
    }
    return msg;
}

// kiểm tra số lượng file
function validateNumberFile(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Số lượng không được để trống";
    }
    return msg;
}

/**
 * Validate TabDisposal (Thông tin thanh lý)
 */

// kiểm tra ngày thanh lý
function validateDisposalDate(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Ngày thanh lý không được để trống";
    }
    return msg;
}

// kiểm tra hình thức thanh lý
function validateDisposalType(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Hình thức thanh lý không được để trống";
    }
    return msg;
}

// kiểm tra giá trị thanh lý
function validateDisposalCost(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Giá trị thanh lý không được để trống";
    }
    return msg;
}

// kiểm tra mô tả thanh lý
function validateDisposalDescription(value, translate) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả thanh lý không được để trống";
    }
    return msg;
}

// Kiểm tra sản lượng sản phẩm trong 1 năm
function validateUnitsProducedDuringTheYear(value, translate) {
    let msg = undefined;
    if (!value) {
        msg = "Sản lượng sản phẩm không được để trống";
    } else if (value < 0) {
        msg = "Sản lượng sản phẩm không được nhỏ hơn 0";
    }

    return msg;
}

// Kiểm tra sản lượng ước tính sản phẩm trong 1 năm
function validateEstimatedTotalProduction(value, translate) {
    let msg = undefined;
    if (!value) {
        msg = "Sản lượng ước tính sản phẩm không được để trống";
    } else if (value < 0) {
        msg = "Sản lượng ước tính sản phẩm không được nhỏ hơn 0";
    }

    return msg;
}