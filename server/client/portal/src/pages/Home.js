import React from 'react';
import { Layout, Menu, Icon, Row, Col, Card } from 'antd';

import './Home.scss';
import { xcode } from 'react-syntax-highlighter/dist/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { me } from '../services/auth.service';
import { removeToken } from '../utils/auth';

const { Header, Content, Sider } = Layout;

export class HomePage extends React.Component {
  state = {
    collapsed: false,
    loading: false,
    error: false,
    me: null,
    page: 'script'
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  getMe = () => {
    this.setState({ loading: true });
    me()
      .then(res => {
        this.setState({ me: res });
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  };

  logout = () => {
    removeToken();
    this.props.history.push('/login');
  };

  setPage = menuItem => {
    this.setState({ page: menuItem.key });
  };

  componentDidMount() {
    this.getMe();
  }

  render() {
    const { loading, me, error, page } = this.state;
    return (
      <Layout style={{ height: '100vh' }}>
        <Header className="header" style={{ padding: '0' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item id="logout-button" key="logout" onClick={this.logout}>
              Exit
            </Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['script']}
              defaultOpenKeys={['script']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="script" onClick={this.setPage}>
                <span>
                  <Icon type="code" />
                  Script
                </span>
              </Menu.Item>
              <Menu.Item key="profile" onClick={this.setPage}>
                <span>
                  <Icon type="robot" />
                  Profile
                </span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            {page === 'script' ? (
              <Content
                style={{
                  background: '#fff',
                  padding: 24,
                  margin: 0,
                  minHeight: 280
                }}
              >
                <h2>Your setup</h2>
                <h1>
                  Copy the code below and paste it directly before the closing body tag of your
                  website's html
                </h1>

                {loading ? <Icon type="loading" /> : ''}
                {me ? (
                  <SyntaxHighlighter style={xcode}>{`<!-- Start of Feedback Code -->
    <script>
        window.feedbackApp = {
            widget: '${me.siteToken}'
        };
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            js = d.createElement(s);
            js.id = id;
            js.src = "http://localhost:8080/cdn/index.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script");
    </script>
<!-- End of Feedback Code -->`}</SyntaxHighlighter>
                ) : (
                  ''
                )}
                {error ? 'Something went wrong, try again later' : ''}
              </Content>
            ) : (
              ''
            )}

            {page === 'profile' ? (
              <Content
                style={{
                  background: '#fff',
                  padding: 24,
                  margin: 0,
                  minHeight: 280
                }}
              >
                <h2>Nice to have you :)</h2>

                {loading ? <Icon type="loading" /> : ''}
                {me ? (
                  <div>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Card title="Name" bordered={true}>
                          {me.name}
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card title="Email" bordered={true}>
                          {me.email}
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card title="Site URL" bordered={true}>
                          {me.siteUrl}
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  ''
                )}
                {error ? 'Something went wrong, try again later' : ''}
              </Content>
            ) : (
              ''
            )}
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
