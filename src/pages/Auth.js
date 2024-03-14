import axios from "axios"
import { useEffect, useState, useContext } from "react"
import env from "../config/config"
import { useFormik } from "formik"
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/contsxt";

const Auth = () => {
    const navigate = useNavigate();
    const { users, setUsers } = useContext(UserContext);
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters long')
            .required('Password is required'),
        photo: Yup.string().required('Photo is required'),
        fullName: Yup.string().required('Name is required')
    });

    const [login, setLogin] = useState(true)
    const [state, setState] = useState({
        error: '',
        loader: false
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            photo: '',
            fullName: ''
        },
        validationSchema: validationSchema,
    })
    useEffect(() => {

        formik.setValues({
            ...formik.values, email: '',
            password: '',
        })

    }, [login])

    const handleSubmit = async () => {
        setState({ ...state, loader: true })
        if (!login) {
            if (!formik.errors.password && !formik.errors.email && !formik.errors.fullName && !formik.errors.photo) {
                const formData = new FormData();
                formData.append('file', formik.values.photo);
                formData.append('email', formik.values.email);
                formData.append('fullName', formik.values.fullName);
                formData.append('password', formik.values.password);
                let user = await axios.post(`${env.APIURL}/signup`, formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )

                if (user.data.success) {
                    localStorage.setItem('user', JSON.stringify({
                        _id: user.data.data._id,
                        fullName: user.data.data.fullName,
                        profileImage: user.data.data.profileImage,
                        email: user.data.data.email,
                        token: user.data.token
                    }))
                    setUsers({
                        _id: user.data.data._id,
                        fullName: user.data.data.fullName,
                        profileImage: user.data.data.profileImage,
                        email: user.data.data.email,
                        token: user.data.token
                    })
                    setState({ ...state, loader: false })

                    navigate("/chats")

                } else {
                    setState({
                        error: user.data.message,
                        loader: false
                    })

                }
            } else {
                setState({
                    error: 'Please Fill Out All Fields and photo',
                    loader: false
                })
            }
        } else {

            if (!formik.errors.password && !formik.errors.email) {

                let user = await axios.post(`${env.APIURL}/login`, {
                    email: formik.values.email,
                    password: formik.values.password
                }
                )
                console.log('user.data', user)

                if (user.data.success) {
                    localStorage.setItem('user', JSON.stringify({
                        _id: user.data.data._id,
                        fullName: user.data.data.fullName,
                        profileImage: user.data.data.profileImage,
                        email: user.data.data.email,
                        token: user.data.token
                    }))
                    setUsers({
                        _id: user.data.data._id,
                        fullName: user.data.data.fullName,
                        profileImage: user.data.data.profileImage,
                        email: user.data.data.email,
                        token: user.data.token
                    })
                    setState({ ...state, loader: false })

                    navigate("/chats")

                } else {
                    setState({
                        error: user.data.message,
                        loader: false
                    })

                }
            } else {
                setState({
                    error: 'Please Fill Out All Fields and photo',
                    loader: false
                })
            }
        }

    }


    useEffect(() => { setState({ ...state, error: '' }) }, [formik.values])



    return (
        <>
            {!login ? <div id="SignUp">
                <div id="main">
                    <div id="head">
                        <h1>Sign Up</h1>
                    </div>
                    <div id="filess" onClick={() => { document.getElementById('User_photo').click() }}>
                        {/* //accept=".png .jpg" */}
                        <input type="file" onChange={(e) => {
                            formik.setValues({ ...formik.values, photo: e.target.files[0] })
                        }} id="User_photo" />
                        {formik.values.photo ?
                            <img src={URL.createObjectURL(formik.values.photo)} className="Photo" />
                            : <label class="custom-file-upload" id="po">
                                Add Photo
                            </label>}
                    </div>
                    <div id="name">
                        <input type="text" id="namE" value={formik.values.fullName} onInput={(e) => { formik.setValues({ ...formik.values, fullName: e.target.value }) }} placeholder="Full Name" />
                    </div>
                    <div id="mail">
                        <input type="text" id="emailS" value={formik.values.email} onInput={(e) => { formik.setValues({ ...formik.values, email: e.target.value }) }} placeholder="Email" />
                    </div>

                    <div id="passward">
                        <input type="password" id="passS" value={formik.values.password} onInput={(e) => { formik.setValues({ ...formik.values, password: e.target.value }) }} placeholder="Passward" />
                    </div>

                    <div id="login_change">
                        <p>Already have account <a onClick={() => { setLogin(!login) }}>Login</a></p>
                    </div>
                    <div id="signup_btn">
                        <button id="Signup" onClick={() => { handleSubmit() }}>
                            {state.loader ? <div className="childLoaderRequest"></div> : 'Sign up'}
                        </button>
                    </div>
                    {state.error && <div className="errorDiv">{state.error}</div>}
                </div>

            </div> :
                <div id="SignUp">
                    <div id="main">
                        <div id="head">
                            <h1>Sign In</h1>
                        </div>
                        <div id="mail">
                            <input type="text" id="emailS" value={formik.values.email} onInput={(e) => { formik.setValues({ ...formik.values, email: e.target.value }) }} placeholder="Email" />
                        </div>
                        <div id="passward">
                            <input type="password" id="passS" value={formik.values.password} onInput={(e) => { formik.setValues({ ...formik.values, password: e.target.value }) }} placeholder="Passward" />
                        </div>
                        <div id="login_change">
                            <p>Create an Account <a onClick={() => { setLogin(!login) }}>Sign Up</a></p>
                        </div>
                        <div id="signup_btn">
                            <button id="Signup" onClick={() => { handleSubmit() }}>
                                {state.loader ? <div className="childLoaderRequest"></div> : 'Sign in'}
                            </button>
                        </div>
                        {state.error && <div className="errorDiv">{state.error}</div>}

                    </div>
                </div>}
        </>
    )

}

export default Auth