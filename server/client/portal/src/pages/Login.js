import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Icon, Input, Button, Alert, Card } from 'antd';

// Internal imports
import './Login.scss';
import { login } from '../services/auth.service';
import { setToken } from '../utils/auth';

class LoginForm extends React.Component {
  state = {
    loading: false
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ error: false, loading: true });
        login(values)
          .then(res => {
            this.setState({ loading: false });
            const { token } = res;
            setToken(token);
            this.props.history.push(`/panel`);
          })
          .catch(err => {
            this.setState({ loading: false });
            this.setState({ error: true });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { error, loading } = this.state;
    return (
      <div id="login-container">
        <Card id="login">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <h2>Login</h2>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
                className="login-form-button"
                disabled={loading}
              >
                {loading ? <Icon type="loading" /> : 'Log in'}
              </Button>
              Or <Link to="/register">register now!</Link>
            </Form.Item>
            {error ? (
              <Alert
                message="Invalid credentials"
                description="Please check your email and password"
                type="error"
              />
            ) : (
              ''
            )}
          </Form>
        </Card>
      </div>
    );
  }
}

export const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
