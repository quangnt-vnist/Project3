Component dùng để upload file
Để sử dụng Component này ta thực hiện các bước sau:

BƯỚC 1: Import component
...
import { UploadFile } from '../../../../common-components';

BƯỚC 2: Viết hàm xử lý khi giá trị file upload thay đổi
    ...
    // function lưu giá trị datePicker vào state.month
    /**
     * Function bắt sự kiện thay đổi giá trị file upload
     * @value : array chứ giá trị file upload
     */
    handleFileChange = (value) => {
        console.log(value);                 // Giá trị trả ra có dạng :
                                            // [{
                                            //      fileName: 'Tên file upload',
                                            //      urlFile: 'Đường đẫn file (path)',
                                            //      fileUpload: 'file dạng blob'
                                            // }]
    }

BƯỚC 3: Sử dụng component, truyền vào các thuộc tính
    <UploadFile
        files ={files}                      // Giá trị mặc định (sử dụng trong form edit), định dạnh dữ liệu mô tả trong LƯU Ý 1     
        multiple={true}                     // true chế độ chọn nhiều file, false chế độ chọn 1 file (mặc định chọn 1 file)
        onChange={this.handleFileChange}    
    />




LƯU Ý 1: Giá trị mặc định là một mảng các đối tượng, mỗi đối tượng ứng với 1 file
    files = [{
        fileName: " Tên file",
        urlFile: 'Đường đẫn file (path)'
    }]