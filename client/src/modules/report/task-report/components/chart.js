export const chartFunction = {
    formatChartType,
    formatDataForAxisXInChart,
    convertMonthYear,
    convertYear,
    getQuarter,
    groupByDate,
    groupByResponsibleEmployees,
    groupByAccountableEmployees,
    aggregate,
    dataAfterAggregate,
    separateDataChart,
    separateResponsibleEmployees,
    separateAccountableEmployees,
    separateResponsibleEmployeesAndAccountableEmployees,
    convertDataPieChart,
    convertArray3dTo1d,
    convertDataBarAndLineChart,
    filterFieldInListTask,
    exportDataChart,
}

/**
 * Hàm format dạng biểu đồ
 * @param {} chartType Dang biểu đồ - kiểu dữ liệu Number
 */
function formatChartType(chartType) {
    chartType = parseInt(chartType);
    if (chartType === 0) return "bar";
    if (chartType === 1) return "line";
    if (chartType === 2) return "pie";
}

/**
 * Hàm format chiều dữ liệu
 * @param {*} data 
 */
function formatDataForAxisXInChart(data) {
    let dataFormat = parseInt(data);
    if (dataFormat === 1) return "Thời gian";
    if (dataFormat === 2) return "Người thực hiện";
    if (dataFormat === 3) return "Người phê duyệt";
}

/**
 * Hàm convert thời gian ra tháng
 * @param {*} data:thời gian - kiểu dữ liệu string 
 */
function convertMonthYear(date) {
    let newDate = date.toString();
    const time = new Date(newDate);
    const month = time.getMonth();
    const year = time.getFullYear();
    return `${month + 1}-${year}`;
}


/**
 * Hàm convert thời gian ra năm
 * @param {*} date : Time - kiểu dữ liệu string
 */
function convertYear(date) {
    let newDate = date.toString();
    const time = new Date(newDate);
    const year = time.getFullYear();
    return `${year}`;
}


/**
 * Hàm convert thời gian ra quý
 * @param {*} date Time - kiểu dữ liệu string
 */
function getQuarter(date) {
    let newDate = date.toString();
    const time = new Date(newDate);
    const quarter = Math.floor((time.getMonth() + 3) / 3);
    const year = (`Quý${quarter}-`) + time.getFullYear();
    return `${year}`;
}


/**
 * Hàm gom nhóm các công việc theo thời gian
 * @param {*} tasks Danh sách công việc
 */
function groupByDate(tasks, dataAxisX) {
    if (dataAxisX && dataAxisX.indexOf(1) === 0 || dataAxisX.length === 0) { // Nhóm theo thời gian (Thời gian được gom nhóm đầu tiên)
        return tasks.reduce((groups, item) => {
            groups[item.time] = [...groups[item.time] || [], item];
            return groups;
        }, {});
    } else if (dataAxisX && dataAxisX.indexOf(1) === 1) { // Nhóm theo thời gian (Thời gian được gom nhóm thứ 2)
        return Object.entries(tasks).map(([o, datapoints]) => {
            return datapoints.reduce((groups, item) => {
                const getTime = item.time;
                groups[[o] + ` | ${getTime}`] = [...groups[[o] + ` | ${getTime}`] || [], item]
                return groups;
            }, [])
        })
    } else { // Nhóm theo thời gian (Thời gian được gom nhóm thứ 3)
        return tasks.map(obj => {
            return Object.entries(obj).map(([o, item]) => {
                return item.reduce((groups, item) => {
                    const getTime = item.time;
                    groups[[o] + ` | ${getTime}`] = [...groups[[o] + ` | ${getTime}`] || [], item]
                    return groups;
                }, [])
            })
        })
    }
}


/**
 * Hàm gom nhóm các công việc theo người thực hiện
 * @param {*} tasks Danh sách các công việc
 */
