import React,{useState,useEffect} from 'react';
import {Form,Input,message} from 'antd';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import "../styles/RegisterPage.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)
    const submitHandler = async (values) => {
        try{
          setLoading(true);
          await axios.post("/api/v1/users/register",values);
          message.success("Registration Successful");
          setLoading(false);
          navigate("/login");
        }
        catch(error){
          setLoading(false)
          message.error("something went wrong");
        }
    };

  useEffect(() => {
    if(localStorage.getItem('user')){
      navigate('/')
    }
  },[navigate]);
  return (
    <>
      <div className="register-page ">
        {loading && <Spinner />}
        <Form className='register-form' layout='vertical' onFinish={submitHandler}>
            <h2>Register form</h2>
            <Form.Item label="Name" name="name">
                <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input type='email'/>
            </Form.Item>
            <Form.Item label="Password" name="password">
                <Input type='password'/>
            </Form.Item>
            <div className='d-flex justify-content-between'>
                <Link to="/login">Already registered? Click here to login</Link>
                <button className='btn '>Register</button>
            </div>
        </Form>
      </div>
    </>
  )
}

export default Register
