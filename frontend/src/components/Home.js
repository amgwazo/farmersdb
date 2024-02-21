import React from "react";
import { Container, Row, Col, Carousel, ListGroup } from "react-bootstrap";
import apple from '../images/apples.jpg';
import cows from "../images/cows.jpg";

const Home = () => {
  return (
    <div>
      <Container className="container-padding ">
        <Row>
          <Col>
            <Carousel className="carousel">
              <Carousel.Item>
                <img className="d-block w-100 " src={cows} alt="First slide" />
                <Carousel.Caption>
                  <h3>Hero Section</h3>
                  <p>Placeholder text for hero section.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img className="d-block w-100" src={apple} alt="First slide" />
                <Carousel.Caption>
                  <h3>Hero Section</h3>
                  <p>Placeholder text for hero section.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col md={8}>
            <div className="left-panel">
              {" "}
              {/* Add className for left panel */}
              <div className="panel-content">
                <h2>Who We Are</h2>
                <p>Description about the farmer cooperative union.</p>
                <h2>What We Do</h2>
                <p>Description of the activities and services provided.</p>
                <h2>Our Members</h2>
                <p>List of member farmers or cooperative organizations.</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="right-panel">
              <div className="panel-content">
                <h2>Today's Popular Commodities</h2>
                <ListGroup>
                  <ListGroup.Item>Corn - $3.50/bushel</ListGroup.Item>
                  <ListGroup.Item>Wheat - $5.20/bushel</ListGroup.Item>
                  {/* Add more ListGroup.Items as needed */}
                </ListGroup>
                <h2>External Agricultural Resources</h2>
                <ul>
                  <li>
                    <a
                      href="https://www.agriculture.gov.zm/#the-comprehensive-agriculture-transformation-program-catsp-"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Agriculture - Zambia
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://agriwelfare.gov.in/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Agriculture - India
                    </a>
                  </li>
                  {/* Add more resource links as needed */}
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
