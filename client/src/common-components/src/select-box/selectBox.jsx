import React, { Component } from 'react';
import './selectBox.css';

class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            searching: false,
            previouslySelectedOptions: [],
        }
    }

    delay = (callback, ms) => {
        var timer = 0;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }




    bindSelectBoxEvent = () => {
        const { id, multiple, onSearch, delay = 1000 } = this.props;

        if (multiple) {
            window.$("#" + id).parent().bind("keyup", "input.select2-search__field", this.delay((e) => {
                if (e.which === 13) // Bỏ qua enter
                    return;

                let searchBox = window.$("#" + id).parent().find('input.select2-search__field');
                let previouslySelectedOptions = [].filter.call(this.refs.select.options, o => o.selected).map(o => {
                    return { text: o.text, value: o.value };
                });

                // Lưu lại text search và các giá trị đã chọn
                this.setState((state) => {
                    return {
                        ...state,
                        searchText: searchBox.val(),
                        searching: true,
                        previouslySelectedOptions: previouslySelectedOptions,
                    }
                });

                if (onSearch) {
                    onSearch(searchBox.val());
                }
            }, delay));
        } else {
            window.$("#" + id).on('select2:open', (e) => {
                let searchBox = window.$(".select2-search.select2-search--dropdown").find('input.select2-search__field');

                searchBox.bind("keydown", this.delay((e) => {
                    if (e.which === 13) // Bỏ qua enter
                        return;

                    // Lưu lại text search
                    this.setState((state) => {
                        return {
                            ...state,
                            searchText: searchBox.val(),
                            searching: true,
                        }
                    });

                    if (onSearch) {
                        onSearch(searchBox.val());
                    }
                }, delay));

            });
        }

        let closeHandler = (e) => {
            if (this.state.searching) {
                this.setState((state) => {
                    return {
                        ...state,
                        searching: false
                    }
                })
            }
        }
        window.$("#" + id).unbind('select2:close', closeHandler);
        window.$("#" + id).on('select2:close', closeHandler);
    }



    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị đã chọn
        let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
        return value;
    }



    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (!(items1[i].value instanceof Array) && items1[i].value !== items2[i].value) { // Kiểu bình thường
                return false;
            } else if (items1[i].value instanceof Array && JSON.stringify(items1[i].value) !== JSON.stringify(items2[i].value)) { // Kiểu group
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.searching) {
            return null;
        }
        if (nextProps.id !== prevState.id || !SelectBox.isEqual(nextProps.items, prevState.items) || nextProps.disabled !== prevState.disabled || (nextProps.value && nextProps.value !== prevState.value)) {
            return {
                value: prevState.innerChange ? prevState.value : nextProps.value, // Lưu value ban đầu vào state
                innerChange: false,
                id: nextProps.id,
                items: nextProps.items,
                disabled: nextProps.disabled !== undefined ? nextProps.disabled : false
            }
        } else {
            return null;
        }
    }


    componentDidMount = () => {
        const { id, onChange, options = { minimumResultsForSearch: 1 }, multiple } = this.props;
        window.$("#" + id).select2(options);

        window.$("#" + id).on("change", () => {
            let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
            this.setState(state => {
                return {
                    ...state,
                    innerChange: true,
                    value: multiple ? value : value[0],
                }
            });
            if (onChange) {
                onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
            }
        });

        this.bindSelectBoxEvent();
    }


    componentDidUpdate() {
        const { id, multiple, options = { minimumResultsForSearch: 1 }, items } = this.props;
        const { searching, previouslySelectedOptions, searchText } = this.state;

        if (!searching) {
            window.$("#" + id).select2(options);
        } else {
            window.$("#" + id).find("option").remove(); // Xóa các option đã có

            if (multiple) {
                if (previouslySelectedOptions) { // Tạo lại các option đã chọn
                    previouslySelectedOptions.forEach(pso => {
                        let newOption = new Option(pso.text, pso.value, false, true);
                        window.$("#" + id).append(newOption);
                    });
                }

                items.forEach(element => { // Tạo thêm các option mới lấy từ server về
                    if (!previouslySelectedOptions || !previouslySelectedOptions.find(pso => pso.value === element.value)) {
                        let newOption = new Option(element.text, element.value, false, false);
                        window.$("#" + id).append(newOption);
                    }
                });
            } else {
                items.forEach(element => { // Tạo các option mới lấy từ server về
                    let newOption = new Option(element.text, element.value, false, false);
                    window.$("#" + id).append(newOption);
                });
            }


            window.$("#" + id).select2(); // Khởi tạo lại select2

            // Điền dữ liệu lại vào ô search
            let searchBox;
            if (multiple) {
                searchBox = window.$("#" + id).parent().find('input.select2-search__field');
                searchBox.val(searchText);
                let width = (searchText.length + 1) * 0.75 + 'em';
                searchBox.css('width', width);
                window.$("#" + id).select2("open"); // Mở lại dropdown, do đang tiến hành search. Dạng multiple phải thiết lập text cho searchBox trước, mở dropdown sau
            } else {
                window.$("#" + id).select2("open"); // Mở lại dropdown, do đang tiến hành search. Dạng single phải mở dropdown trước, thiết lập text cho searchBox sau
                let searchBox = window.$(".select2-search.select2-search--dropdown").find('input.select2-search__field');
                searchBox.val(searchText);
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.searching) {
            if (SelectBox.isEqual(nextProps.items, nextState.items)) {
                return false;
            }

            this.setState(state => {
                return {
                    ...state,
                    items: nextProps.items
                }
            });

            return true;
        }
        // Chỉ render lại khi id thay đổi, hoặc khi tập items thay đổi, value thay đổi, hoặc disabled thay đổi
        if (nextProps.id !== this.state.id || !SelectBox.isEqual(nextProps.items, this.state.items) || (nextProps.value && nextProps.value !== this.state.value) || (nextProps.disabled !== undefined ? nextProps.disabled : false) !== this.state.disabled)
            return true;
        return false;;
    }

    render() {
        const { id, items, className, style, multiple = false, options = {}, disabled = false } = this.props;

        const { searching } = this.state;

        return (
            <React.Fragment>
                <div className="select2">
                    <select className={className} style={style} ref="select" value={this.state.value} id={id} multiple={multiple} onChange={() => { }} disabled={disabled}>
                        {!searching &&
                            <React.Fragment>
                                {options.placeholder !== undefined && multiple === false && <option></option>} {/*Ở chế độ single selection, nếu muốn mặc định không chọn gì*/}
                                {items.map(item => {
                                    if (!(item.value instanceof Array)) { // Dạng bình thường
                                        return <option key={`key-${item.value}`} value={item.value}>{item.text}</option>
                                    } else {
                                        return ( // Dạng group
                                            <optgroup key={item.text} label={item.text}>
                                                {item.value.map(subItem => {
                                                    return <option key={subItem.value} value={subItem.value}>{subItem.text}</option>
                                                })}
                                            </optgroup>
                                        )
                                    }
                                })}
                            </React.Fragment>
                        }
                    </select>
                </div>
            </React.Fragment>
        );
    }
}

export { SelectBox };