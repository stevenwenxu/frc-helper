import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';


export default function SidePanel() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => { setShow(true) }}>
        Add new family
      </Button>

      <Offcanvas show={show} placement="end" onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>New Family</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
