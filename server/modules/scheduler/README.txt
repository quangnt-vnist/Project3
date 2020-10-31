Hướng dẫn sử dụng Cron để lập lịch

---------------------------------------------------
A. KHỞI TẠO VÀ CHẠY scheduler ĐỊNH KỲ
---------------------------------------------------

B1. Tạo một service lập lịch trong scheduler.service.js
    Example: backupAutomatic là một service lập lịch.
        Tạo một scheduler lập lịch từ cron theo cú pháp: 
        [schedulerName] = new Cron(cronTime, onTick, onComplete, start, timeZone);
        Trong đó: 
            - cronTime: thời gian muốn setup để scheduler lập lịch chạy tự động
                * Định dạng cromTime: [second minute hour dayMonth month dayWeek], trong đó:
                    second: giây 0 -> 59
                    minute: phút 0 -> 59
                    hour: giờ 0 -> 23
                    dayMonth: ngày trong tháng 1 -> 31
                    month: tháng trong năm 0-11 (tương ứng từ tháng 1 -> 12)
                    dayWeek: ngày trong tuần 0-6 (tương ứng từ Chủ nhật -> Thứ 7)

            - onTick: function muốn chạy theo lịch tự động vừa set ở trên
            - onComplete: function muốn chạy khi scheduler bị dừng - không chạy tự động vì lý do nào đó - mặc định để null
            - start: tùy chọn khởi động scheduler ngay sau khi khởi tạo - mặc định để false - chỉ khởi tạo khi gọi start()
            - timeZone: timeZone - để mặc định là Asia/Ho_Chi_Minh
        
        Tham khảo thêm cách sử dụng Cron tại: https://www.npmjs.com/package/cron

B2. Sau khi tạo xong scheduler service, di chuyển đến file serve/global.js

B3. Tạo một biến global để setup chạy tự động scheduler vừa tạo
    Example: Tạo biến global cho backup dữ liệu tự động
    global.SERVER_BACKUP_AUTOMATIC = require('đường dẫn đến scheduler service');
    SERVER_BACKUP_AUTOMATIC.start(); - khởi chạy scheduler 

* Sau khi hoàn thành B3 scheduler service sẽ chạy tự động với thời gian (cronTime) được xét. 


---------------------------------------------------------
B. CHỈNH SỬA THÔNG TIN LẬP LỊCH CỦA scheduler.
(tham khảo ví dụ tại module system-admin/system-setting)
---------------------------------------------------------
Chỉnh sửa thông tin lập lịch của scheduler đang chạy -> sử dụng biến global đã khai bao trong file server/global.js tương ứng với sheduler.
1. Dừng chạy tự động scheduler:
    [schedulerName].stop()
        Example: Biến global tương ứng cho scheduler backup tự động là: SERVER_BACKUP_AUTOMATIC
        => SERVER_BACKUP_AUTOMATIC.stop();

2. Thiết lập lại thời gian chạy tự động của scheduler:
    [schedulerName].setTime(cronTime); - thiết lập lại thời gian (khi thiết lập scheduler sẽ tự động dừng chạy)
    Trong đó:
        - cronTime là thời gian muốn cập nhật lại cho scheduler
        Example: SERVER_BACKUP_AUTOMATIC.setTime('0 0 2 * * *'); chỉnh lại thời gian là backup vào 2h sáng mỗi ngày
    [schedulerName].start();   khởi động lại scheduler theo thời gian vừa set
    
