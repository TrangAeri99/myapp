import { useState, useEffect } from 'react';

const useForm = (callback, isAdd,  validate) => {

    const [values, setValues] = useState({});
    const [errorss, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl]= useState(null);

    useEffect(() => {
        console.log(isAdd);
        console.log(isSent);
        console.log(isSubmitting);
        if (Object.keys(errorss).length === 0 && isSubmitting && isSent) {
            callback();
            console.log(isAdd);

        }
        // if (!isAdd) {
        //     setValues({});
        //     setErrors({});
        //     console.log(errorss);
        // }
    }, [errorss]);

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
        setIsSent(true);
    };

    const handleChange = (event) => {
        event.persist && event.persist();
        setIsSubmitting(false);
        if (event.target.name === 'image_path'){
            console.log(event.target.files[0]);
            const newValues = {...values, [event.target.name]: event.target.files[0]};
            isSent && setErrors(validate(newValues));
            setValues(values => (newValues));

            let reader = new FileReader();

            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            const newValues = {...values, [event.target.name]: event.target.value};
            isSent && setErrors(validate(newValues));
            setValues(values => (newValues));
        }
    };

    return {
        handleChange,
        handleSubmit,
        values,
        errorss,
        imagePreviewUrl
    }
};

export default useForm;
