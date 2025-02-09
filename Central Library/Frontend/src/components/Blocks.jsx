import React, { useState } from "react";
import styled from 'styled-components';
import { FaEdit } from "react-icons/fa";

const IntroDiv = styled.div`
    height: ${(props) => props.height || 'auto'};
    width: ${(props) => props.width || '50%'};
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: ${(props) => props.$margin || '20px'};
    padding: 20px;
    background-color: rgba(31, 60, 31, 0.7);
    border-radius: 10px;
    text-align: center;
    border: 1rem solid #92B775;
    position: relative;
    z-index: 1;
    box-sizing: content-box;

    h1 {
        font-size: 6rem;
        color: rgba(243, 232, 211, 1);
        margin-bottom: 20px;
        margin-top: 20px;
        line-height: 1.1;
    }

    h3,h4 {
        font-size: 2rem;
        color: rgba(243, 232, 211, 1);
        margin: 2px;
    }
`;

export const Intro = ({ height, width, margin }) => {
    return (
        <IntroDiv height={height} width={width} $margin={margin}>
            <h1>Central Library</h1>
            <h3>Indian Institute of Technology, Bombay</h3>
            <h4>Mumbai, Maharashtra - 400076</h4>
        </IntroDiv>
    );
};

const ProfileContainer = styled.div`
position: relative;
width: 200px;
height: 200px;
border-radius: 50%;
overflow: hidden;
`;

const ProfileImage = styled.img`
width: 100%;
height: 100%;
object-fit: cover;
scale: 1.025;
border-radius: 50%;
`;

const EditOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'show' // Don't forward 'show' to the DOM
})`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: rgba(0, 0, 0, 0.5);
width: 100%;
height: 100%;
display: ${({ show }) => (show ? "flex" : "none")};
align-items: center;
justify-content: center;
border-radius: 50%;
cursor: pointer;
`;

const EditIcon = styled(FaEdit)`
color: white;
font-size: 24px;
`;

const HiddenFileInput = styled.input`
display: none;
`;

export const ProfilePhoto = ({ profilePhoto, setProfilePhoto }) => {

    const [showEdit, setShowEdit] = useState(false);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
        setProfilePhoto((event.target.files[0]));
        }
    };

    return (
        <ProfileContainer
        onMouseEnter={() => setShowEdit(true)}
        onMouseLeave={() => setShowEdit(false)}
        >
        <ProfileImage src={profilePhoto ? URL.createObjectURL(profilePhoto) : "src/assets/profiles/5.jpg"} alt="Profile" />
        
        <EditOverlay show={showEdit} onClick={() => document.getElementById("fileInput").click()}>
            <EditIcon />
        </EditOverlay>

        <HiddenFileInput
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
        />
        </ProfileContainer>
    );
};