import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import PageContainer from "./PageContainer";
import { FaBook, FaLink, FaFileUpload, FaShare } from "react-icons/fa";

const Educational = () => {
  const [resourceName, setResourceName] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceFile, setResourceFile] = useState(null);
  const [uploadType, setUploadType] = useState("file"); // Add upload type state
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources");
      setResources(response.data);
    } catch (error) {
      setMessage({ text: "Error fetching resources. Please try again.", type: "error" });
    }
  };

  const handleFileChange = (e) => {
    setResourceFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resourceName) {
      setMessage({ text: "Please provide a resource name.", type: "error" });
      return;
    }

    if (uploadType === "file" && !resourceFile) {
      setMessage({ text: "Please select a file to upload.", type: "error" });
      return;
    }

    if (uploadType === "url" && (!resourceLink || !resourceLink.startsWith("https://"))) {
      setMessage({ text: "Please provide a valid URL starting with 'https://'.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("name", resourceName);
    formData.append("type", uploadType);
    
    if (uploadType === "file") {
      formData.append("file", resourceFile);
    } else {
      formData.append("link", resourceLink);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResources([response.data, ...resources]);
      setMessage({ text: "Resource uploaded successfully!", type: "success" });
      setResourceName("");
      setResourceLink("");
      setResourceFile(null);
      setUploadType("file");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const firstError = error.response.data.errors[0].msg;
        setMessage({ text: firstError, type: "error" });
      } else {
        setMessage({ text: "Error uploading resource. Please try again.", type: "error" });
      }
    }
  };

  return (
    <PageContainer>
      <EducationalContainer>
        <Header>
          <FaBook className="icon" style={{ color: '#36D1DC' }} />
          Educational Resources
        </Header>
        <Subheader>Empowering sisterhood through knowledge and support.</Subheader>

        {message.text && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <ContentWrapper>
          <LeftColumn>
            <InfoBox>
              <h3>Why Share Educational Resources?</h3>
              <p>
                By sharing educational resources, you are helping to create a safer and more supportive environment for sisterhood. 
                Your contributions empower others with knowledge and tools for personal and professional growth.
              </p>
            </InfoBox>

            <ResourcesSection>
              <h3>Available Resources</h3>
              <ResourceList>
                {resources.length > 0 ? (
                  resources.map((resource, index) => (
                    <ResourceItem key={index}>
                      {resource.type === "url" ? (
                        <ResourceLink href={resource.link} target="_blank" rel="noopener noreferrer">
                          <FaLink className="icon" style={{ color: '#36D1DC' }} />
                          {resource.name}
                        </ResourceLink>
                      ) : (
                        <ResourceLink href={`http://localhost:5000${resource.file_path}`} target="_blank" rel="noopener noreferrer">
                          <FaFileUpload className="icon" style={{ color: '#36D1DC' }} />
                          {resource.name}
                        </ResourceLink>
                      )}
                    </ResourceItem>
                  ))
                ) : (
                  <p>No resources available yet. Be the first to contribute!</p>
                )}
              </ResourceList>
            </ResourcesSection>
          </LeftColumn>

          <RightColumn>
            <Form onSubmit={handleSubmit}>
              <FormTitle>
                <FaShare className="icon" style={{ color: '#36D1DC' }} />
                Upload Educational Resource
              </FormTitle>
              
              <UploadTypeToggle>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="file"
                    checked={uploadType === "file"}
                    onChange={(e) => setUploadType(e.target.value)}
                  />
                  Upload File
                </label>
                <label>
                  <input
                    type="radio"
                    name="uploadType"
                    value="url"
                    checked={uploadType === "url"}
                    onChange={(e) => setUploadType(e.target.value)}
                  />
                  Enter URL
                </label>
              </UploadTypeToggle>

              <FormGroup>
                <Label>Resource Name</Label>
                <Input
                  type="text"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="Enter resource name"
                  required
                />
              </FormGroup>

              {uploadType === "file" ? (
                <FormGroup>
                  <Label>Upload File</Label>
                  <FileInputWrapper>
                    <FileInput
                      type="file"
                      onChange={handleFileChange}
                      id="file-upload"
                      required
                    />
                    <FileInputLabel htmlFor="file-upload">
                      <FaFileUpload className="icon" style={{ color: '#36D1DC' }} />
                      Choose File
                    </FileInputLabel>
                    <FileInputText>
                      {resourceFile ? resourceFile.name : "No file chosen"}
                    </FileInputText>
                  </FileInputWrapper>
                </FormGroup>
              ) : (
                <FormGroup>
                  <Label>Enter URL</Label>
                  <Input
                    type="url"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    placeholder="Enter URL (must start with https://)"
                    required
                  />
                </FormGroup>
              )}

              <SubmitButton type="submit">
                <FaShare className="icon" style={{ color: '#36D1DC' }} />
                Upload Resource
              </SubmitButton>
            </Form>
          </RightColumn>
        </ContentWrapper>
      </EducationalContainer>
    </PageContainer>
  );
};

// Styled Components
const UploadTypeToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: #fff;
    font-size: 0.9rem;

    input[type="radio"] {
      width: 1rem;
      height: 1rem;
      accent-color:#36D1DC;
    }
  }
`;

const EducationalContainer = styled.div`
  width: 100%;
  padding: 2rem;
  min-height: 100%;
  background: #1e1e30;
  box-sizing: border-box;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .icon {
    color:#36D1DC;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subheader = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #a0aec0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div``;

const Message = styled.div`
  background-color: ${(props) => (props.type === "success" ? "rgba(46, 125, 50, 0.1)" : "rgba(198, 40, 40, 0.1)")};
  color: ${(props) => (props.type === "success" ? "#4caf50" : "#f44336")};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 0 auto 2rem;
  max-width: 800px;
  font-weight: 500;
  border: 1px solid ${(props) => (props.type === "success" ? "rgba(46, 125, 50, 0.2)" : "rgba(198, 40, 40, 0.2)")};
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #fff;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    color: #a0aec0;
    line-height: 1.6;
  }
`;

const ResourcesSection = styled(InfoBox)`
  h3 {
    margin-bottom: 1.5rem;
  }
`;

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ResourceItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const ResourceLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;

  .icon {
    color:#36D1DC;
    font-size: 1.1rem;
  }

  &:hover {
    color:#36D1DC;
  }
`;

const NoResources = styled.p`
  color: #a0aec0;
  text-align: center;
  padding: 1rem;
  font-style: italic;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .icon {
    color: #ff4d4d;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color:#36D1DC;
    background: rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #36D1DC;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.3s;
  border: none;
  margin-right: 10px;
  margin-bottom: 0;
  &:hover {
    background: #2596be;
  }
`;

const FileInputText = styled.span`
  color: #a0aec0;
  font-size: 0.9rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background:#36D1DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    background:#36D1DC;
    transform: translateY(-2px);
  }

  .icon {
    font-size: 1.1rem;
  }
`;

export default Educational;