function groupByResponsibleEmployees(tasks, dataAxisX) {
    if (dataAxisX && dataAxisX.indexOf(2) === 0) { // Nhóm theo người thực hiện (Người thực hiện gom nhóm đầu tiên)
        return tasks.reduce((groups, item) => {
            groups[item.responsibleEmployees.toString()] = [...groups[item.responsibleEmployees.toString()] || [], item];
            return groups;
        }, {});
    }
    else if (dataAxisX && dataAxisX.indexOf(2) === 1) { // Nhóm theo người thực hiện (Người thực hiện gom nhóm thứ 2)
        return Object.entries(tasks).map(([o, datapoints]) => {
            return datapoints.reduce((groups, item) => {
                const getRes = item.responsibleEmployees.toString();
                groups[[o] + ` | ${getRes}`] = [...groups[[o] + ` | ${getRes}`] || [], item];
                return groups;
            }, []);
        })
    }
    else { // Nhóm theo người thực hiện (Người thực hiện gom nhóm thứ 3)
        return tasks.map(o => {
            return Object.entries(o).map(([obj, item]) => {
                return item.reduce((groups, item) => {
                    const getRes = item.responsibleEmployees;
                    groups[[obj] + ` | ${getRes}`] = [...groups[[obj] + ` | ${getRes}`] || [], item];
                    return groups;
                }, []);
            })
        })
    }
}


/**
 * Hàm gom nhóm các công việc theo người phê duyệt
 * @param {*} tasks Danh sách các công việc
 */
function groupByAccountableEmployees(tasks, dataAxisX) {
    if (dataAxisX && dataAxisX.indexOf(3) === 0) { // Nhóm theo người phê duyệt (Người phê duyệt gom nhóm đầu tiên)
        return tasks.reduce((groups, item) => {
            groups[item.accountableEmployees.toString()] = [...groups[item.accountableEmployees.toString()] || [], item];
            return groups;
        }, {});
    }
    else if (dataAxisX && dataAxisX.indexOf(3) === 1) { // Nhóm theo người phê duyệt (Người phê duyệt gom nhóm thứ 2)
        return Object.entries(tasks).map(([o, datapoints]) => {
            return datapoints.reduce((groups, item) => {
                const getAcc = item.accountableEmployees.toString();
                groups[[o] + ` | ${getAcc}`] = [...groups[[o] + ` | ${getAcc}`] || [], item];
                return groups;
            }, []);
        })
    }
    else { // Nhóm theo người phê duyệt (Người phê duyệt gom nhóm cuối cùng)
        return tasks.map(o => {
            return Object.entries(o).map(([obj, item]) => {
                return item.reduce((groups, item) => {
                    const getAcc = item.accountableEmployees;
                    groups[[obj] + ` | ${getAcc}`] = [...groups[[obj] + ` | ${getAcc}`] || [], item];
                    return groups;
                }, [])

            })
        })
    }
}


/**
 * Hàm tính tổng và trung bình cộng các công việc
 * @param {*} tasks Danh sách các công việc đã convert đúng định dạng đầu vào
 */
function aggregate(tasks) {
    let map = new Map;
    for (let { aggregationType, coefficient, code, value, chartType, showInReport } of tasks) {
        if (showInReport === true) { // Kiểm tra nếu trường thông tin nào được đưa vào biểu đồ
            let entry = map.get(code);
            if (!entry) map.set(code, entry = { aggregationType, chartType, showInReport, coefficient, sum: 0, count: 0 });
            entry.sum += value;
            entry.count++;
        }
    }
    return Array.from(map, ([code, { aggregationType, chartType, showInReport, coefficient, sum, count }]) =>
        [code, (+aggregationType ? sum : sum / count) * coefficient, formatChartType(chartType), showInReport]
    );
}


/**
 * Hàm Convert data sau khi tính toán
 * @param {*} input Đầu vào là một mảng gồm mảng các giá trị có cặp key, value
 */
function dataAfterAggregate(input) {
    return input.map(([time, datapoints]) => {
        // flat thành mảng 1 cấp -> tính toán cho dễ
        const allTasks = datapoints.flatMap(point => point.task.map(x => ({ ...x, responsibleEmployees: point.responsibleEmployees, accountableEmployees: point.accountableEmployees })))
        // Tên mới cho trường thông tin, nếu người dùng không đổi tên trường thông tin thì sẽ mặc định lấy 
        allTasks.map(item => {
            if (item.newName) {
                item.code = item.newName;
            } else {
                item.code = item.code;
            }
            return item;
        })
        const result = aggregate(allTasks); // gọi hàm tính trung bình cộng và tổng. 
        return {
            time,
            tasks: result.map(([code, value, chartType, showInReport]) => ({ code, value, chartType, showInReport })),
        }
    });
}


/**
 * Hàm tách data vẽ chart: Tách riêng data vẽ biểu đồ cột, đường và tròn
 * @param {*} input Danh sách các tasks đã được tính trung bình hoặc tổng, convert theo đúng dạng đầu vào
 */
