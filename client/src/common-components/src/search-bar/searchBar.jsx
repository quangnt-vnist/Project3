import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, SelectMulti } from '../../index';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: '',
            value: ''
        }
    }

    handleEnterLimitSetting = (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.props.search();
        }
    }

    handleChangeOption = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                option: value[0]
            }
        })
        await this.props.setOption("option", this.state.option);
    }

    handleChangeInput = async(e) => {
        const {value} = e.target;
        await this.setState(state => {
            return {
                ...state,
                value
            }
        })
        await this.props.setOption("value", this.state.value); //set giá trị của nội dung muốn tìm kiếm
    }

    handleChange = async (value) => {
        if (value.length === 0) {
            value = null
        };
        await this.setState(state => {
            return {
                ...state,
                value
            }
        })
        await this.props.setOption("value", this.state.value);
    }

    search = () => {
        this.props.search();
    } 

    render() { 
        const { columns, translate, option, id='search-bar', typeColumns, valueOption } = this.props;
        
        return ( 
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('form.property')}</label>
                            <SelectBox
                                id={id}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    columns !== undefined ? columns.map( column => { return { value: column.value, text: column.title} }) : []
                                }
                                onChange={this.handleChangeOption}
                                multiple={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('form.value')}</label>

                            { option === 'type' ? 
                                <SelectMulti 
                                    id={`multiSelectType`} 
                                    multiple="multiple"
                                    options={valueOption}
                                    onChange={this.handleChange}
                                    items= {
                                        typeColumns !== undefined ? typeColumns.map( column => { return { value: column.value, text: column.title} }) : []
                                    }>
                                </SelectMulti>:
                                <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} placeholder={translate('searchByValue')} onChange={this.handleChangeInput}/>
                            }
                            <button type="button" className="btn btn-success" onClick={this.search} title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const SearchBarExport = connect(mapState, null)(withTranslate(SearchBar));

export { SearchBarExport as SearchBar }