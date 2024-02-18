import { Button, Form } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";

const NotFound = () => {
 const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <>
      <div className="container  login-container bg-dark p-3  rounded my-1">
        <h1 className="my-0 w-100 ps-2 ms-2 text-warning">{"404!"}</h1>

        <Form onSubmit="" className=" pt-3">
          <p>Page Not found!</p>
          <div className="flexGrow">
            <Button
              variant="outline-success"
              onClick={goBack}
              type="button"
              className="me-2 fw-bold"
            >
              Back
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default NotFound;
