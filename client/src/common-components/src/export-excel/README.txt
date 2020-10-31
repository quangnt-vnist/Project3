Component dùng để xuất báo cáo
Để sử dụng Component này ta thực hiện các bước sau:
( Xem ví dụ minh hoạ trong Component SalaryEmpoyee.jsx trong modules/employees-manager/salary-employee/component)

BƯỚC 1: Import component
...
import { ExportExcel } from '../../../../common-components';

BƯỚC 2: Sử dụng component, truyền vào các thuộc tính
    - Có 2 cách để sử dụng component:
        + Cách 1: Sử dụng trong trường hợp tự tạo nút button export (trong trường hợp phải gọi server lấy dữ liệu trước khi ấn export);
            /* 
            * Tạo 1 button tuỳ chỉnh ví dụ như sau:
            */
            <a type="button" onClick = {this.ExportExcel}>Xuất báo cáo</a>              // (1)

            /*
            * Gọi hàm ExportExcel.export(exportData) để thực hiện việc export trong function ExportExcel() ở (1)
            * Ví dụ như sau:
            */
            ExportExcel = ()=>{
                ExportExcel.export(exportData)      // exportData dữ liệu export có định dạng như LƯU Ý 1
            }

        + Cách 1: Sử dụng nút button export có sẵn của component và khi dữ liệu export có sẵn (không phải gọi server để lấy dữ liệu)
            <ExportExcel
                id="export-salary"
                type='button'                               // Có 2 giá trị là 'button' và 'link'; 'button': Hiện thị 1 button, 'link': Hiện thị 1 link (thẻ <a>)             
                buttonName='Xuất báo cáo'                   // Tên của button hoặc link
                exportData={exportData}                     // Khai báo dữ liệu để export, định dạng dữ liệu mô tả trong LƯU Ý 1
                style={{ marginRight: 15}}                  // Thêm CSS cho button (có thể khai báo hoặc không)
                className={{btn btn-primary pull-right}}    // Thêm thuộc tính class cho button (có thể khai báo hoặc không)
            />


