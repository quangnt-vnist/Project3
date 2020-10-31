import React, { Component } from 'react';
import './workSchedule.css';

class WorkSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        return (
            // <div className="box box-primary" style={{ border: "1px solid black" }}>
            //     <div className="box-header with-border">
            //         <div className="box-title">Lịch sản xuất xưởng thuốc nước tháng 10/2020</div>
            //         <div className="box-content" style={{ marginTop: "1rem" }}>
            //             <table className="table table-custom table-custom-bordered">
            //                 <thead>
            //                     <tr>
            //                         <th rowSpan={2} style={{ backgroundColor: "#F0F0F0", width: "5%" }}>Ca</th>
            //                         <th colSpan={days.length} style={{ backgroundColor: "#605CA8", color: "#FFFFFF" }}>October 2020</th>
            //                     </tr>
            //                     <tr>
            //                         {
            //                             days.map((day, index) => (
            //                                 <td key={index}>{day}</td>
            //                             ))
            //                         }
            //                     </tr>
            //                 </thead>
            //                 <tbody>
            //                     <tr>
            //                         <td>Ca 1</td>
            //                         {
            //                             days.map((day, index) => (
            //                                 index === 20
            //                                     ?
            //                                     <td key={index} style={{ backgroundColor: "red" }}></td>
            //                                     :
            //                                     <td key={index}></td>
            //                             ))
            //                         }
            //                     </tr>
            //                     <tr>
            //                         <td>Ca 2</td>
            //                         {
            //                             days.map((day, index) => (
            //                                 <td key={index}></td>
            //                             ))
            //                         }
            //                     </tr>
            //                     <tr>
            //                         <td>Ca 3</td>
            //                         {
            //                             days.map((day, index) => (
            //                                 <td key={index}></td>
            //                             ))
            //                         }
            //                     </tr>
            //                 </tbody>
            //             </table>
            //         </div>
            //     </div>
            // </div>

            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Lich san xuat thang 10-2020</legend>
                <table className="table table-custom table-custom-bordered">
                    <thead>
                        <tr>
                            <th rowSpan={2} style={{ width: "5%" }}>Ca</th>
                            <th colSpan={days.length} style={{ backgroundColor: "#605CA8", color: "#FFFFFF" }}>October 2020</th>
                        </tr>
                        <tr>
                            {
                                days.map((day, index) => (
                                    <td key={index}>{day}</td>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Ca 1</td>
                            {
                                days.map((day, index) => (
                                    index === 20
                                        ?
                                        <td className="td-content" key={index} style={{ backgroundColor: "red" }}></td>
                                        :
                                        <td className="td-content" key={index}></td>
                                ))
                            }
                        </tr>
                        <tr>
                            <td>Ca 2</td>
                            {
                                days.map((day, index) => (
                                    <td className="td-content" key={index}></td>
                                ))
                            }
                        </tr>
                        <tr>
                            <td>Ca 3</td>
                            {
                                days.map((day, index) => (
                                    <td className="td-content" key={index}></td>
                                ))
                            }
                        </tr>
                    </tbody>
                </table>

            </fieldset>
        )
    }
}

export default WorkSchedule;