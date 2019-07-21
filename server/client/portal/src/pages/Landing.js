import React from 'react';
import { Link } from 'react-router-dom'
import { Menu, Layout } from 'antd';
import { WrappedLandingForm } from '../components/LandingForm';
import TopBar from '../components/topBar';
import logo from '../assets/img/bananas.svg';
import './Landing.scss';

const { Header, Footer, Content } = Layout;

export class LandingPage extends React.Component {
  state = {
    current: 'mail',
  };

  render() {
    return (
        <Layout className="layout">
          {/* <TopBar></TopBar> */}
          <Header className="header">
            <div className="logo">
              <img className="animated swing delay-5s" src={logo} alt="Logo" />
            </div>
            <Menu
              theme="light"
              mode="horizontal"
              className="menu"
            >
              {/* <Menu.Item key="1">Suporte</Menu.Item>
              <Menu.Item key="2">Blog</Menu.Item>
              <Menu.Item key="3">Preços</Menu.Item>
              <Menu.Item key="4">Contato</Menu.Item> */}
              <Menu.Item key="5" className="login">
                <Link to="/login">
                  <span className="login-button">Login</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="content">
            <WrappedLandingForm></WrappedLandingForm>
          </Content>
          <Footer className="footer">Banana</Footer>
        </Layout>
      );
  }
}

// ReactDOM.render(<Landing />, mountNode);