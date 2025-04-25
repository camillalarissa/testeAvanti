// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";

import logoGithub from "./assets/github2.png";
import logo from "./assets/github1.png";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setShowResult(false);

    try {
      const fetchPromise = fetch(`https://api.github.com/users/${username}`);
      const minDelay = new Promise((resolve) => setTimeout(resolve, 800));

      const [response] = await Promise.all([fetchPromise, minDelay]);

      if (!response.ok) {
        throw new Error(
          "Nenhum perfil foi encontrado com esse nome de usuário."
        );
      }

      const data = await response.json();
      setUserData(data);
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Efeito para animação de entrada dos resultados
  useEffect(() => {
    if (userData) {
      setShowResult(true);
    }
  }, [userData]);

  return (
    <div className="app-background">
      <div className="dots-pattern"></div>
      <div className="blue-glow top-right"></div>
      <div className="blue-glow-left bottom-left"></div>

      <Container className="main-content">
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={10}>
            <div className="mb-5 github-container">
              <div className="title-main text-center mb-4">
                <div className="d-flex justify-content-center align-items-center">
                  <img src={logo} alt="Logo GitHub" className="github-icon" />
                  <h1 className="">
                    Perfil{" "}
                    <span className="github-highlight">
                      <img
                        src={logoGithub}
                        alt="Logo GitHub"
                        className="github-icon2"
                      />
                    </span>
                  </h1>
                </div>
              </div>

              <div className="search-wrapper">
                <div className="input-group search-input-group">
                  <Form.Control
                    placeholder="Digite um usuário do Github"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`search-input ${
                      loading ? "input-disabled" : ""
                    }`}
                    disabled={loading}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSearch}
                    className="search-button"
                    disabled={loading || !username.trim()}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <FaSearch />
                    )}
                  </Button>
                </div>
              </div>

              {loading && (
                <div className="search-animation-container">
                  <div className="loading-container">
                    <Spinner
                      animation="border"
                      variant="primary"
                      className="mb-2"
                    />
                    <p className="loading-text">Buscando perfil do GitHub...</p>
                    <div className="loading-bar">
                      <div className="loading-progress"></div>
                    </div>
                  </div>

                  <Card className="profile-result mt-4 skeleton-card">
                    <Card.Body>
                      <Row>
                        <Col
                          xs={12}
                          sm={4}
                          className="text-center text-sm-left mb-3 mb-sm-0"
                        >
                          <div className="skeleton-avatar pulse"></div>
                        </Col>
                        <Col xs={12} sm={8}>
                          <div className="skeleton-title pulse"></div>
                          <div className="skeleton-text pulse"></div>
                          <div
                            className="skeleton-text pulse"
                          ></div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {error && !loading && (
                <Alert
                  variant="danger"
                  className="text-center error-message fade-in-effect"
                >
                  <p className="mb-1">{error}</p>
                  <p className="mb-0">Tente novamente</p>
                </Alert>
              )}

              {userData && showResult && !loading && (
                <div className="fade-in-effect">
                  <Card className="profile-result mt-4">
                    <Card.Body>
                      <Row>
                        <Col
                          xs={12}
                          sm={4}
                          className="text-center text-sm-left mb-3 mb-sm-0"
                        >
                          <img
                            src={userData.avatar_url}
                            alt={`${userData.login}'s avatar`}
                            className="profile-avatar"
                          />
                        </Col>
                        <Col xs={12} sm={8}>
                          <h2 className="profile-name">
                            {userData.name || userData.login}
                          </h2>
                          <p className="profile-username">@{userData.login}</p>
                          <p className="profile-bio">
                            {userData.bio || "Este usuário não possui uma bio."}
                            {userData.bio && <span className="ml-1">🚀</span>}
                          </p>
                          <div className="profile-stats">
                            <div className="stat-item">
                              <span className="stat-value">
                                {userData.followers}
                              </span>
                              <span className="stat-label">Seguidores</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-value">
                                {userData.following}
                              </span>
                              <span className="stat-label">Seguindo</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-value">
                                {userData.public_repos}
                              </span>
                              <span className="stat-label">Repositórios</span>
                            </div>
                          </div>
                          {userData.html_url && (
                            <Button
                              href={userData.html_url}
                              target="_blank"
                              variant="outline-primary"
                              className="mt-3 profile-button"
                            >
                              Ver Perfil no GitHub
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
