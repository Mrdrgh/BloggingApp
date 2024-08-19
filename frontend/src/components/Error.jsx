import React from "react";


function Error(props) {
    return (<>
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
  <strong>Error! </strong> {props.error}
  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div> 
    </>
    )
};

function Alert(props) {
    return (<>
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
  {props.error}.
  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
        </>
    )
};

function Success(props) {
    return (
        <>
            <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Notification: </strong> {props.error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div> 
        </>
    )
};

export {Error, Alert, Success};