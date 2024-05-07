import Alert from "react-bootstrap/Alert";
import Button from 'react-bootstrap/Button';

export default function EmptyAlert() {
  return (
    <Alert variant="primary" className="mt-4">
      <Alert.Heading>No families here</Alert.Heading>
      <hr />
      <p>You finished all your work today! 🎉</p>
      <p>
        If not yet, load families from <Alert.Link href="https://www.schoolinterviews.com.au/" target="_blank">School Interviews</Alert.Link>, and then reload this page.
      </p>
      <div className="d-flex justify-content-end">
        <Button onClick={() => { window.location.reload() }} variant="outline-primary">
          Refresh
        </Button>
      </div>
    </Alert>
  );
}
