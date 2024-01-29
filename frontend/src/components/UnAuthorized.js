import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="container m-auto w-25 text-warning">
      <h1>Unauthorized!</h1>
      <p>You do not have access to the requested page.</p>
      <div className="flexGrow">
        <Button variant="outline-success" onClick={goBack} type="button" className="me-2 fw-bold">
          Back
        </Button>
      </div>
    </div>

    // <section>
    //   <h1>Unauthorized</h1>
    //   <br />
    //   <p>You do not have access to the requested page.</p>
    //   <div className="flexGrow">
    //     <button onClick={goBack}>Go Back</button>
    //   </div>
    // </section>
  );
};

export default Unauthorized;