function separateDataChart(input) {
    let pieChartData = [], barLineChartData = [];
    input.forEach(x => {
        const tasks = x.tasks.filter(y =>
            y.chartType === "pie" ? (pieChartData.push({ tasks: [y], time: x.time }), false) : true)
        if (tasks.length > 0) {
            barLineChartData.push({
                time: x.time,
                tasks: tasks,
            })
        }
    })
    return { pieChartData, barLineChartData };
}


/**
 * Hàm tách riêng từng người thực hiện (Nếu một công việc có 3 người thực hiện thì tách ra mỗi công việc 1 người thực hiện)
 * @param {*} input Dữ liệu bên server trả ra, mặc định người thực hiện trả ra là mảng
 */
function separateResponsibleEmployees(input) {
    let results = [];
    input.forEach(x => {
        x.responsibleEmployees.forEach(y => {
            results.push({
                time: x.time,
                task: x.task,
                accountableEmployees: x.accountableEmployees,
                responsibleEmployees: y,
            })
        })
    });
    return results;
}


/**
 * Hàm tách riêng từng người phê duyệt (Nếu một công việc có 3 người phê duyệt thì tách ra mỗi công việc 1 người phê duyệt)
 * @param {*} input Dữ liệu bên server trả ra, mặc định người phê duyệt trả ra là mảng
 */
function separateAccountableEmployees(input) {
    let results = [];
    input.forEach(x => {
        x.accountableEmployees.forEach(y => {
            results.push({
                time: x.time,
                task: x.task,
                accountableEmployees: y,
            })
        })
    });
    return results;
}


/**
 * Hàm tách cả người thực hiện và người phê duyệt ( Dùng cho 3 chiều dữ liệu)
 * @param {*} input 
 */
function separateResponsibleEmployeesAndAccountableEmployees(input) {
    let results = [];
    input.forEach(x => {
        x.responsibleEmployees.forEach(y => {
            x.accountableEmployees.forEach(z => {
                results.push({
                    time: x.time,
                    task: x.task,
                    responsibleEmployees: y,
                    accountableEmployees: z,
                })
            })
        })
    })
    return results;
}


/**
 * Hàm convert data qua dạng của c3js với biểu đồ tròn khi chọn 1 chiều dữ liệu
 * @param {*} data 
 */
function convertDataPieChart(data) {
    let groupByCode = {}, pieDataConvert;

    data.flatMap(item => item.tasks.map(task => ({ ...task, time: item.time })) //Thêm time vào mảng task
    ).forEach(childTask => {
        if (groupByCode[childTask.code]) {
            groupByCode[childTask.code].push(childTask)
        } else {
            groupByCode[childTask.code] = [childTask];
        }
    })

    pieDataConvert = Object.entries(groupByCode).map(([code, tasks]) => ({
        [code]: tasks.map((task) => [task.time, task.value])
    }))
    return pieDataConvert;
}


/**
 * Hàm convert data qua dạng của c3js với biểu đồ đường và cột
 * @param {*} data 
 */
function convertDataBarAndLineChart(data) {
    let dataConvert = [['x']], typeChart = {};
    let indices = { time: 0 }; // chỉ số time = 0 ứng với mảng x trong dataConvert 

    if (data) {
        data.forEach(x => {
            dataConvert[indices.time].push(x.time); // thêm time vào mảng dataConvert vị trí index 0 (trong ['x'])
            x.tasks.forEach(({ code, value, chartType }) => {
                if (!(code in indices)) // check xem code (p1, p2,...) có trong  indices hay chưa
                    indices[code] = dataConvert.push([code]) - 1; //  chưa có thì push trường thông tin và chỉ số vào indices, dataConvert.push([code]) - 1 : trả về length của indices sau khi push
                dataConvert[indices[code]].push(value);

                typeChart = { ...typeChart, [code]: chartType }; // lấy dạng biểu dồ cho từng trường thông tin để vẽ biểu đồ tương ứng( bar, line)
            });
        });
    }
    return { dataConvert, typeChart };
}


/**
 * Hàm convert đầu vào cho hàm tính toán trung bình cộng, tổng (Dùng cho dạng 3 chiều dữ liệu)
 * @param {*} input 
 */

function convertArray3dTo1d(input) {
    let newArray = input.flatMap(x => x.map(y => y));
    newArray = newArray.flatMap(z => Object.entries(z));
    return newArray
}


