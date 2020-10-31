Component này dùng để hiện thị table có dạng cây (tree), các dòng có thể thu lại hoặc mở rộng
Để sử dụng Component này ta thực hiện các bước sau:
(Xem ví dụ minh hoạ trong Component DepartmentManage.jsx trong modules/employees-manager/department-manager/component)

BƯỚC 1: Import component
...
import { TreeTable } from '../../../../common-components';

BƯỚC 2: Sử dụng component
<TreeTable
    behaviour="show-children"      // Khi render bảng, tự động expand hết các dòng con. Nếu muốn hiệu ứng ngược lại, sử dụng behaviour="hide-children" 
    column={column}                // khai báo các cột của bảng, định dạng dữ liệu mô tả trong LƯU Ý 1
    data={data}                    // khai báo dữ liệu hiển thị trong bảng, định dạng dữ liệu mô tả trong LƯU Ý 2
    
    /* Khai báo title của các action button ở cột cuối cùng của bảng
     * Bảng có các action: edit, view, store, add, delete, startTimer
     * Sử dụng action nào thì khai báo key là các action trên và value là title muốn hiển thị
    */
    titleAction={{
        edit: "Chỉnh sửa",         
        view: "Xem thông tin",      
        store: "Lưu kho",
        add: "Thêm thông tin",
    }}

    /*
     * Khai báo các function bắt sự kiện onclick cho các action tương ứng
     * có các function: funcEdit, funcStartTimer, funcView, funcStore, funcDelete, funcAdd
     * Sử dụng action nào thì thêm function tương ứng vào
    */
    funcEdit={this.handleShowEdit}
    funcStartTimer={this.handleShowStart}
    // ...
    
/>


LƯU Ý 1: Kiểu dữ liệu của column có dạng
    /*
     * name: là tên các cột hiển thị trong bảng
     * key: là các khóa tương ứng trong đối tượng data truyền vào
    */
    column = [
        { name: "Tên đơn vị", key: "name" },
        { name: "Mô tả đơn vị", key: "description" }
    ];

Lưu ý 2: Kiểu dữ liệu của data có dạng mảng, mỗi đối tượng ứng với một dòng
    /* 
     * Mỗi đối tượng chứa array action, mô tả các hành động có thể thực hiện
     * VD: có dòng thì người dùng được edit, có dòng chỉ được view, ...
     * Nếu dòng có nhiều action, ta có thể dùng button collapse để gộp các action lại
     * Khi đó, ta truyền các action muốn gộp vào array và nên để cuối của array action. ví dụ:  
     * action: ["edit", "view", ["delete", "store"]]
    */
    data = [
        {
            _id: "1",
            name: "Phòng hành chính",
            description: "Mô tả phòng hành chính",
            action: ["edit", "view", "delete"],
            parent: null,
        }, {
            _id: "3",
            description: "Mô tả phòng kinh doanh",
            name: "Phòng kinh doanh",
            action: ["edit", "view"],
            parent: "null",
        },
        {
            _id: "2",
            description: "Mô tả ban giám đốc",
            name: "Ban giám đốc",
            action: ["edit", "view", ["delete", "store"]],
            parent: 1,
        }
    ];
