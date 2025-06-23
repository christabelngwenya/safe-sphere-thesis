import React, { useState } from "react";
import styled from "styled-components";
import { FaUpload, FaLink, FaFile, FaTrash } from "react-icons/fa";
import axios from "axios";

const ResourcesContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px;
`;

const ResourceForm = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const FormTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const FileInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    border-color: #3498db;
  }
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ResourcesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ResourceCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ResourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ResourceTitle = styled.h3`
  color: #2c3e50;
  margin: 0;
`;

const ResourceType = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ResourceDescription = styled.p`
  color: #34495e;
  margin-bottom: 15px;
`;

const ResourceActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: #2c3e50;
  }
`;

const EducationalResources = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setLink(""); // Clear link if file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("userId", user.id);
      
      if (file) {
        formData.append("file", file);
      } else if (link) {
        formData.append("link", link);
      }

      const response = await axios.post("http://localhost:5000/api/resources", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setResources([response.data, ...resources]);
      setTitle("");
      setDescription("");
      setFile(null);
      setLink("");
    } catch (error) {
      console.error("Error submitting resource:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/resources/${resourceId}`);
      setResources(resources.filter(resource => resource.id !== resourceId));
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  return (
    <ResourcesContainer>
      <ResourceForm>
        <FormTitle>Share Educational Resource</FormTitle>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Description</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Upload File or Share Link</Label>
            <FileInput>
              <label htmlFor="file-upload">
                <FaUpload /> Upload File
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <span>or</span>
              <Input
                type="url"
                placeholder="Paste link here"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{ flex: 1 }}
              />
            </FileInput>
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Sharing..." : "Share Resource"}
          </SubmitButton>
        </form>
      </ResourceForm>

      <ResourcesList>
        {resources.map((resource) => (
          <ResourceCard key={resource.id}>
            <ResourceHeader>
              <ResourceTitle>{resource.title}</ResourceTitle>
              <ResourceType>
                {resource.fileUrl ? <FaFile /> : <FaLink />}
              </ResourceType>
            </ResourceHeader>
            <ResourceDescription>{resource.description}</ResourceDescription>
            {resource.fileUrl && (
              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            )}
            {resource.link && (
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                Visit Link
              </a>
            )}
            {resource.userId === user.id && (
              <ResourceActions>
                <ActionButton onClick={() => handleDelete(resource.id)}>
                  <FaTrash />
                </ActionButton>
              </ResourceActions>
            )}
          </ResourceCard>
        ))}
      </ResourcesList>
    </ResourcesContainer>
  );
};

export default EducationalResources; 