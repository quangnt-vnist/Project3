import ValidationHelper from "../../../../helpers/validationHelper"

export default class SystemLinkValidator extends ValidationHelper {
    constructor(){

    }

    static validateUrl = (translate, url) => {
        let URL_REGEX = /^[^~`!@#$%^&*()+= *';\\<>?:",]*$/;
        let result = this.validateEmpty(translate, url);
        if(!result.status)
            return result;
        else if(url[0] !== '/' || !URL_REGEX.test(url))
            return { status: false, message: translate('general.validate.value')+translate('general.validate.invalid_error') };
        
        return { status: true };
    }
}