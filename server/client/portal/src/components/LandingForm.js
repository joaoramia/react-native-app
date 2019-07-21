import React from 'react';
import { Form, Input, Button } from 'antd';

import './LandingForm.scss';

class LandingForm extends React.Component {

    state = {
        site: ''
    }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
        e.preventDefault();
  };

  handleChange = e => {
      this.setState({site: e.target.value});
  }

  render() {
    const { site } = this.state;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
          <p className="form-title"><strong>Converta</strong> seus visitantes em clientes</p>
        <Form.Item className="url-input">
            <Input
                type="text"
                placeholder="Coloque aqui a URL do seu site"
                onChange={this.handleChange}
            />
        </Form.Item>
        <Form.Item className="button-input">
          <Button type="primary" htmlType="submit" disabled={!site}>
            Criar conta grátis
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export const WrappedLandingForm = Form.create({ name: 'horizontal_login' })(LandingForm);
