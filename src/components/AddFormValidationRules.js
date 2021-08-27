export default function validate(values) {
    let errorss = {};
    if (!values.image_path) {
        errorss.image_path = 'The field is required';
    }
    if (!values.name) {
        errorss.name = 'The field is required';
    }
    // else if (!/\S+@\S+\.\S+/.test(values.email)) {
    //     errorss.email = 'Email address is invalid';
    // }
    if (!values.cmt) {
        errorss.cmt = 'The field is required';
    }
    if (!values.dateOfBirth) {
        errorss.dateOfBirth = 'The field is required';
    }
    if (!values.gender) {
        errorss.gender = 'The field is required';
    }
    if (!values.address) {
        errorss.address = 'The field is required';
    }
    if (!values.level) {
        errorss.level = 'The field is required';
    }
    if (!values.yearOfEx) {
        errorss.yearOfEx = 'The field is required';
    } else if (values.yearOfEx < 0){
        errorss.yearOfEx = 'The yearOfEx > 0';
    }
    if (!values.position) {
        errorss.position = 'The field is required';
    }

    return errorss;
};