/**
 * Hàm lọc lấy các trường cần thiết cho việc config dữ liệu biểu đồ.
 * @param {*} tasks danh sách công việc ban đầu
 * 
 * Đầu ra sẽ là danh sách các công việc được rút gọn và chiều dữ liệu
 */
function filterFieldInListTask(tasks) {
    let newlistTaskEvaluations, frequency, dataForAxisXInChart = [];
    // Lấy tần suất, Vì tần suất là chung cho các công việc nên chỉ cần lấy công việc đầu tiên
    let taskEvaluation = tasks[0];
    frequency = taskEvaluation.frequency.toString();

    // Lấy giá trị chọn chiều dữ liệu đưa vào biểu đồ
    dataForAxisXInChart = taskEvaluation.dataForAxisXInChart;
    if (dataForAxisXInChart.length > 0) {
        dataForAxisXInChart = dataForAxisXInChart.map(x => x.id);
    } else {
        // Trường hợp người dùng không chọn chiều dữ liệu, thì mặc định láy chiều thời gian
        dataForAxisXInChart = dataForAxisXInChart;
    }

    newlistTaskEvaluations = tasks.map(item => {
        return {
            time: (frequency && frequency === 'month') ? convertMonthYear(item.date)
                : (frequency === 'quarter' ? getQuarter(item.date) : convertYear(item.date)),
            task: item.taskInformations.filter(task => {
                if (task.type === 'number')
                    return task;
            }),
            responsibleEmployees: item.responsibleEmployees.map(x => x.name),
            accountableEmployees: item.accountableEmployees.map(x => x.name),
        }
    });
    return { newlistTaskEvaluations, dataForAxisXInChart };
}


/**
 * Hàm tính toán, xử lý các trường hợp có thể của dữ liệu 3 chiều: thời gian, người thực hiện, người phê duyệt
 * @param {*} tasks danh sách công việc
 * @param {*} dataForAxisXInChart mảngchiều dữ liệu cho biểu đồ
 * 
 * Đầu ra của hàm là dữ liệu cho biểu đồ cột+đường và tròn
 */
