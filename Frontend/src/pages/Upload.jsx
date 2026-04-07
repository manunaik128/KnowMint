import React from 'react'
import "../styles/Upload.css"

const Upload = () => {
  return (
    

<div class="container">

    <h1>Upload Notes</h1>
    <p class="desc">
        Share your study materials by uploading your notes. 
        Tag them with the correct semester, subject and branch for better organization.
    </p>

    <div class="upload-box">

        <div classname="upload-icon">
            📁
        </div>

        <p>Drag & drop your PDF notes here or</p>

        <button class="browse-btn">Browse Files</button>

        <input type="text" placeholder="Enter title of your notes..." class="input"/>

        <div class="row">

            <select>
                <option>Select Semester</option>
                <option>1st Semester</option>
                <option>2nd Semester</option>
                <option>3rd Semester</option>
            </select>

            <select>
                <option>Select Subject</option>
                <option>Web Design</option>
                <option>Python</option>
                <option>Database</option>
            </select>

            <select>
                <option>Select Branch</option>
                <option>BCA</option>
                <option>BSC</option>
                <option>BTECH</option>
            </select>

        </div>

        <div class="buttons">

            <button class="upload-btn">Upload Note</button>
            <button class="cancel-btn">Cancel</button>

        </div>

        <p class="note">
            Please upload only educational materials in PDF format (max size: 20MB)
        </p>

    </div>

</div>



    
  )
}

export default Upload
