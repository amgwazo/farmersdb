import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <div className="container  login-container bg-dark p-3  rounded my-1">
        <h1 className="my-0 w-100 ps-2 ms-2 text-warning">{"UnAuthorized"}</h1>

        <Form onSubmit="" className=" pt-3">
            <p>You do not have access to the requested page.</p>
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