LƯU Ý 1: Kiểu dữ liệu truyền vào component để export

    /*
    * fileName: Tên của file export
    * dataSheets : Dữ liệu của từng sheet (có thể có nhiều sheet) 
    * sheetName: Tên của sheet để chứa nội dung export
    * sheetTitle : Tiêu đề của sheet (có thể có hoặc không)
    * tables: Dữ liệu từng bảng (có thể có nhiều bảng trong 1 sheet)
    */
    exportData = {
        fileName: 'Tên của file export',
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: 'Báo cáo thống kê lương thưởnng',
                    sheetTitleWidth: 12,                                // Số cột merge cho ô tiêu đề         
                    tables: [
                        {
                            note: `Chú ý:`                              // Thêm "chú ý" cho bảng (có thể có hoặc không)
                            noteHeight: 42,                             // Chiều cao của dòng "chú ý" (có thể có hoặc không)
                            tableName: "Bảng lương 1",                  // Tên của bảng (có thể có hoặc không)
                            merges: merges;                             // Cấu hình merges các tiêu đề của bảng (merges theo cột), định dạng dữ liệu mô tả trong LƯU Ý 2 
                            styleColumn : styleColumn                   // Thêm style tuỳ chỉnh cho các cột dữ liệu (các cột của bảng không bao gồm tiều đề bảng),định dạng dữ liệu mô tả trong LƯU Ý 3
                            rowHeader: 2,                               // Khai báo số dòng ứng với tiêu đề của bảng

                            moreInform: [{                              // Khai báo thông tin thêm của bảng dữ liệu (có thể có hoặc không)
                                title: 'Tiêu đề thông tin thêm',        // Tiêu đề của thông tin thêm (có thể có hoặc không)
                                value: ["dòng1", "dòng2"]               // dữ liệu các dòng của thông tin thêm
                            }],


                            /*
                            * Thêm style tuỳ chỉnh cho các cột dữ liệu (các cột của bảng không bao gồm tiều đề bảng)
                            *
                            * vertical: Căn chỉnh theo chiều dọc của cột dữ liệu (có thể có hoặc không),
                            * vertical nhận các giá trị: 'top', 'middle', 'bottom',
                            *
                            * horizontal : Căn chỉnh theo chiều ngang của cột dữ liệu (có thể có hoặc không)
                            * horizontal nhận các giá trị: 'left', 'center', 'right',
                            */
                            styleColumn: {                                  
                                STT: {                                  // Khoá tương ứng của tiêu đề bảng (key)
                                    vertical: 'middle',
                                    horizontal: 'center'   
                                }
                            },


                            /*
                            * Khai báo tiêu đề của bảng
                            * key: Là khoá tương ứng của từng cột tiêu đề
                            * value: Là tên của từng cột tiêu đề
                            *
                            * width: Độ rộng của cột
                            * vertical: Căn chỉnh theo chiều dọc của ô têu đề (có thể có hoặc không)
                            * vertical nhận các giá trị: 'top', 'middle', 'bottom',
                            *
                            * horizontal : Căn chỉnh theo chiều ngang của ô têu đề (có thể có hoặc không)
                            * horizontal nhận các giá trị: 'left', 'center', 'right',
                            */ 
                            columns: [
                                { key: "STT", value: 'STT', width: 7, vertical:'middle' ,horizontal:'center },
                                { key: "employeeNumber", value: 'Mã số nhân viên' },
                                { key: "fullName", value: 'Họ và tên', width: 20 },

                                { key: "salary1", value: 'Lương thưởng tháng 1',},
                                { key: "salary2", value: 'Lương thưởng tháng 2',},

                                { key: "other1", value: 'Thưởng doanh số',},
                                { key: "other2", value: 'Thưởng danh thu',},
                            ],

                            /*
                            * Khai báo dữ liệu của bảng
                            * data: là mảng cái đối tượng, mỗi đối tượng ứng với 1 dòng dữ liệu
                            */
                            data: [
                                {
                                    merges: {                           // Khai báo dữ liệu merges các ô dữ liệu (merges theo dòng)
                                        STT: 2,                         // Gộp 2 dòng dữ liệu của cột tiêu đề có key = STT thành 1 dòng 
                                        employeeNumber: 2,              // ...
                                        fullName: 2                     // ...
                                    },

                                    STT: 1,                             // Dữ liệu ứng với cột tiêu đề có key = 'STT'
                                    employeeNumber: 'MS2015123,         // Dữ liệu ứng với cột tiêu đề có keu = 'fullName' 
                                    fullName: 'Nguyễn Văn An',
                                    salar1: '1000000',
                                    salary2: '1200000',
                                    other1: '1200000',
                                    other2: '2000000',
                                }
                            ]
                        },
                    ]
                },
            ]
        }
    }


LƯU Ý 2: Kiểu dữ liệu merges có dạng mảng, mỗi đồi tượng ứng với một thao tác merges tiêu đề của mảng
    merges: [
        {
            key: "other",                           // Khai báo khoá mới cho tiêu đề cột
            columnName: "Lương thưởng 123",         // Tên tiêu đề mới 
            keyMerge: 'gender',                     // Khai báo key của cột (tiêu đề) muốn merges
            colspan: 2                              // Số cột đứng sau cột 'keyMerge' muốn merges với cột 'keyMerge' (Số cột đơn muốn merges)
        },
    ]

    /*
    * Có thể thực hiện merges lồng nhau
    * Như ví dụ sau:
    */
    merges: [
        {
            key: "salaryMonth",                                     // Gộp cột 'lương thưởng 1' vs cột 'lương thưởng 2' thành 'Lương thưởng theo tháng'
            columnName: "Lương thưởng theo tháng",
            keyMerge: 'salary1',                     
            colspan: 2                        
        }, {
            key: "salaryOther",                                     // Gộp cột 'Thưởng doanh số' vs cột 'Thưởng doanh thu' thành 'Lương thưởng theo doanh thu - doanh số'
            columnName: "Lương thưởng theo doanh thu - doanh số",
            keyMerge: 'other1',
            colspan: 2
        }, {
            key: "other",                                           // Gộp cột 'Lương thưởng theo tháng' vs cột 'Lương thưởng theo doanh thu - doanh số' thành 'Lương thưởng khác'
            columnName: "Lương thưởng khác",
            keyMerge: 'salaryMonth',
            colspan: 4                                              
        }
    ],