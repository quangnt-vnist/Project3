## Tóm tắt thuật toán (cây KPI đơn vị)

** Service: getAllEmployeeKpiInChildrenOrganizationalUnit, getAllTaskOfChildrenOrganizationalUnit

    Input: roleId, organizationalUnitId, month

    Output: 
        + Trả về các mảng đơn vị, mỗi mảng gồm các organizational unit kpi và task của đơn vị đó
        + Mỗi organizational unit kpi là 1 mảng gồm các employee kpi của kpi đó
        
** Thuật toán:
    - Từ dữ liệu nhận được từ server, lọc ra các mảng theo từng organizational unit kpi của đơn vị là cha cao nhất
    - Mỗi mảng gồm toàn bộ các organizational unit kpi là con trực tiếp và gián tiếp của kpi cha cao nhất
    - Từ mỗi mảng đã lọc, duyệt các organizational unit kpi bắt đầu từ con thấp nhất -> cao nhất, mỗi 1 kpi con
được duyệt xong sẽ trả về Object gồm tên, đơn vị, số lượng kpi con,... (config dùng trong Tree), mỗi object lại
được sử dụng cho kpi cha trực tiếp(kpi cha trực tiếp sẽ trả về object giống kpi con vừa duyệt, trong đó bao gồm
cả dữ liệu của kpi con....)
    - Cứ tiếp tục duyệt như vậy đến kpi cha cao nhất, khi đó mỗi organizational unit kpi của mỗi đơn vị sẽ trả về
1 object(trong đó dữ liệu tính cả dữ liệu của các kpi con).
