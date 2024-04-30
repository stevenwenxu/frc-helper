import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { OptionsRepository } from "../common/options_repository";

export default function Options() {
  const [saveStatus, setSaveStatus] = useState("");
  const [displayMode, setDisplayMode] = useState("tab");

  useEffect(() => {
    OptionsRepository.getDisplayMode().then((displayMode) => {
      setDisplayMode(displayMode);
    });
  }, []);

  const onDisplayModeUpdate = (newDisplayMode: string) => {
    OptionsRepository.setDisplayMode(newDisplayMode).then(() => {
      setDisplayMode(newDisplayMode);
      setSaveStatus("Options saved.");
      setTimeout(() => {
        setSaveStatus("");
      }, 2000);
    });
  };

  return (
    <>
      <Container className="mb-4">
        <Form.Label htmlFor="displayMode">Open the tool in:</Form.Label>
        <Form.Select
          id="displayMode"
          value={displayMode}
          onChange={(event) => { onDisplayModeUpdate(event.target.value)}}
        >
          <option value="tab">a new tab</option>
          <option value="popup">a popup window</option>
        </Form.Select>

        <div>{saveStatus}</div>
      </Container>
    </>
  )
}
