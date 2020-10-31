Component tạo giao diện thiết lập cài đặt cho table 
Để sử dụng Componett này ta thực hiện các bước sau:
(Xem ví dụ minh hoạ trong Componett SalaryEmpoyee.jsx trong modules/employees-manager/salary-employee/component)

BƯỚC 1: import component
...
import { ActionColumn } from '../../../../common-components';


BƯỚC 2: cài đặt hàm setLimit, truyền vào làm thuộc tính callback cho component    
    ...
    /* function setting table 
     * number là số dòng hiện thị trong một trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number)
        });
        this.props.getListSalary(this.state.paginateData); // function lấy dữ liệu 
    }

BƯỚC 3: sử dụng component
...
<div id="scroll-table">     // thêm vào khi muốn Scroll table
    <table id="salary-table">
        <thead>
            <tr>
            ...
                <th>
                <ActionColumn
                    tableId="salary-table"              // id của table
                    tableContainerId = "scroll-table"   // id của thể <div> (vùng chứa table)
                                                        // thêm vào khi muốn Scroll table 
                    tableWidth = "1300px"               // Độ rộng của bảng - dùng khi muốn Scroll table
                    columnArr={[                        // tên các cột của table
                        tên nhân viên,
                        mã nhân viên,
                    ]}
                    limit={this.state.limit}           // số dòng hiện thị trên 1 trang
                    setLimit={this.setLimit}           // function setting table 
                    hideColumnOption={true}             
                />
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                /* nội dung của bảng 
            </tr>
        </tbody>
    </table>
    {salary.isLoading?
        <div className="table-info-panel">{translate('confirm.loading')}</div>:
        (typeof listSalary === 'undefined' || listSalary.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
    }
</div>