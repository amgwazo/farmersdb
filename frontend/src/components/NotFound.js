import { Button } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";

const NotFound = () => {
 const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="container m-auto w-25 text-warning">
      <h1>404!</h1>
      <p>Page Not Found</p>
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
    </div>
  );
};

export default NotFound;
