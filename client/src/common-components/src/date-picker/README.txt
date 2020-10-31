Component dùng để nhập dữ liệu Date
Để sử dụng Component này ta thực hiện các bước sau:
( Xem ví dụ minh hoạ trong Component SalaryEmpoyee.jsx trong modules/employees-manager/salary-employee/component)

BƯỚC 1: Import component
...
import { DatePicker } from '../../../../common-components';

BƯỚC 2: Khởi tạo state trong constructor và viết hàm xử lý khi giá trị DatePicker thay đổi
    ...
    // function khởi tạo state
    constructor(props) {
        super(props);
        this.state = {
            month: "",
        }
    }

    // function lưu giá trị datePicker vào state.month
    handleChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

BƯỚC 3: Sử dụng component, truyền vào các thuộc tính
    <DatePicker
        id="month"      
        dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
        value={}                            // giá trị mặc định cho datePicker    
        onChange={this.handleMonthChange}
        disabled={true}                     // sử dụng khi muốn disabled, mặc định là false
    />