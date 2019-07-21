import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Icon, Input, Button, Alert, Card } from 'antd';

// Internal imports
import './Register.scss';
import { register } from '../services/auth.service';
import { setToken } from '../utils/auth';

class RegisterForm extends React.Component {
  state = {
    loading: false
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ error: false, loading: true });
        register(values)
          .then(res => {
            const { token } = res;
            setToken(token);
            this.setState({ loading: false });
            this.props.history.push(`/panel`);
          })
          .catch(err => {
            this.setState({ error: err.data.message.message, loading: false });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { error, loading } = this.state;
    return (
      <div id="register-container">
        <Card id="register">
          <Form onSubmit={this.handleSubmit} className="register-form">
            <h2>Register</h2>
            <Form.Item>
              {getFieldDecorator('siteUrl', {
                rules: [{ required: true, message: 'Please input your website url!' }]
              })(
                <Input
                  prefix={<Icon type="laptop" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="www.yoursite.com"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your name!' }]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Name"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }]
              })(
                <Input
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                disabled={loading}
              >
                {loading ? <Icon type="loading" /> : 'Register'}
              </Button>
              Or <Link to="/login">login now!</Link>
            </Form.Item>
            {error ? <Alert message="Error" description={error} type="error" /> : ''}
          </Form>
        </Card>
      </div>
    );
  }
}

export const WrappedRegisterForm = Form.create({ name: 'normal_login' })(RegisterForm);