function exportDataChart(tasks, dataForAxisXInChart) {
    let output, pieChartData = [], barLineChartData = [], pieChartDataConvert, barAndLineDataChartConvert;

    /**
     * Convert data, gom nhóm, tính tổng và tính trung bình cộng các trường thông tin.
     *  Nếu chọn trục hoành là thời gian dataForAxisXInChart = 1
     */
    if (dataForAxisXInChart.toString() === "1" && dataForAxisXInChart.length === 1 || dataForAxisXInChart.length === 0) {
        let groupDataByDate;

        // Gọi hàm groupByDate gom nhóm theo thời gian
        groupDataByDate = Object.entries(groupByDate(tasks, dataForAxisXInChart));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByDate);
    }


    /**
     * Convert data, gom nhóm theo người thực hiện, tính trung bình cộng các trường thông tin.
     * Nếu trục hoành là người thực hiện dataForAxisXInChart = '2'
     */
    else if (dataForAxisXInChart.toString() === "2" && dataForAxisXInChart.length === 1) {
        let groupDataByResponsibleEmployees;

        // Gọi hàm separateResponsibleEmployees tách người thực hiện
        let results = separateResponsibleEmployees(tasks);

        // Gọi hàm groupByResponsibleEmployees nhóm công việc theo người thực hiện
        groupDataByResponsibleEmployees = Object.entries(groupByResponsibleEmployees(results, dataForAxisXInChart)); // Dùng Object.entries convert thành mảng các phần tử có cặp key,value

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByResponsibleEmployees);

    }


    /**
     * Convert data, gom nhóm theo người phê duyệt, tính trung bình cộng các trường thông tin.
     * Nếu trục hoành là người phê duyệt dataForAxisXInChart = '3'
     */
    else if (dataForAxisXInChart.toString() === "3" && dataForAxisXInChart.length === 1) {
        let groupDataByAccountableEmployees;

        // Gọi hàm separateAccountableEmployees tách người phê duyệt
        let results = separateAccountableEmployees(tasks);

        // Gọi hàm groupByAccountableEmployees nhóm công việc theo người phê duyệt
        groupDataByAccountableEmployees = Object.entries(groupByAccountableEmployees(results, dataForAxisXInChart));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByAccountableEmployees);
    }

    /**
     * Convert data, gom nhóm theo thời gian và người thực hiện, tính trung bình cộng các trường thông tin.
     * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của chiều thời gian và người thực hiện có ở trong mảng dataForAxisXInChart hay không. 
     * nếu id = 1 chiều thời gian, id = 2 là chiều người thực hiện
     */
    else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.length === 2) {
        // Gọi hàm separateResponsibleEmployees tách người thực hiện
        let results = separateResponsibleEmployees(tasks);

        // Gọi hàm groupByDate nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(results, dataForAxisXInChart);

        // Tiếp tục gom nhóm theo người thực hiện: thực hiện đính kèm ngày với tên người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart)

        // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
        groupDataByResponsibleEmployees = groupDataByResponsibleEmployees.flatMap(x => Object.entries(x));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByResponsibleEmployees);
    }

    /**
     * Convert data, gom nhóm theo người thực hiện và thời gian, tính tổng/ trung bình cộng các trường thông tin.
     * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của chiều người thực hiện và thời gian có ở trong mảng dataForAxisXInChart hay không.
     * id = 2 là chiều người thực hiện, nếu id = 1 chiều thời gian
     */
    else if (dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.length === 2) {
        // Gọi hàm separateResponsibleEmployees tách người thực hiện
        let results = separateResponsibleEmployees(tasks);

        // Gọi hàm groupByResponsibleEmployees nhóm công việc theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(results, dataForAxisXInChart);

        // Sau khi gom nhóm theo người thực hiện thì gom nhóm theo thời gian 
        let groupDataByDate = groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart)

        // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
        groupDataByDate = groupDataByDate.flatMap(x => Object.entries(x));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByDate);
    }


    /**
     * Convert data, gom nhóm theo thời gian và người phê duyệt, tính tổng/ trung bình cộng các trường thông tin.
     * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của thời gian và người phê duyệt có ở trong mảng dataForAxisXInChart hay không.
     * nếu id = 1 chiều thời gian, id = 3 là chiều người phê duyệt,
     */
    else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.length === 2) {
        // Gọi hàm separateAccountableEmployees tách người phê duyệt
        let results = separateAccountableEmployees(tasks);

        // Gọi hàm groupByDate nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(results, dataForAxisXInChart);

        // Sau khi gom nhóm theo thời gian thì gom nhóm theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(groupDataByDate, dataForAxisXInChart);

        // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
        groupDataByAccountableEmployees = groupDataByAccountableEmployees.flatMap(x => Object.entries(x));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByAccountableEmployees);
    }


    /**
     * Convert data, gom nhóm theo người phê duyệt và thời gian, tính tổng/ trung bình cộng các trường thông tin.
     * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của người phê duyệt và thời gian có ở trong mảng dataForAxisXInChart hay không.
     * nếu id = 1 chiều thời gian, id = 3 là chiều người phê duyệt, id=3 nằm ở vị trí 0 trong mảng dataForAxisXInChart thì gom nhóm trước
     */
    else if (dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.length === 2) {
        // Gọi hàm separateAccountableEmployees tách người phê duyệt
        let results = separateAccountableEmployees(tasks);

        // Gọi hàm groupByAccountableEmployees nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(results, dataForAxisXInChart);

        // Sau khi gom nhóm theo người phê duyệt thì tiếp tục gom nhóm theo thời gian
        let groupDataByDate = groupByDate(groupDataByAccountableEmployees, dataForAxisXInChart)

        // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
        groupDataByDate = groupDataByDate.flatMap(x => Object.entries(x));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByDate);
    }

    // Người thực hiện -> Người phê duyệt
    else if (dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.length === 2) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Nhóm công việc theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(results, dataForAxisXInChart);

        // Nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(groupDataByResponsibleEmployees, dataForAxisXInChart);

        groupDataByAccountableEmployees = groupDataByAccountableEmployees.flatMap(x => Object.entries(x));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByAccountableEmployees);
    }

    // Người phê duyệt -> Người thực hiện
    else if (dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.length === 2) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(results, dataForAxisXInChart);

        // Nhóm công việc theo Người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(groupDataByAccountableEmployees, dataForAxisXInChart);

        groupDataByResponsibleEmployees = groupDataByResponsibleEmployees.flatMap(x => Object.entries(x));

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByResponsibleEmployees);
    }

    // Time -> Người thực hiện -> người phê duyệt
    else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.indexOf(3) === 2 && dataForAxisXInChart.length === 3) {
        // Danh sách người thực hiện và người thực hiện từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Gom nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(results, dataForAxisXInChart);

        // Sau đó gom nhóm theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart);

        // Sau đó gom nhóm theo người phê duyệt
        let groupByAccountableEmployees = groupByAccountableEmployees(groupDataByResponsibleEmployees, dataForAxisXInChart);

        // groupByAccountableEmployees đang là mảng 3 cấp-> convert 1 array câp
        groupByAccountableEmployees = convertArray3dTo1d(groupByAccountableEmployees);

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupByAccountableEmployees);
    }

    // Time -> Người phê duyệt -> người thực hiện
    else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.indexOf(2) === 2 && dataForAxisXInChart.length === 3) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Gom nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(results, dataForAxisXInChart);

        // Sau đó gom nhóm theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(groupDataByDate, dataForAxisXInChart);

        // Sau đó gom nhóm theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(groupDataByAccountableEmployees, dataForAxisXInChart);

        groupDataByResponsibleEmployees = convertArray3dTo1d(groupDataByResponsibleEmployees);

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByResponsibleEmployees);
    }

    // Người thực hiện -> time -> người phê duyệt
    else if (dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(3) === 2 && dataForAxisXInChart.length === 3) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Nhóm công việc theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(results, dataForAxisXInChart);

        // Sau đó gom nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart);

        // Sau đó gom nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(groupDataByDate, dataForAxisXInChart);

        groupDataByAccountableEmployees = convertArray3dTo1d(groupDataByAccountableEmployees);

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByAccountableEmployees);
    }

    // người thực hiện -> Người phê duyệt -> time
    else if (dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.indexOf(1) === 2 && dataForAxisXInChart.length === 3) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Nhóm công việc theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(results, dataForAxisXInChart);

        // Sau đó gom nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(groupDataByResponsibleEmployees, dataForAxisXInChart);

        // Sau đó gom nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(groupDataByAccountableEmployees, dataForAxisXInChart);

        // Convert thành mảng 1 cấp
        groupDataByDate = convertArray3dTo1d(groupDataByDate);

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByDate);
    }


    // Người phê duyệt -> time -> người thực hiện
    else if (dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(2) === 2 && dataForAxisXInChart.length === 3) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Gom nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(results, dataForAxisXInChart);

        // Sau đó gom nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(groupDataByAccountableEmployees, dataForAxisXInChart);

        // Nhóm công việc theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart);

        groupDataByResponsibleEmployees = convertArray3dTo1d(groupDataByResponsibleEmployees);

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByResponsibleEmployees);
    }

    // Người phê duyệt -> Người thực hiện -> time 
    else if (dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.indexOf(1) === 2 && dataForAxisXInChart.length === 3) {
        // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
        let results = separateResponsibleEmployeesAndAccountableEmployees(tasks);

        // Gom nhóm công việc theo người phê duyệt
        let groupDataByAccountableEmployees = groupByAccountableEmployees(results, dataForAxisXInChart);

        // Nhóm công việc theo người thực hiện
        let groupDataByResponsibleEmployees = groupByResponsibleEmployees(groupDataByAccountableEmployees, dataForAxisXInChart);

        // Sau đó gom nhóm công việc theo thời gian
        let groupDataByDate = groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart);

        groupDataByDate = convertArray3dTo1d(groupDataByDate);

        // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
        output = dataAfterAggregate(groupDataByDate);
    }

    if (output) {
        // tách data vẽ biểu đồ:  cột với đường ra riêng, tròn ra riêng
        let separateData = separateDataChart(output); // gọi hàm tách data
        pieChartData = separateData.pieChartData; // Dữ liệu vẽ biểu đồ tròn
        barLineChartData = separateData.barLineChartData; // Dữ liệu vẽ biểu đồ cột và đường

        // convert Data pieChart sang dạng C3js
        if (pieChartData && pieChartData.length > 0) {
            pieChartDataConvert = convertDataPieChart(pieChartData);
        }

        // Convert Data vẽ biểu đồ cột và đường dạng c3js
        if (barLineChartData && barLineChartData.length > 0) {
            barAndLineDataChartConvert = convertDataBarAndLineChart(barLineChartData);
        }
    }
    return { pieChartDataConvert, barAndLineDataChartConvert };
}